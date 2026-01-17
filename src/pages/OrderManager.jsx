import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllProductOrders, updateProductOrder, deleteProductOrder } from '../api/productOrder';
import { Package, Phone, Mail, MessageSquare, X, CheckCircle, Clock, XCircle } from 'lucide-react';
import { showSuccess, showError, showConfirm } from '../utils/i18nHelpers';

const OrderManager = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'processing', 'completed', 'cancelled'
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllProductOrders();
      setOrders(data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showError('failedToLoad', t('sidebar.orders'));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateProductOrder(orderId, { status: newStatus });
      showSuccess('updated', t('pages.orders.orderStatus'));
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      showError('failedToUpdate', t('pages.orders.orderStatus'));
    }
  };

  const handleSaveNotes = async (orderId) => {
    try {
      await updateProductOrder(orderId, { notes });
      showSuccess('saved', t('pages.orders.notes'));
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, notes });
      }
      setNotes('');
    } catch (error) {
      console.error('Error saving notes:', error);
      showError('failedToSave', t('pages.orders.notes'));
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!showConfirm('delete')) return;

    try {
      await deleteProductOrder(orderId);
      showSuccess('deleted', t('sidebar.orders'));
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setShowDetailsModal(false);
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      showError('failedToDelete', t('sidebar.orders'));
    }
  };

  const openDetailsModal = (order) => {
    setSelectedOrder(order);
    setNotes(order.notes || '');
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
    setNotes('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return t('pages.orders.pending');
      case 'processing':
        return t('pages.orders.processing');
      case 'completed':
        return t('pages.orders.completed');
      case 'cancelled':
        return t('pages.orders.cancelled');
      default:
        return status;
    }
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  if (loading) {
    return (
      <div className="p-8" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-admin-text)]">{t('sidebar.orders')}</h1>
        <div className="flex items-center gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-[var(--color-admin-border)] rounded-lg bg-[var(--color-admin-surface)] text-[var(--color-admin-text)]"
          >
            <option value="all">{t('pages.orders.allOrders')}</option>
            <option value="pending">{t('pages.orders.pending')}</option>
            <option value="processing">{t('pages.orders.processing')}</option>
            <option value="completed">{t('pages.orders.completed')}</option>
            <option value="cancelled">{t('pages.orders.cancelled')}</option>
          </select>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-[var(--color-admin-primary)] text-white rounded-lg hover:bg-[var(--color-admin-primary-dark)] transition-colors"
          >
            {t('pages.orders.refresh')}
          </button>
        </div>
      </div>

      <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-admin-text-muted)]">
            {t('pages.orders.noOrdersFound')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--color-admin-muted)]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.orders.orderId')}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.orders.product')}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.orders.customer')}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.orders.contact')}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('common.status')}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('pages.orders.date')}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-admin-text)]">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-t border-[var(--color-admin-border)] hover:bg-[var(--color-admin-muted)] transition-colors">
                    <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">
                      {order.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4">
                      {order.product ? (
                        <div className="flex items-center gap-3">
                          {order.product.imageUrl && (
                            <img
                              src={`http://localhost:5000${order.product.imageUrl}`}
                              alt={order.product.titleEn}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          )}
                          <div>
                            <p className="text-sm font-semibold text-[var(--color-admin-text)]">
                              {order.product.titleEn}
                            </p>
                            {order.product.price && (
                              <p className="text-xs text-[var(--color-admin-text-muted)]">
                                {parseFloat(order.product.price).toFixed(2)} AED
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-[var(--color-admin-text-muted)]">{t('pages.orders.noProduct')}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-admin-text)]">{order.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-[var(--color-admin-text)]">
                          <Phone className="w-4 h-4" />
                          {order.countryCode} {order.phone}
                        </div>
                        {order.email && (
                          <div className="flex items-center gap-2 text-sm text-[var(--color-admin-text-muted)]">
                            <Mail className="w-4 h-4" />
                            {order.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-admin-text-muted)]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openDetailsModal(order)}
                        className="px-3 py-1 text-sm bg-[var(--color-admin-primary)] text-white rounded-lg hover:bg-[var(--color-admin-primary-dark)] transition-colors"
                      >
                        {t('pages.orders.viewDetails')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[var(--color-admin-surface)] rounded-xl border border-[var(--color-admin-border)] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[var(--color-admin-border)] flex items-center justify-between">
              <h2 className="text-xl font-bold text-[var(--color-admin-text)]">{t('pages.orders.orderDetails')}</h2>
              <button
                onClick={closeDetailsModal}
                className="p-2 hover:bg-[var(--color-admin-muted)] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[var(--color-admin-text)]" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-admin-text-muted)] mb-3">{t('pages.orders.orderInformation')}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-[var(--color-admin-text-muted)]">{t('pages.orders.orderId')}:</span>
                    <span className="text-sm text-[var(--color-admin-text)] font-mono">{selectedOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[var(--color-admin-text-muted)]">{t('common.status')}:</span>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      {getStatusIcon(selectedOrder.status)}
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[var(--color-admin-text-muted)]">{t('pages.orders.date')}:</span>
                    <span className="text-sm text-[var(--color-admin-text)]">
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              {selectedOrder.product && (
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-admin-text-muted)] mb-3">{t('pages.orders.product')}</h3>
                  <div className="flex items-center gap-4 p-4 bg-[var(--color-admin-muted)] rounded-lg">
                    {selectedOrder.product.imageUrl && (
                      <img
                        src={`http://localhost:5000${selectedOrder.product.imageUrl}`}
                        alt={selectedOrder.product.titleEn}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-[var(--color-admin-text)]">{selectedOrder.product.titleEn}</p>
                      {selectedOrder.product.price && (
                        <p className="text-sm text-[var(--color-admin-text-muted)]">
                          {parseFloat(selectedOrder.product.price).toFixed(2)} AED
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-admin-text-muted)] mb-3">{t('pages.orders.customerInformation')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-[var(--color-admin-text-muted)]" />
                    <span className="text-sm text-[var(--color-admin-text)]">{selectedOrder.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[var(--color-admin-text-muted)]" />
                    <span className="text-sm text-[var(--color-admin-text)]">
                      {selectedOrder.countryCode} {selectedOrder.phone}
                    </span>
                  </div>
                  {selectedOrder.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-[var(--color-admin-text-muted)]" />
                      <span className="text-sm text-[var(--color-admin-text)]">{selectedOrder.email}</span>
                    </div>
                  )}
                  {selectedOrder.message && (
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-[var(--color-admin-text-muted)] mt-1" />
                      <p className="text-sm text-[var(--color-admin-text)] flex-1">{selectedOrder.message}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-admin-text-muted)] mb-3">{t('pages.orders.updateStatus')}</h3>
                <div className="flex gap-2 flex-wrap">
                  {['pending', 'processing', 'completed', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedOrder.id, status)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        selectedOrder.status === status
                          ? 'bg-[var(--color-admin-primary)] text-white'
                          : 'bg-[var(--color-admin-muted)] text-[var(--color-admin-text)] hover:bg-[var(--color-admin-border)]'
                      }`}
                    >
                      {getStatusLabel(status)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-admin-text-muted)] mb-3">{t('pages.orders.notes')}</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('pages.orders.addNotesPlaceholder')}
                  className="w-full px-4 py-3 border border-[var(--color-admin-border)] rounded-lg bg-[var(--color-admin-surface)] text-[var(--color-admin-text)] resize-none h-24"
                />
                <button
                  onClick={() => handleSaveNotes(selectedOrder.id)}
                  className="mt-2 px-4 py-2 bg-[var(--color-admin-primary)] text-white rounded-lg hover:bg-[var(--color-admin-primary-dark)] transition-colors"
                >
                  {t('pages.orders.saveNotes')}
                </button>
                {selectedOrder.notes && (
                  <div className="mt-3 p-3 bg-[var(--color-admin-muted)] rounded-lg">
                    <p className="text-sm text-[var(--color-admin-text)]">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-admin-border)]">
                <button
                  onClick={() => handleDeleteOrder(selectedOrder.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  {t('pages.orders.deleteOrder')}
                </button>
                <button
                  onClick={closeDetailsModal}
                  className="px-4 py-2 bg-[var(--color-admin-muted)] text-[var(--color-admin-text)] rounded-lg hover:bg-[var(--color-admin-border)] transition-colors"
                >
                  {t('common.close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManager;
