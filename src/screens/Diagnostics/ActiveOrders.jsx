import React, { useState } from 'react';
import DiagnosticsService from '../../services/DiagnosticsService';
import './ActiveOrders.css';

const ActiveOrders = ({ orders, onCollectSample, onGenerateRequisition, onCancelOrder }) => {
  const [expandedOrders, setExpandedOrders] = useState({});
  const [cancelReason, setCancelReason] = useState('');
  const [cancellingOrder, setCancellingOrder] = useState(null);

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleCancelOrder = () => {
    if (cancellingOrder && cancelReason) {
      onCancelOrder(cancellingOrder, cancelReason);
      setCancellingOrder(null);
      setCancelReason('');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#ffc107',
      'samples-collected': '#17a2b8',
      'in-progress': '#007bff',
      'completed': '#28a745',
      'cancelled': '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (orders.length === 0) {
    return (
      <div className="no-active-orders">
        <p>No active diagnostic orders</p>
      </div>
    );
  }

  return (
    <div className="active-orders">
      <h2>Active Diagnostic Orders</h2>
      
      <div className="orders-list">
        {orders.map(order => {
          const isExpanded = expandedOrders[order.id];
          const hasReferenceTests = order.tests.some(t => {
            const test = DiagnosticsService.testCatalog.find(tc => tc.id === t.testId);
            return test && test.type === 'reference';
          });

          return (
            <div key={order.id} className="order-card">
              <div 
                className="order-header"
                onClick={() => toggleOrderExpansion(order.id)}
              >
                <div className="order-info">
                  <span className="order-id">Order #{order.id}</span>
                  <span className="order-date">{formatDate(order.orderDate)}</span>
                  <span 
                    className="order-status"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status.replace('-', ' ').toUpperCase()}
                  </span>
                  {order.priority !== 'routine' && (
                    <span className={`priority-badge ${order.priority}`}>
                      {order.priority.toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="order-summary">
                  <span>{order.tests.length} tests</span>
                  <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
                </div>
              </div>

              {isExpanded && (
                <div className="order-details">
                  <div className="tests-section">
                    <h4>Ordered Tests</h4>
                    <div className="test-items">
                      {order.tests.map(test => (
                        <div key={test.testId} className="test-row">
                          <div className="test-info">
                            <span className="test-name">{test.name}</span>
                            <span className={`test-status ${test.status}`}>
                              {test.status.replace('-', ' ')}
                            </span>
                          </div>
                          
                          {test.status === 'ordered' && !test.sampleCollected && (
                            <button
                              className="collect-sample-btn"
                              onClick={() => onCollectSample(order.id, test.testId)}
                            >
                              Mark Sample Collected
                            </button>
                          )}
                          
                          {test.sampleCollected && (
                            <div className="sample-info">
                              <span className="collected-time">
                                Collected: {formatDate(test.sampleCollectionTime)}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="order-actions">
                    {hasReferenceTests && !order.requisitionGenerated && (
                      <button
                        className="requisition-btn"
                        onClick={() => onGenerateRequisition(order.id)}
                      >
                        Generate Lab Requisition
                      </button>
                    )}
                    
                    {order.requisitionGenerated && (
                      <div className="requisition-info">
                        <span>Requisition #: {order.labRequisitionNumber}</span>
                      </div>
                    )}

                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                      <button
                        className="cancel-order-btn"
                        onClick={() => setCancellingOrder(order.id)}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>

                  <div className="order-cost">
                    <span>Total Cost: ${order.totalCost.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {cancellingOrder && (
        <div className="cancel-modal">
          <div className="modal-overlay" onClick={() => setCancellingOrder(null)} />
          <div className="modal-content">
            <h3>Cancel Order</h3>
            <p>Please provide a reason for cancellation:</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Cancellation reason..."
              rows={3}
            />
            <div className="modal-actions">
              <button onClick={() => setCancellingOrder(null)}>Cancel</button>
              <button 
                className="confirm-cancel"
                onClick={handleCancelOrder}
                disabled={!cancelReason}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveOrders;