import React, { useEffect, useState } from 'react';
import { useReports } from '../context/ReportsContext';
import '../styles/WindowsClassic.css';

const ReportsScreen = () => {
    const {
        revenueData,
        providerMetrics,
        appointmentStats,
        inventoryTrends,
        clientRetention,
        labTestFrequency,
        savedReports,
        setMockReportsData,
        generateReport,
        deleteReport
    } = useReports();

    const [activeTab, setActiveTab] = useState('revenue');
    const [dateRange, setDateRange] = useState({
        start: '2024-01-01',
        end: new Date().toISOString().split('T')[0]
    });
    const [reportType, setReportType] = useState('daily');
    const [selectedReport, setSelectedReport] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load mock data for this demo
        setMockReportsData();
        setIsLoading(false);
    }, []);

    // Handle date change
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange({ ...dateRange, [name]: value });
    };

    // Handle report type selection
    const handleReportTypeChange = (e) => {
        setReportType(e.target.value);
    };

    // Handle generating a new report
    const handleGenerateReport = () => {
        const reportName = `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Report - ${dateRange.start} to ${dateRange.end}`;
        generateReport(
            activeTab.charAt(0).toUpperCase() + activeTab.slice(1),
            dateRange,
            {
                name: reportName,
                format: 'PDF',
                createdBy: 'Current User'
            }
        );
    };

    // Map tab headers
    const tabHeaders = [
        { id: 'revenue', label: 'Revenue' },
        { id: 'providers', label: 'Provider Metrics' },
        { id: 'appointments', label: 'Appointment Stats' },
        { id: 'inventory', label: 'Inventory Trends' },
        { id: 'clients', label: 'Client Retention' },
        { id: 'labtests', label: 'Lab Test Frequency' },
        { id: 'saved', label: 'Saved Reports' },
    ];

    // Render revenue tab
    const renderRevenueTab = () => {
        if (isLoading || !revenueData || !revenueData[reportType]) {
            return <div>Loading revenue data...</div>;
        }

        // Get the appropriate data based on report type
        const data = revenueData[reportType] || [];

        // Calculate totals
        const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
        const totalAppointments = data.reduce((sum, item) => sum + item.appointments, 0);
        const totalInvoices = data.reduce((sum, item) => sum + item.invoices, 0);

        return (
            <div style={{ height: '100%', overflowY: 'auto' }}>
                <h3>Revenue Report</h3>

                <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                    <div className="fieldset" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
                        <h4>Total Revenue</h4>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007700' }}>
                            ${totalRevenue.toFixed(2)}
                        </div>
                    </div>
                    <div className="fieldset" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
                        <h4>Appointments</h4>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                            {totalAppointments}
                        </div>
                    </div>
                    <div className="fieldset" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
                        <h4>Invoices</h4>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                            {totalInvoices}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '24px' }}>
                    <div style={{ flex: 2 }}>
                        <h4>Revenue by {reportType === 'daily' ? 'Day' : reportType === 'monthly' ? 'Month' : 'Year'}</h4>
                        <table className="windows-table" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>{reportType === 'daily' ? 'Date' : reportType === 'monthly' ? 'Month' : 'Year'}</th>
                                    <th>Revenue</th>
                                    <th>Appointments</th>
                                    <th>Invoices</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <td>{reportType === 'daily' ? item.date : reportType === 'monthly' ? item.month : item.year}</td>
                                        <td>${item.revenue.toFixed(2)}</td>
                                        <td>{item.appointments}</td>
                                        <td>{item.invoices}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ flex: 1 }}>
                        <h4>Revenue by Category</h4>
                        {revenueData.byCategory ? (
                            <>
                                <table className="windows-table" style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th>Category</th>
                                            <th>Amount</th>
                                            <th>%</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {revenueData.byCategory.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.category}</td>
                                                <td>${item.amount.toFixed(2)}</td>
                                                <td>{item.percentage}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div style={{ marginTop: '24px', border: '1px solid #ccc', padding: '16px' }}>
                                    <h4>Category Distribution</h4>
                                    {revenueData.byCategory.map((item, index) => (
                                        <div key={index} style={{ marginBottom: '8px' }}>
                                            <div>{item.category}</div>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div
                                                    style={{
                                                        height: '20px',
                                                        width: `${item.percentage * 3}px`,
                                                        backgroundColor: '#1976d2',
                                                        marginRight: '8px'
                                                    }}
                                                ></div>
                                                <div>{item.percentage}%</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div>Loading category data...</div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Render provider metrics tab
    const renderProvidersTab = () => {
        const { providers, timeRangeStart, timeRangeEnd } = providerMetrics;

        // Calculate totals
        const totalRevenue = providers.reduce((sum, provider) => sum + provider.revenue, 0);
        const totalAppointments = providers.reduce((sum, provider) => sum + provider.appointments.scheduled, 0);
        const totalPatients = providers.reduce((sum, provider) => sum + provider.patientsSeen, 0);

        return (
            <div style={{ height: '100%', overflowY: 'auto' }}>
                <h3>Provider Metrics</h3>
                <p>Time Period: {timeRangeStart} to {timeRangeEnd}</p>

                <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                    <div className="fieldset" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
                        <h4>Total Revenue</h4>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007700' }}>
                            ${totalRevenue.toFixed(2)}
                        </div>
                    </div>
                    <div className="fieldset" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
                        <h4>Total Appointments</h4>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                            {totalAppointments}
                        </div>
                    </div>
                    <div className="fieldset" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
                        <h4>Total Patients</h4>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                            {totalPatients}
                        </div>
                    </div>
                </div>

                <div>
                    <h4>Provider Performance</h4>
                    <table className="windows-table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Provider</th>
                                <th>Revenue</th>
                                <th>Appts Scheduled</th>
                                <th>Appts Completed</th>
                                <th>Cancellation Rate</th>
                                <th>Avg Time (min)</th>
                                <th>Patients</th>
                                <th>New Patients</th>
                            </tr>
                        </thead>
                        <tbody>
                            {providers.map((provider) => {
                                const cancellationRate = (
                                    (provider.appointments.cancelled + provider.appointments.noShow) /
                                    provider.appointments.scheduled * 100
                                ).toFixed(1);

                                return (
                                    <tr key={provider.id}>
                                        <td>{provider.name}</td>
                                        <td>${provider.revenue.toFixed(2)}</td>
                                        <td>{provider.appointments.scheduled}</td>
                                        <td>{provider.appointments.completed}</td>
                                        <td>{cancellationRate}%</td>
                                        <td>{provider.averageAppointmentTime}</td>
                                        <td>{provider.patientsSeen}</td>
                                        <td>{provider.newPatients}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Provider comparison visualization */}
                <div style={{ marginTop: '24px' }}>
                    <h4>Revenue Comparison</h4>
                    <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', marginTop: '16px', marginBottom: '16px' }}>
                        {providers.map((provider, index) => {
                            const maxRevenue = Math.max(...providers.map(p => p.revenue));
                            const height = (provider.revenue / maxRevenue) * 180;

                            return (
                                <div key={provider.id} style={{ flex: 1, textAlign: 'center' }}>
                                    <div
                                        style={{
                                            height: `${height}px`,
                                            backgroundColor: '#1976d2',
                                            margin: '0 8px',
                                            position: 'relative'
                                        }}
                                    >
                                        <div style={{
                                            position: 'absolute',
                                            top: '-20px',
                                            width: '100%',
                                            textAlign: 'center'
                                        }}>
                                            ${provider.revenue.toFixed(0)}
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '8px' }}>{provider.name}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    // Render appointment stats tab
    const renderAppointmentsTab = () => {
        const { byType, byDayOfWeek, byTimeOfDay, timeRangeStart, timeRangeEnd, totalAppointments } = appointmentStats;

        return (
            <div style={{ height: '100%', overflowY: 'auto' }}>
                <h3>Appointment Statistics</h3>
                <p>Time Period: {timeRangeStart} to {timeRangeEnd}</p>

                <div className="fieldset" style={{ padding: '16px', textAlign: 'center', marginBottom: '24px' }}>
                    <h4>Total Appointments</h4>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                        {totalAppointments}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '24px' }}>
                    <div style={{ flex: 1 }}>
                        <h4>Appointments by Type</h4>
                        <table className="windows-table" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Count</th>
                                    <th>Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {byType.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.type}</td>
                                        <td>{item.count}</td>
                                        <td>{item.percentage}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Simple visualization */}
                        <div style={{ marginTop: '16px', border: '1px solid #ccc', padding: '16px' }}>
                            {byType.map((item, index) => (
                                <div key={index} style={{ marginBottom: '8px' }}>
                                    <div>{item.type}</div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div
                                            style={{
                                                height: '20px',
                                                width: `${item.percentage * 2}px`,
                                                backgroundColor: '#1976d2',
                                                marginRight: '8px'
                                            }}
                                        ></div>
                                        <div>{item.percentage}%</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ flex: 1 }}>
                        <h4>Appointments by Day of Week</h4>
                        <table className="windows-table" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Day</th>
                                    <th>Count</th>
                                    <th>Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {byDayOfWeek.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.day}</td>
                                        <td>{item.count}</td>
                                        <td>{item.percentage}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <h4 style={{ marginTop: '24px' }}>Appointments by Time of Day</h4>
                        <table className="windows-table" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Time Slot</th>
                                    <th>Count</th>
                                    <th>Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {byTimeOfDay.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.timeSlot}</td>
                                        <td>{item.count}</td>
                                        <td>{item.percentage}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    // Render inventory trends tab
    const renderInventoryTab = () => {
        const { mostUsedItems, restockFrequency, lowStockFrequency, timeRangeStart, timeRangeEnd } = inventoryTrends;

        return (
            <div style={{ height: '100%', overflowY: 'auto' }}>
                <h3>Inventory Usage Trends</h3>
                <p>Time Period: {timeRangeStart} to {timeRangeEnd}</p>

                <div style={{ display: 'flex', gap: '24px' }}>
                    <div style={{ flex: 1 }}>
                        <h4>Most Used Items</h4>
                        <table className="windows-table" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Usage Count</th>
                                    <th>Revenue Generated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mostUsedItems.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.usageCount}</td>
                                        <td>${item.revenueGenerated.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ flex: 1 }}>
                        <h4>Restock Frequency</h4>
                        <table className="windows-table" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Restock Count</th>
                                    <th>Avg Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {restockFrequency.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.restockCount}</td>
                                        <td>{item.averageQuantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <h4 style={{ marginTop: '24px' }}>Low Stock Frequency</h4>
                        <table className="windows-table" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Low Stock Events</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lowStockFrequency.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.lowStockCount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Visualization */}
                <div style={{ marginTop: '24px' }}>
                    <h4>Revenue Generated by Top Items</h4>
                    <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', marginTop: '16px', border: '1px solid #ccc', padding: '16px' }}>
                        {mostUsedItems.map((item) => {
                            const maxRevenue = Math.max(...mostUsedItems.map(i => i.revenueGenerated));
                            const height = (item.revenueGenerated / maxRevenue) * 180;

                            return (
                                <div key={item.id} style={{ flex: 1, textAlign: 'center' }}>
                                    <div
                                        style={{
                                            height: `${height}px`,
                                            backgroundColor: '#1976d2',
                                            margin: '0 8px',
                                            position: 'relative'
                                        }}
                                    >
                                        <div style={{
                                            position: 'absolute',
                                            top: '-20px',
                                            width: '100%',
                                            textAlign: 'center',
                                            fontSize: '12px'
                                        }}>
                                            ${item.revenueGenerated.toFixed(2)}
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '8px', fontSize: '12px' }}>{item.name}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    // Render client retention tab
    const renderClientsTab = () => {
        const { overall, byMonth, bySource } = clientRetention;

        return (
            <div style={{ height: '100%', overflowY: 'auto' }}>
                <h3>Client Retention Metrics</h3>

                <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                    <div className="fieldset" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
                        <h4>Active Clients</h4>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                            {overall.activeClients}
                        </div>
                    </div>
                    <div className="fieldset" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
                        <h4>New Clients</h4>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#008800' }}>
                            {overall.newClients}
                        </div>
                    </div>
                    <div className="fieldset" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
                        <h4>Inactive Clients</h4>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#880000' }}>
                            {overall.inactiveClients}
                        </div>
                    </div>
                    <div className="fieldset" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
                        <h4>Retention Rate</h4>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                            {(overall.retentionRate * 100).toFixed(1)}%
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '24px' }}>
                    <div style={{ flex: 2 }}>
                        <h4>Monthly Client Trends</h4>
                        <table className="windows-table" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Month</th>
                                    <th>Active Clients</th>
                                    <th>New Clients</th>
                                    <th>Lost Clients</th>
                                    <th>Net Change</th>
                                </tr>
                            </thead>
                            <tbody>
                                {byMonth.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.month}</td>
                                        <td>{item.activeClients}</td>
                                        <td style={{ color: '#008800' }}>{item.newClients}</td>
                                        <td style={{ color: '#880000' }}>{item.lostClients}</td>
                                        <td style={{
                                            color: item.newClients - item.lostClients > 0 ? '#008800' :
                                                item.newClients - item.lostClients < 0 ? '#880000' : 'inherit'
                                        }}>
                                            {item.newClients - item.lostClients > 0 ? '+' : ''}
                                            {item.newClients - item.lostClients}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ flex: 1 }}>
                        <h4>Client Source</h4>
                        <table className="windows-table" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Source</th>
                                    <th>Count</th>
                                    <th>Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bySource.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.source}</td>
                                        <td>{item.count}</td>
                                        <td>{item.percentage}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Simple ASCII chart */}
                        <div style={{ marginTop: '24px', border: '1px solid #ccc', padding: '16px' }}>
                            <h4>Source Distribution</h4>
                            {bySource.map((item, index) => (
                                <div key={index} style={{ marginBottom: '8px' }}>
                                    <div>{item.source}</div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div
                                            style={{
                                                height: '20px',
                                                width: `${item.percentage * 3}px`,
                                                backgroundColor: '#1976d2',
                                                marginRight: '8px'
                                            }}
                                        ></div>
                                        <div>{item.percentage}%</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render lab test frequency tab
    const renderLabTestsTab = () => {
        const { mostCommonTests, bySpecies, timeRangeStart, timeRangeEnd } = labTestFrequency;

        // Calculate totals
        const totalTests = mostCommonTests.reduce((sum, test) => sum + test.count, 0);
        const totalRevenue = mostCommonTests.reduce((sum, test) => sum + test.revenue, 0);

        return (
            <div style={{ height: '100%', overflowY: 'auto' }}>
                <h3>Lab Test Frequency</h3>
                <p>Time Period: {timeRangeStart} to {timeRangeEnd}</p>

                <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                    <div className="fieldset" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
                        <h4>Total Tests</h4>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                            {totalTests}
                        </div>
                    </div>
                    <div className="fieldset" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
                        <h4>Revenue Generated</h4>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007700' }}>
                            ${totalRevenue.toFixed(2)}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '24px' }}>
                    <div style={{ flex: 2 }}>
                        <h4>Most Common Tests</h4>
                        <table className="windows-table" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Test</th>
                                    <th>Count</th>
                                    <th>Revenue</th>
                                    <th>Avg Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mostCommonTests.map((test, index) => (
                                    <tr key={index}>
                                        <td>{test.testName}</td>
                                        <td>{test.count}</td>
                                        <td>${test.revenue.toFixed(2)}</td>
                                        <td>${(test.revenue / test.count).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ flex: 1 }}>
                        <h4>Tests by Species</h4>
                        <table className="windows-table" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Species</th>
                                    <th>Test Count</th>
                                    <th>Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bySpecies.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.species}</td>
                                        <td>{item.testCount}</td>
                                        <td>{item.percentage}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Simple ASCII chart */}
                        <div style={{ marginTop: '24px', border: '1px solid #ccc', padding: '16px' }}>
                            <h4>Species Distribution</h4>
                            {bySpecies.map((item, index) => (
                                <div key={index} style={{ marginBottom: '8px' }}>
                                    <div>{item.species}</div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div
                                            style={{
                                                height: '20px',
                                                width: `${item.percentage * 3}px`,
                                                backgroundColor: '#1976d2',
                                                marginRight: '8px'
                                            }}
                                        ></div>
                                        <div>{item.percentage}%</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render saved reports tab
    const renderSavedReportsTab = () => {
        return (
            <div style={{ height: '100%', overflowY: 'auto' }}>
                <h3>Saved Reports</h3>

                {savedReports.length === 0 ? (
                    <p>No saved reports.</p>
                ) : (
                    <table className="windows-table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Report Name</th>
                                <th>Type</th>
                                <th>Created Date</th>
                                <th>Date Range</th>
                                <th>Created By</th>
                                <th>Format</th>
                                <th>Last Viewed</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {savedReports.map((report) => (
                                <tr
                                    key={report.id}
                                    onClick={() => setSelectedReport(report)}
                                    className={report === selectedReport ? 'selected' : ''}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td>{report.name}</td>
                                    <td>{report.type}</td>
                                    <td>{report.createdDate}</td>
                                    <td>{report.dateRange.start} to {report.dateRange.end}</td>
                                    <td>{report.createdBy}</td>
                                    <td>{report.format}</td>
                                    <td>{report.lastViewed}</td>
                                    <td>
                                        <button
                                            className="windows-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // View functionality would go here
                                            }}
                                        >
                                            View
                                        </button>
                                        <button
                                            className="windows-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteReport(report.id);
                                            }}
                                            style={{ marginLeft: '4px' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {selectedReport && (
                    <div className="fieldset" style={{ marginTop: '24px', padding: '16px' }}>
                        <h4>Report Preview: {selectedReport.name}</h4>
                        <div className="form-row">
                            <strong>Type:</strong> {selectedReport.type}
                        </div>
                        <div className="form-row">
                            <strong>Date Range:</strong> {selectedReport.dateRange.start} to {selectedReport.dateRange.end}
                        </div>
                        <div className="form-row">
                            <strong>Created By:</strong> {selectedReport.createdBy} on {selectedReport.createdDate}
                        </div>

                        <div style={{ marginTop: '16px' }}>
                            <button
                                className="windows-button"
                                onClick={() => {
                                    // Open functionality would go here
                                }}
                            >
                                Open
                            </button>
                            <button
                                className="windows-button"
                                onClick={() => {
                                    // Print functionality would go here
                                }}
                                style={{ marginLeft: '8px' }}
                            >
                                Print
                            </button>
                            <button
                                className="windows-button"
                                onClick={() => {
                                    // Email functionality would go here
                                }}
                                style={{ marginLeft: '8px' }}
                            >
                                Email
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="windows-classic">
            <div className="window" style={{ margin: '0', height: '100%' }}>
                <div className="title-bar">
                    <div className="title-bar-text">Reports & Analytics</div>
                    <div className="title-bar-controls">
                        <button aria-label="Minimize"></button>
                        <button aria-label="Maximize"></button>
                        <button aria-label="Close"></button>
                    </div>
                </div>

                <div className="window-body" style={{ padding: '16px', display: 'flex', flexDirection: 'column', height: 'calc(100% - 32px)' }}>
                    {/* Report controls */}
                    <div className="fieldset" style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div className="form-row">
                                    <label>Date Range:</label>
                                    <input
                                        type="date"
                                        name="start"
                                        value={dateRange.start}
                                        onChange={handleDateChange}
                                    />
                                    <span style={{ margin: '0 8px' }}>to</span>
                                    <input
                                        type="date"
                                        name="end"
                                        value={dateRange.end}
                                        onChange={handleDateChange}
                                    />
                                </div>
                                <div className="form-row">
                                    <label>Report Type:</label>
                                    <select
                                        value={reportType}
                                        onChange={handleReportTypeChange}
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <button
                                    className="windows-button"
                                    onClick={handleGenerateReport}
                                >
                                    Generate Report
                                </button>
                                <button
                                    className="windows-button"
                                    style={{ marginLeft: '8px' }}
                                    onClick={() => {
                                        // Export functionality would go here
                                    }}
                                >
                                    Export Data
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tab buttons */}
                    <div style={{ display: 'flex', marginBottom: '16px' }}>
                        {tabHeaders.map(tab => (
                            <button
                                key={tab.id}
                                className={`windows-button ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    marginRight: '4px'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab content */}
                    <div style={{
                        flexGrow: 1,
                        border: '1px solid black',
                        padding: '16px',
                        backgroundColor: 'white',
                        overflowY: 'auto'
                    }}>
                        {activeTab === 'revenue' && renderRevenueTab()}
                        {activeTab === 'providers' && renderProvidersTab()}
                        {activeTab === 'appointments' && renderAppointmentsTab()}
                        {activeTab === 'inventory' && renderInventoryTab()}
                        {activeTab === 'clients' && renderClientsTab()}
                        {activeTab === 'labtests' && renderLabTestsTab()}
                        {activeTab === 'saved' && renderSavedReportsTab()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsScreen; 