import React, { useEffect, useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import '../styles/WindowsClassic.css';

const InventoryScreen = () => {
    const {
        inventoryItems,
        lowStockAlerts,
        suppliers,
        setMockInventoryData,
        dispenseItem,
        restockItem
    } = useInventory();

    const [activeTab, setActiveTab] = useState('inventory');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [selectedItem, setSelectedItem] = useState(null);
    const [dispensingForm, setDispensingForm] = useState({
        quantity: 1,
        notes: ''
    });
    const [restockForm, setRestockForm] = useState({
        quantity: 1,
        notes: ''
    });

    useEffect(() => {
        // Load mock data for this demo
        setMockInventoryData();
    }, []);

    // Handle search and filtering
    const filteredItems = inventoryItems.filter(item => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
            filterCategory === 'All' ||
            item.category === filterCategory;

        return matchesSearch && matchesCategory;
    });

    // Get unique categories for filter
    const categories = ['All', ...new Set(inventoryItems.map(item => item.category))];

    // Handle item click for details view
    const handleItemClick = (item) => {
        setSelectedItem(item);
        setDispensingForm({
            quantity: 1,
            notes: ''
        });
        setRestockForm({
            quantity: 1,
            notes: ''
        });
    };

    // Handle dispensing
    const handleDispense = () => {
        if (selectedItem && dispensingForm.quantity > 0) {
            dispenseItem(selectedItem.id, parseInt(dispensingForm.quantity));

            // Reset form
            setDispensingForm({
                quantity: 1,
                notes: ''
            });

            // Deselect item
            setSelectedItem(null);
        }
    };

    // Handle restocking
    const handleRestock = () => {
        if (selectedItem && restockForm.quantity > 0) {
            restockItem(selectedItem.id, parseInt(restockForm.quantity));

            // Reset form
            setRestockForm({
                quantity: 1,
                notes: ''
            });

            // Deselect item
            setSelectedItem(null);
        }
    };

    // Render inventory list tab
    const renderInventoryTab = () => (
        <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
            {/* Inventory list */}
            <div style={{ flex: '3', overflowY: 'auto', marginRight: '16px' }}>
                <div style={{ marginBottom: '16px' }}>
                    <div className="form-row">
                        <label>Search:</label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name or ID"
                        />
                        <label style={{ marginLeft: '16px' }}>Category:</label>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <table className="windows-table" style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Current Stock</th>
                            <th>Min Stock</th>
                            <th>Unit</th>
                            <th>Unit Price</th>
                            <th>Location</th>
                            <th>Expires</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map((item) => (
                            <tr
                                key={item.id}
                                onClick={() => handleItemClick(item)}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: item === selectedItem ? '#000080' :
                                        item.currentStock < item.minStock ? '#FFCDD2' :
                                            'transparent',
                                    color: item === selectedItem ? 'white' : 'black'
                                }}
                            >
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.category}</td>
                                <td>{item.currentStock}</td>
                                <td>{item.minStock}</td>
                                <td>{item.unit}</td>
                                <td>${item.unitPrice.toFixed(2)}</td>
                                <td>{item.location}</td>
                                <td>{item.expiryDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ marginTop: '16px' }}>
                    <button className="windows-button">Add New Item</button>
                    <button className="windows-button" style={{ marginLeft: '8px' }}>Generate Order List</button>
                    <button className="windows-button" style={{ marginLeft: '8px' }}>Print Inventory List</button>
                </div>
            </div>

            {/* Item details and actions */}
            {selectedItem && (
                <div style={{ flex: '2', overflowY: 'auto', border: '1px solid black', padding: '16px', backgroundColor: 'white' }}>
                    <h3>{selectedItem.name}</h3>
                    <div className="form-row">
                        <strong>ID:</strong> {selectedItem.id}
                    </div>
                    <div className="form-row">
                        <strong>Category:</strong> {selectedItem.category}
                    </div>
                    <div className="form-row">
                        <strong>Current Stock:</strong> {selectedItem.currentStock} {selectedItem.unit}
                    </div>
                    <div className="form-row">
                        <strong>Minimum Stock:</strong> {selectedItem.minStock} {selectedItem.unit}
                    </div>
                    <div className="form-row">
                        <strong>Unit Price:</strong> ${selectedItem.unitPrice.toFixed(2)}
                    </div>
                    <div className="form-row">
                        <strong>Location:</strong> {selectedItem.location}
                    </div>
                    <div className="form-row">
                        <strong>Expiry Date:</strong> {selectedItem.expiryDate}
                    </div>
                    <div className="form-row">
                        <strong>Last Restocked:</strong> {selectedItem.lastRestockDate}
                    </div>
                    <div className="form-row">
                        <strong>Controlled Substance:</strong> {selectedItem.isControlled ? `Yes (${selectedItem.controlledClass})` : 'No'}
                    </div>

                    <div style={{ marginTop: '24px' }}>
                        <h4>Dispense</h4>
                        <div className="form-row">
                            <label>Quantity:</label>
                            <input
                                type="number"
                                value={dispensingForm.quantity}
                                onChange={(e) => setDispensingForm({ ...dispensingForm, quantity: e.target.value })}
                                min="1"
                                max={selectedItem.currentStock}
                                style={{ width: '80px' }}
                            />
                            <span>{selectedItem.unit}</span>
                        </div>
                        <div className="form-row">
                            <label>Notes:</label>
                            <input
                                type="text"
                                value={dispensingForm.notes}
                                onChange={(e) => setDispensingForm({ ...dispensingForm, notes: e.target.value })}
                            />
                        </div>
                        <div className="form-row">
                            <button
                                className="windows-button"
                                onClick={handleDispense}
                                disabled={selectedItem.currentStock < 1}
                            >
                                Dispense
                            </button>
                        </div>
                    </div>

                    <div style={{ marginTop: '24px' }}>
                        <h4>Restock</h4>
                        <div className="form-row">
                            <label>Quantity:</label>
                            <input
                                type="number"
                                value={restockForm.quantity}
                                onChange={(e) => setRestockForm({ ...restockForm, quantity: e.target.value })}
                                min="1"
                                style={{ width: '80px' }}
                            />
                            <span>{selectedItem.unit}</span>
                        </div>
                        <div className="form-row">
                            <label>Notes:</label>
                            <input
                                type="text"
                                value={restockForm.notes}
                                onChange={(e) => setRestockForm({ ...restockForm, notes: e.target.value })}
                            />
                        </div>
                        <div className="form-row">
                            <button
                                className="windows-button"
                                onClick={handleRestock}
                            >
                                Restock
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    // Render low stock alerts tab
    const renderAlertsTab = () => (
        <div style={{ height: '100%', overflowY: 'auto' }}>
            <h3>Low Stock Alerts</h3>
            {lowStockAlerts.length === 0 ? (
                <p>No low stock alerts at this time.</p>
            ) : (
                <table className="windows-table" style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Current Stock</th>
                            <th>Minimum Stock</th>
                            <th>Alert Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lowStockAlerts.map((alert) => {
                            const item = inventoryItems.find(i => i.id === alert.id);
                            return (
                                <tr key={alert.id} style={{ backgroundColor: '#FFCDD2' }}>
                                    <td>{alert.id}</td>
                                    <td>{alert.name}</td>
                                    <td>{alert.currentStock}</td>
                                    <td>{alert.minStock}</td>
                                    <td>{alert.alertDate}</td>
                                    <td>
                                        <button
                                            className="windows-button"
                                            onClick={() => {
                                                const item = inventoryItems.find(i => i.id === alert.id);
                                                if (item) {
                                                    handleItemClick(item);
                                                    setActiveTab('inventory');
                                                }
                                            }}
                                        >
                                            View Item
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}

            <div style={{ marginTop: '16px' }}>
                <button className="windows-button">Print Alert List</button>
                <button className="windows-button" style={{ marginLeft: '8px' }}>Generate Purchase Order</button>
            </div>
        </div>
    );

    // Render suppliers tab
    const renderSuppliersTab = () => (
        <div style={{ height: '100%', overflowY: 'auto' }}>
            <h3>Suppliers</h3>
            <table className="windows-table" style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Contact Person</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Preferred For</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map((supplier) => (
                        <tr key={supplier.id}>
                            <td>{supplier.id}</td>
                            <td>{supplier.name}</td>
                            <td>{supplier.contact}</td>
                            <td>{supplier.phone}</td>
                            <td>{supplier.email}</td>
                            <td>{supplier.preferredFor.join(', ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ marginTop: '16px' }}>
                <button className="windows-button">Add Supplier</button>
                <button className="windows-button" style={{ marginLeft: '8px' }}>Edit Supplier</button>
            </div>
        </div>
    );

    // Render controlled substances tab
    const renderControlledTab = () => (
        <div style={{ height: '100%', overflowY: 'auto' }}>
            <h3>Controlled Substances</h3>

            {/* Controlled substances inventory */}
            <div style={{ marginBottom: '24px' }}>
                <h4>Current Inventory</h4>
                {inventoryItems.filter(item => item.isControlled).length === 0 ? (
                    <p>No controlled substances in inventory.</p>
                ) : (
                    <table className="windows-table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Class</th>
                                <th>Current Stock</th>
                                <th>Unit</th>
                                <th>Location</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventoryItems.filter(item => item.isControlled).map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.controlledClass}</td>
                                    <td>{item.currentStock}</td>
                                    <td>{item.unit}</td>
                                    <td>{item.location}</td>
                                    <td>
                                        <button
                                            className="windows-button"
                                            onClick={() => {
                                                handleItemClick(item);
                                                setActiveTab('inventory');
                                            }}
                                        >
                                            View Item
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Controlled substance logs */}
            <div>
                <h4>Narcotic Logs</h4>
                <p>Use this section to record all controlled substance transactions according to DEA requirements.</p>
                <button className="windows-button">Access Controlled Substance Log</button>
            </div>
        </div>
    );

    return (
        <div className="windows-classic">
            <div className="window" style={{ margin: '0', height: '100%' }}>
                <div className="title-bar">
                    <div className="title-bar-text">Inventory Management</div>
                    <div className="title-bar-controls">
                        <button aria-label="Minimize"></button>
                        <button aria-label="Maximize"></button>
                        <button aria-label="Close"></button>
                    </div>
                </div>

                <div className="window-body" style={{ padding: '16px', display: 'flex', flexDirection: 'column', height: 'calc(100% - 32px)' }}>
                    {/* Tab buttons */}
                    <div style={{ display: 'flex', marginBottom: '16px' }}>
                        <button
                            className={`windows-button ${activeTab === 'inventory' ? 'active' : ''}`}
                            onClick={() => setActiveTab('inventory')}
                            style={{
                                backgroundColor: activeTab === 'inventory' ? '#000080' : '',
                                color: activeTab === 'inventory' ? 'white' : '',
                                marginRight: '4px'
                            }}
                        >
                            Inventory
                        </button>
                        <button
                            className={`windows-button ${activeTab === 'alerts' ? 'active' : ''}`}
                            onClick={() => setActiveTab('alerts')}
                            style={{
                                backgroundColor: activeTab === 'alerts' ? '#000080' : '',
                                color: activeTab === 'alerts' ? 'white' : '',
                                marginRight: '4px',
                                position: 'relative'
                            }}
                        >
                            Low Stock Alerts
                            {lowStockAlerts.length > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    backgroundColor: 'red',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '11px'
                                }}>
                                    {lowStockAlerts.length}
                                </span>
                            )}
                        </button>
                        <button
                            className={`windows-button ${activeTab === 'suppliers' ? 'active' : ''}`}
                            onClick={() => setActiveTab('suppliers')}
                            style={{
                                backgroundColor: activeTab === 'suppliers' ? '#000080' : '',
                                color: activeTab === 'suppliers' ? 'white' : '',
                                marginRight: '4px'
                            }}
                        >
                            Suppliers
                        </button>
                        <button
                            className={`windows-button ${activeTab === 'controlled' ? 'active' : ''}`}
                            onClick={() => setActiveTab('controlled')}
                            style={{
                                backgroundColor: activeTab === 'controlled' ? '#000080' : '',
                                color: activeTab === 'controlled' ? 'white' : '',
                                marginRight: '4px'
                            }}
                        >
                            Controlled Substances
                        </button>
                    </div>

                    {/* Tab content */}
                    <div style={{
                        flexGrow: 1,
                        border: '1px solid black',
                        padding: '16px',
                        backgroundColor: 'white',
                        overflowY: 'auto'
                    }}>
                        {activeTab === 'inventory' && renderInventoryTab()}
                        {activeTab === 'alerts' && renderAlertsTab()}
                        {activeTab === 'suppliers' && renderSuppliersTab()}
                        {activeTab === 'controlled' && renderControlledTab()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryScreen; 