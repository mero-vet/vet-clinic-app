import React, { createContext, useContext, useState } from 'react';

const ReportsContext = createContext();

export const useReports = () => {
    const context = useContext(ReportsContext);
    if (!context) {
        throw new Error('useReports must be used within a ReportsProvider');
    }
    return context;
};

export const ReportsProvider = ({ children }) => {
    const [revenueData, setRevenueData] = useState({});
    const [providerMetrics, setProviderMetrics] = useState({});
    const [appointmentStats, setAppointmentStats] = useState({});
    const [inventoryTrends, setInventoryTrends] = useState({});
    const [clientRetention, setClientRetention] = useState({});
    const [labTestFrequency, setLabTestFrequency] = useState({});
    const [savedReports, setSavedReports] = useState([]);

    // Function to set mock data for testing/demo
    const setMockReportsData = () => {
        // Mock revenue data
        setRevenueData({
            daily: [
                { date: '2024-03-14', revenue: 2450.75, appointments: 12, invoices: 15 },
                { date: '2024-03-15', revenue: 3215.50, appointments: 15, invoices: 18 },
                { date: '2024-03-16', revenue: 1875.25, appointments: 8, invoices: 10 },
                { date: '2024-03-17', revenue: 0, appointments: 0, invoices: 0 },
                { date: '2024-03-18', revenue: 4125.00, appointments: 18, invoices: 20 },
                { date: '2024-03-19', revenue: 3560.75, appointments: 16, invoices: 18 },
                { date: '2024-03-20', revenue: 2980.25, appointments: 14, invoices: 16 },
            ],
            monthly: [
                { month: 'January 2024', revenue: 75250.00, appointments: 342, invoices: 385 },
                { month: 'February 2024', revenue: 68450.50, appointments: 315, invoices: 350 },
                { month: 'March 2024 (MTD)', revenue: 42350.75, appointments: 198, invoices: 225 },
            ],
            yearly: [
                { year: '2022', revenue: 750000.00, appointments: 4125, invoices: 4500 },
                { year: '2023', revenue: 825000.00, appointments: 4350, invoices: 4750 },
                { year: '2024 (YTD)', revenue: 186051.25, appointments: 855, invoices: 960 },
            ],
            byCategory: [
                { category: 'Office Visits', amount: 15250.50, percentage: 36 },
                { category: 'Surgeries', amount: 10500.00, percentage: 25 },
                { category: 'Laboratory', amount: 7650.75, percentage: 18 },
                { category: 'Pharmacy', amount: 5450.25, percentage: 13 },
                { category: 'Imaging', amount: 2120.50, percentage: 5 },
                { category: 'Other', amount: 1378.75, percentage: 3 },
            ],
        });

        // Mock provider metrics
        setProviderMetrics({
            providers: [
                {
                    id: 'P001',
                    name: 'Dr. Patterson',
                    appointments: {
                        scheduled: 45,
                        completed: 42,
                        cancelled: 3,
                        noShow: 0,
                    },
                    revenue: 22450.75,
                    averageAppointmentTime: 25,
                    patientsSeen: 38,
                    newPatients: 5,
                },
                {
                    id: 'P002',
                    name: 'Dr. Lee',
                    appointments: {
                        scheduled: 40,
                        completed: 38,
                        cancelled: 1,
                        noShow: 1,
                    },
                    revenue: 19875.50,
                    averageAppointmentTime: 28,
                    patientsSeen: 36,
                    newPatients: 8,
                },
                {
                    id: 'P003',
                    name: 'Dr. Williams',
                    appointments: {
                        scheduled: 35,
                        completed: 32,
                        cancelled: 2,
                        noShow: 1,
                    },
                    revenue: 17650.25,
                    averageAppointmentTime: 22,
                    patientsSeen: 30,
                    newPatients: 3,
                },
            ],
            timeRangeStart: '2024-03-01',
            timeRangeEnd: '2024-03-20',
        });

        // Mock appointment statistics
        setAppointmentStats({
            byType: [
                { type: 'Wellness', count: 65, percentage: 35 },
                { type: 'Sick Visit', count: 45, percentage: 24 },
                { type: 'Surgery', count: 22, percentage: 12 },
                { type: 'Vaccination', count: 30, percentage: 16 },
                { type: 'Recheck', count: 15, percentage: 8 },
                { type: 'Other', count: 9, percentage: 5 },
            ],
            byDayOfWeek: [
                { day: 'Monday', count: 42, percentage: 22 },
                { day: 'Tuesday', count: 38, percentage: 20 },
                { day: 'Wednesday', count: 45, percentage: 24 },
                { day: 'Thursday', count: 35, percentage: 19 },
                { day: 'Friday', count: 26, percentage: 14 },
                { day: 'Saturday', count: 0, percentage: 0 },
                { day: 'Sunday', count: 0, percentage: 0 },
            ],
            byTimeOfDay: [
                { timeSlot: '8:00-10:00', count: 45, percentage: 24 },
                { timeSlot: '10:00-12:00', count: 52, percentage: 28 },
                { timeSlot: '12:00-14:00', count: 25, percentage: 13 },
                { timeSlot: '14:00-16:00', count: 38, percentage: 20 },
                { timeSlot: '16:00-18:00', count: 26, percentage: 14 },
            ],
            timeRangeStart: '2024-03-01',
            timeRangeEnd: '2024-03-20',
            totalAppointments: 186,
        });

        // Mock inventory trends
        setInventoryTrends({
            mostUsedItems: [
                { id: 'INV001', name: 'Rimadyl 100mg', usageCount: 125, revenueGenerated: 293.75 },
                { id: 'INV002', name: 'Rabies Vaccine', usageCount: 45, revenueGenerated: 708.75 },
                { id: 'INV004', name: 'Examination Gloves (M)', usageCount: 250, revenueGenerated: 62.50 },
                { id: 'INV006', name: 'Suture Kit', usageCount: 22, revenueGenerated: 280.50 },
                { id: 'INV005', name: 'Feline Leukemia Vaccine', usageCount: 20, revenueGenerated: 370.00 },
            ],
            restockFrequency: [
                { id: 'INV004', name: 'Examination Gloves (M)', restockCount: 5, averageQuantity: 200 },
                { id: 'INV001', name: 'Rimadyl 100mg', restockCount: 3, averageQuantity: 150 },
                { id: 'INV002', name: 'Rabies Vaccine', restockCount: 2, averageQuantity: 50 },
                { id: 'INV005', name: 'Feline Leukemia Vaccine', restockCount: 2, averageQuantity: 30 },
                { id: 'INV006', name: 'Suture Kit', restockCount: 1, averageQuantity: 25 },
            ],
            lowStockFrequency: [
                { id: 'INV005', name: 'Feline Leukemia Vaccine', lowStockCount: 4 },
                { id: 'INV003', name: 'Ketamine', lowStockCount: 2 },
                { id: 'INV006', name: 'Suture Kit', lowStockCount: 1 },
            ],
            timeRangeStart: '2024-01-01',
            timeRangeEnd: '2024-03-20',
        });

        // Mock client retention metrics
        setClientRetention({
            overall: {
                activeClients: 450,
                newClients: 35,
                returningClients: 415,
                inactiveClients: 78,
                retentionRate: 0.84,
            },
            byMonth: [
                { month: 'October 2023', activeClients: 425, newClients: 18, lostClients: 5 },
                { month: 'November 2023', activeClients: 438, newClients: 22, lostClients: 9 },
                { month: 'December 2023', activeClients: 445, newClients: 15, lostClients: 8 },
                { month: 'January 2024', activeClients: 452, newClients: 20, lostClients: 13 },
                { month: 'February 2024', activeClients: 455, newClients: 12, lostClients: 9 },
                { month: 'March 2024', activeClients: 450, newClients: 8, lostClients: 13 },
            ],
            bySource: [
                { source: 'Referral', count: 180, percentage: 40 },
                { source: 'Website', count: 125, percentage: 28 },
                { source: 'Social Media', count: 65, percentage: 14 },
                { source: 'Local Advertising', count: 45, percentage: 10 },
                { source: 'Other', count: 35, percentage: 8 },
            ],
        });

        // Mock lab test frequency
        setLabTestFrequency({
            mostCommonTests: [
                { testName: 'Complete Blood Count', count: 85, revenue: 4250.00 },
                { testName: 'Chemistry Panel', count: 78, revenue: 5460.00 },
                { testName: 'Heartworm Test', count: 65, revenue: 2600.00 },
                { testName: 'Urinalysis', count: 42, revenue: 1680.00 },
                { testName: 'Fecal Analysis', count: 38, revenue: 1140.00 },
            ],
            bySpecies: [
                { species: 'Canine', testCount: 210, percentage: 68 },
                { species: 'Feline', testCount: 85, percentage: 28 },
                { species: 'Exotic', testCount: 13, percentage: 4 },
            ],
            timeRangeStart: '2024-01-01',
            timeRangeEnd: '2024-03-20',
        });

        // Mock saved reports
        setSavedReports([
            {
                id: 'SR001',
                name: 'Q1 2024 Revenue Summary',
                type: 'Revenue',
                createdDate: '2024-03-15',
                createdBy: 'Jane Doe',
                dateRange: { start: '2024-01-01', end: '2024-03-15' },
                format: 'PDF',
                lastViewed: '2024-03-19',
            },
            {
                id: 'SR002',
                name: 'Provider Performance - February 2024',
                type: 'Provider Metrics',
                createdDate: '2024-03-01',
                createdBy: 'John Smith',
                dateRange: { start: '2024-02-01', end: '2024-02-29' },
                format: 'Excel',
                lastViewed: '2024-03-10',
            },
            {
                id: 'SR003',
                name: 'Inventory Usage Report - 2024 YTD',
                type: 'Inventory',
                createdDate: '2024-03-18',
                createdBy: 'Jane Doe',
                dateRange: { start: '2024-01-01', end: '2024-03-18' },
                format: 'PDF',
                lastViewed: '2024-03-18',
            },
        ]);
    };

    // Generate a report for a specific period
    const generateReport = (reportType, dateRange, options = {}) => {
        // In a real app, this would query a database or API
        // For this simulator, we'll just return the mock data
        const report = {
            id: `SR${savedReports.length + 1}`.padStart(5, '0'),
            name: options.name || `${reportType} Report`,
            type: reportType,
            createdDate: new Date().toISOString().split('T')[0],
            createdBy: options.createdBy || 'Current User',
            dateRange,
            format: options.format || 'PDF',
            lastViewed: new Date().toISOString().split('T')[0],
            data: getReportData(reportType, dateRange),
        };

        // Add to saved reports
        setSavedReports([...savedReports, report]);

        return report;
    };

    // Helper function to get the appropriate data for a report type
    const getReportData = (reportType, dateRange) => {
        switch (reportType) {
            case 'Revenue':
                return revenueData;
            case 'Provider Metrics':
                return providerMetrics;
            case 'Appointments':
                return appointmentStats;
            case 'Inventory':
                return inventoryTrends;
            case 'Client Retention':
                return clientRetention;
            case 'Lab Tests':
                return labTestFrequency;
            default:
                return {};
        }
    };

    // Delete a saved report
    const deleteReport = (id) => {
        setSavedReports(savedReports.filter(report => report.id !== id));
    };

    return (
        <ReportsContext.Provider
            value={{
                revenueData,
                providerMetrics,
                appointmentStats,
                inventoryTrends,
                clientRetention,
                labTestFrequency,
                savedReports,
                setMockReportsData,
                generateReport,
                deleteReport,
            }}
        >
            {children}
        </ReportsContext.Provider>
    );
}; 