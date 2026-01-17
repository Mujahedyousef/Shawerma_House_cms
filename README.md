# Central Jordan CMS

Content Management System for the Central Jordan website.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root with:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Make sure the backend server is running on `http://localhost:5000`

4. Start the CMS:
```bash
npm run dev
```

## Features

### Hero Section Management
- Edit title, description, and button text (English & Arabic)
- Upload multiple videos/images for the hero background
- Navigate between multiple media items
- Manage statistics cards (4 cards at the bottom)
- Drag & drop reordering (planned)

## Project Structure

```
CMS/
├── src/
│   ├── api/           # API calls to backend
│   ├── pages/         # CMS pages
│   ├── services/      # API service configuration
│   └── App.jsx        # Main application
```

## Available Routes

- `/` - Hero Section Management (currently the only page)

## Future Features

- Categories management
- Solutions/Services management
- Projects management
- Articles management
- Section ordering
- Theme customization
- Multi-language support for CMS interface
