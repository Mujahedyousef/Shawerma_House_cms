import React, { useRef, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import API from '../services/API';

const RichTextEditor = ({ value, onChange, placeholder, dir = 'ltr' }) => {
  const quillRef = useRef(null);

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      
      // Custom image handler
      const toolbar = quill.getModule('toolbar');
      toolbar.addHandler('image', async () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
          const file = input.files?.[0];
          if (file) {
            try {
              // Create FormData for image upload
              const formData = new FormData();
              formData.append('image', file);

              // Upload image to server
              const response = await API.post('/upload/image', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });

              const imageUrl = response.data.data?.url || response.data.url || `/uploads/${response.data.data?.filename || response.data.filename}`;
              
              // Get current selection
              const range = quill.getSelection(true);
              
              // Insert image at cursor position
              quill.insertEmbed(range.index, 'image', imageUrl);
              
              // Move cursor after image
              quill.setSelection(range.index + 1);
            } catch (error) {
              console.error('Error uploading image:', error);
              alert('Failed to upload image. Please try again.');
            }
          }
        };
      });
    }
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        // Image handler is set up in useEffect
      }
    },
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'color', 'background',
    'align',
    'link', 'image', 'video'
  ];

  return (
    <div className="rich-text-editor" dir={dir}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          backgroundColor: 'var(--color-admin-surface)',
          color: 'var(--color-admin-text)',
        }}
      />
      <style>{`
        .rich-text-editor .ql-editor {
          min-height: 300px;
          color: var(--color-admin-text);
          background-color: var(--color-admin-surface);
        }
        .rich-text-editor .ql-container {
          font-size: 14px;
          font-family: inherit;
        }
        .rich-text-editor .ql-toolbar {
          background-color: var(--color-admin-muted);
          border-top: 1px solid var(--color-admin-border);
          border-left: 1px solid var(--color-admin-border);
          border-right: 1px solid var(--color-admin-border);
          border-radius: 12px 12px 0 0;
        }
        .rich-text-editor .ql-container {
          border-bottom: 1px solid var(--color-admin-border);
          border-left: 1px solid var(--color-admin-border);
          border-right: 1px solid var(--color-admin-border);
          border-radius: 0 0 12px 12px;
        }
        .rich-text-editor .ql-stroke {
          stroke: var(--color-admin-text);
        }
        .rich-text-editor .ql-fill {
          fill: var(--color-admin-text);
        }
        .rich-text-editor .ql-picker-label {
          color: var(--color-admin-text);
        }
        .rich-text-editor .ql-picker-options {
          background-color: var(--color-admin-surface);
          border: 1px solid var(--color-admin-border);
          color: var(--color-admin-text);
        }
        .rich-text-editor .ql-picker-item:hover {
          background-color: var(--color-admin-muted);
        }
        .rich-text-editor .ql-snow .ql-picker.ql-expanded .ql-picker-label {
          border-color: var(--color-admin-border);
        }
        .rich-text-editor .ql-snow .ql-picker.ql-expanded .ql-picker-options {
          border-color: var(--color-admin-border);
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
