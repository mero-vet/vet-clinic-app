import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';
import { usePIMS } from '../context/PIMSContext';
import DiagnosticsService from '../services/DiagnosticsService';
import PIMSScreenWrapper from '../components/PIMSScreenWrapper';
import TestCatalog from './Diagnostics/TestCatalog';
import TestOrderBuilder from './Diagnostics/TestOrderBuilder';
import ActiveOrders from './Diagnostics/ActiveOrders';
import ResultsViewer from './Diagnostics/ResultsViewer';
import './Diagnostics/DiagnosticsScreen.css';

const DiagnosticsScreen = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentPatient, getPatientById } = usePatient();
  const { config, currentPIMS } = usePIMS();
  
  const [activeTab, setActiveTab] = useState('order');
  const [selectedTests, setSelectedTests] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [orderPriority, setOrderPriority] = useState('routine');
  const [showPanels, setShowPanels] = useState(true);

  // Load patient if needed
  useEffect(() => {
    if (patientId && !currentPatient) {
      getPatientById(patientId);
    }
  }, [patientId, currentPatient, getPatientById]);

  // Load active orders
  useEffect(() => {
    if (patientId) {
      const orders = DiagnosticsService.getPatientOrders(patientId);
      setActiveOrders(orders);
    }
  }, [patientId]);

  // Get return path from query params
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get('returnTo');

  const handleTestSelect = (test) => {
    if (selectedTests.some(t => t.id === test.id)) {
      setSelectedTests(selectedTests.filter(t => t.id !== test.id));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const handlePanelSelect = (panel) => {
    const panelTests = panel.tests
      .map(testId => DiagnosticsService.testCatalog.find(t => t.id === testId))
      .filter(Boolean);
    
    // Add all tests from panel
    const newTests = panelTests.filter(test => 
      !selectedTests.some(t => t.id === test.id)
    );
    
    setSelectedTests([...selectedTests, ...newTests]);
  };

  const handleSubmitOrder = () => {
    if (selectedTests.length === 0) return;

    const testIds = selectedTests.map(t => t.id);
    const order = DiagnosticsService.createOrder(
      patientId,
      'Dr. Patterson', // In real app, get from auth
      testIds,
      orderPriority
    );

    // Refresh active orders
    setActiveOrders(DiagnosticsService.getPatientOrders(patientId));
    
    // Clear selection
    setSelectedTests([]);
    setActiveTab('active');
    
    // Show success notification (in real app)
    console.log('Order created:', order);
  };

  const handleCollectSample = (orderId, testId) => {
    DiagnosticsService.markSampleCollected(orderId, testId);
    setActiveOrders([...DiagnosticsService.getPatientOrders(patientId)]);
  };

  const handleGenerateRequisition = (orderId) => {
    const requisition = DiagnosticsService.generateRequisition(orderId);
    if (requisition) {
      // In real app, would open PDF or print
      console.log('Requisition generated:', requisition);
      setActiveOrders([...DiagnosticsService.getPatientOrders(patientId)]);
    }
  };

  const handleNavigateBack = () => {
    if (returnTo === 'exam') {
      navigate(`/${currentPIMS}/exam/${patientId}`);
    } else {
      navigate(`/${currentPIMS}/patient-checkin/${patientId}`);
    }
  };

  const categories = DiagnosticsService.getCategories();
  const totalCost = selectedTests.reduce((sum, test) => sum + test.price, 0);

  if (!currentPatient) {
    return <div className="loading">Loading patient data...</div>;
  }

  return (
    <PIMSScreenWrapper title="Diagnostics Ordering">
      <div className="diagnostics-screen">
        <div className="diagnostics-header">
          <div className="patient-info">
            <h1>Diagnostic Orders</h1>
            <div className="patient-details">
              <span className="patient-name">{currentPatient.name}</span>
              <span className="patient-meta">
                {currentPatient.species} • {currentPatient.breed} • {currentPatient.age}
              </span>
            </div>
          </div>
          
          <div className="header-actions">
            <button 
              className="back-btn"
              onClick={handleNavigateBack}
            >
              ← Back to {returnTo === 'exam' ? 'Exam' : 'Check-in'}
            </button>
          </div>
        </div>

        <div className="diagnostics-tabs">
          <button 
            className={`tab ${activeTab === 'order' ? 'active' : ''}`}
            onClick={() => setActiveTab('order')}
          >
            New Order
          </button>
          <button 
            className={`tab ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active Orders ({activeOrders.filter(o => o.status !== 'completed').length})
          </button>
          <button 
            className={`tab ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            Results
          </button>
        </div>

        <div className="diagnostics-content">
          {activeTab === 'order' && (
            <div className="order-interface">
              <div className="test-selection">
                <div className="selection-header">
                  <h2>Select Tests</h2>
                  <div className="selection-controls">
                    <input
                      type="text"
                      placeholder="Search tests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="search-input"
                    />
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="category-filter"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <label className="panel-toggle">
                      <input
                        type="checkbox"
                        checked={showPanels}
                        onChange={(e) => setShowPanels(e.target.checked)}
                      />
                      Show Panels
                    </label>
                  </div>
                </div>

                {showPanels && (
                  <div className="recommended-panels">
                    <h3>Recommended Panels</h3>
                    <div className="panels-grid">
                      {DiagnosticsService.getRecommendedPanels(
                        currentPatient.species.toLowerCase(),
                        currentPatient.age.includes('Senior') ? 'senior' : 'adult'
                      ).map(panel => (
                        <div key={panel.id} className="panel-card">
                          <h4>{panel.name}</h4>
                          <p className="panel-tests">{panel.tests.length} tests</p>
                          <p className="panel-price">${panel.price.toFixed(2)}</p>
                          <p className="panel-savings">Save {panel.discount}%</p>
                          <button
                            className="select-panel-btn"
                            onClick={() => handlePanelSelect(panel)}
                          >
                            Add Panel
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <TestCatalog
                  searchQuery={searchQuery}
                  filterCategory={filterCategory}
                  selectedTests={selectedTests}
                  onTestSelect={handleTestSelect}
                />
              </div>

              <div className="order-summary">
                <TestOrderBuilder
                  selectedTests={selectedTests}
                  priority={orderPriority}
                  onPriorityChange={setOrderPriority}
                  onRemoveTest={(testId) => 
                    setSelectedTests(selectedTests.filter(t => t.id !== testId))
                  }
                  onSubmit={handleSubmitOrder}
                  totalCost={totalCost}
                />
              </div>
            </div>
          )}

          {activeTab === 'active' && (
            <ActiveOrders
              orders={activeOrders.filter(o => o.status !== 'completed')}
              onCollectSample={handleCollectSample}
              onGenerateRequisition={handleGenerateRequisition}
              onCancelOrder={(orderId, reason) => {
                DiagnosticsService.cancelOrder(orderId, reason);
                setActiveOrders([...DiagnosticsService.getPatientOrders(patientId)]);
              }}
            />
          )}

          {activeTab === 'results' && (
            <ResultsViewer
              orders={activeOrders.filter(o => o.status === 'completed')}
              patientSpecies={currentPatient.species.toLowerCase()}
            />
          )}
        </div>
      </div>
    </PIMSScreenWrapper>
  );
};

export default DiagnosticsScreen;