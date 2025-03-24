import React, { createContext, useContext, useState } from 'react';

const InventoryContext = createContext();

export const useInventory = () => {
    const context = useContext(InventoryContext);
    if (!context) {
        throw new Error('useInventory must be used within an InventoryProvider');
    }
    return context;
};

export const InventoryProvider = ({ children }) => {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [lowStockAlerts, setLowStockAlerts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    // Function to set mock data for testing/demo
    const setMockInventoryData = () => {
        setInventoryItems([
            {
                id: 'INV001',
                name: 'Rimadyl 100mg',
                category: 'Medication',
                currentStock: 145,
                minStock: 50,
                unit: 'tablets',
                unitPrice: 2.35,
                location: 'Pharmacy Cabinet 2',
                expiryDate: '2025-06-30',
                lastRestockDate: '2024-01-15',
                isControlled: false,
                controlledClass: '',
            },
            {
                id: 'INV002',
                name: 'Rabies Vaccine',
                category: 'Vaccine',
                currentStock: 32,
                minStock: 30,
                unit: 'doses',
                unitPrice: 15.75,
                location: 'Refrigerator 1',
                expiryDate: '2024-11-15',
                lastRestockDate: '2024-02-10',
                isControlled: false,
                controlledClass: '',
            },
            {
                id: 'INV003',
                name: 'Ketamine',
                category: 'Medication',
                currentStock: 5,
                minStock: 3,
                unit: 'vials',
                unitPrice: 45.00,
                location: 'Controlled Cabinet 1',
                expiryDate: '2024-10-05',
                lastRestockDate: '2024-01-05',
                isControlled: true,
                controlledClass: 'Schedule III',
            },
            {
                id: 'INV004',
                name: 'Examination Gloves (M)',
                category: 'Supplies',
                currentStock: 250,
                minStock: 100,
                unit: 'pairs',
                unitPrice: 0.25,
                location: 'Supply Room Shelf 3',
                expiryDate: '2026-12-31',
                lastRestockDate: '2024-02-28',
                isControlled: false,
                controlledClass: '',
            },
            {
                id: 'INV005',
                name: 'Feline Leukemia Vaccine',
                category: 'Vaccine',
                currentStock: 15,
                minStock: 20,
                unit: 'doses',
                unitPrice: 18.50,
                location: 'Refrigerator 1',
                expiryDate: '2024-08-15',
                lastRestockDate: '2024-01-20',
                isControlled: false,
                controlledClass: '',
            },
            {
                id: 'INV006',
                name: 'Suture Kit',
                category: 'Supplies',
                currentStock: 22,
                minStock: 10,
                unit: 'kits',
                unitPrice: 12.75,
                location: 'Surgery Prep Area',
                expiryDate: '2025-09-30',
                lastRestockDate: '2024-02-15',
                isControlled: false,
                controlledClass: '',
            },
        ]);

        setLowStockAlerts([
            {
                id: 'INV005',
                name: 'Feline Leukemia Vaccine',
                currentStock: 15,
                minStock: 20,
                alertDate: '2024-03-15',
            }
        ]);

        setSuppliers([
            {
                id: 'SUP001',
                name: 'Covetrus North America',
                contact: 'John Smith',
                phone: '1-855-724-3461',
                email: 'support@covetrus.com',
                preferredFor: ['Medication', 'Vaccine'],
            },
            {
                id: 'SUP002',
                name: 'MWI Animal Health',
                contact: 'Sarah Johnson',
                phone: '1-800-824-3703',
                email: 'service@mwiah.com',
                preferredFor: ['Supplies', 'Equipment'],
            },
            {
                id: 'SUP003',
                name: 'Patterson Veterinary',
                contact: 'Mark Wilson',
                phone: '1-800-225-7911',
                email: 'customer.service@pattersonvet.com',
                preferredFor: ['Medication', 'Vaccine', 'Supplies'],
            },
        ]);
    };

    const addInventoryItem = (item) => {
        setInventoryItems([...inventoryItems, item]);
    };

    const updateInventoryItem = (id, updatedItem) => {
        setInventoryItems(
            inventoryItems.map((item) => (item.id === id ? updatedItem : item))
        );
    };

    const dispenseItem = (id, quantity) => {
        const item = inventoryItems.find((item) => item.id === id);
        if (item && item.currentStock >= quantity) {
            const newStock = item.currentStock - quantity;
            updateInventoryItem(id, { ...item, currentStock: newStock });

            // Check if this dispense puts the item below minimum stock
            if (newStock < item.minStock && !lowStockAlerts.some(alert => alert.id === id)) {
                setLowStockAlerts([
                    ...lowStockAlerts,
                    {
                        id: item.id,
                        name: item.name,
                        currentStock: newStock,
                        minStock: item.minStock,
                        alertDate: new Date().toISOString().split('T')[0],
                    }
                ]);
            }

            return true;
        }
        return false;
    };

    const restockItem = (id, quantity) => {
        const item = inventoryItems.find((item) => item.id === id);
        if (item) {
            const newStock = item.currentStock + quantity;
            updateInventoryItem(id, {
                ...item,
                currentStock: newStock,
                lastRestockDate: new Date().toISOString().split('T')[0]
            });

            // Remove from low stock alerts if it's now above minimum
            if (newStock >= item.minStock) {
                setLowStockAlerts(lowStockAlerts.filter(alert => alert.id !== id));
            }

            return true;
        }
        return false;
    };

    return (
        <InventoryContext.Provider
            value={{
                inventoryItems,
                lowStockAlerts,
                suppliers,
                setInventoryItems,
                setLowStockAlerts,
                setSuppliers,
                addInventoryItem,
                updateInventoryItem,
                dispenseItem,
                restockItem,
                setMockInventoryData
            }}
        >
            {children}
        </InventoryContext.Provider>
    );
}; 