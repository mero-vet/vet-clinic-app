import React, { useEffect, useState } from 'react';
import { useCommunications } from '../context/CommunicationsContext';
import { usePatient } from '../context/PatientContext';
import '../styles/WindowsClassic.css';

const CommunicationsScreen = () => {
    const { patientData } = usePatient();
    const {
        templates,
        messageHistory,
        campaigns,
        reminderQueue,
        setMockCommunicationsData,
        sendMessage
    } = useCommunications();

    const [activeTab, setActiveTab] = useState('messages');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [messageForm, setMessageForm] = useState({
        type: 'SMS',
        recipient: '',
        subject: '',
        body: '',
        patientId: patientData.patientId,
        patientName: patientData.patientName,
        clientId: patientData.clientId,
        clientName: `${patientData.clientFirstName} ${patientData.clientLastName}`,
    });

    useEffect(() => {
        // Load mock data for this demo
        setMockCommunicationsData();

        // Update form with current patient data
        setMessageForm(prev => ({
            ...prev,
            recipient: patientData.phoneHome || patientData.clientEmail,
            patientId: patientData.patientId,
            patientName: patientData.patientName,
            clientId: patientData.clientId,
            clientName: `${patientData.clientFirstName} ${patientData.clientLastName}`,
        }));
    }, []);

    // Handle template selection
    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);

        // Replace placeholders in template with patient data
        let subject = template.subject || '';
        let body = template.body || '';

        // Replace common placeholders
        const replacements = {
            '{clientName}': `${patientData.clientFirstName} ${patientData.clientLastName}`,
            '{patientName}': patientData.patientName,
            '{appointmentDate}': 'scheduled date',
            '{appointmentTime}': 'scheduled time',
            '{doctorName}': 'Dr. Patterson',
        };

        // Apply replacements
        Object.entries(replacements).forEach(([placeholder, value]) => {
            subject = subject.replace(new RegExp(placeholder, 'g'), value);
            body = body.replace(new RegExp(placeholder, 'g'), value);
        });

        setMessageForm({
            ...messageForm,
            type: template.type,
            subject,
            body,
        });
    };

    // Handle message type change
    const handleTypeChange = (e) => {
        const newType = e.target.value;
        setMessageForm({
            ...messageForm,
            type: newType,
            recipient: newType === 'Email' ? patientData.clientEmail : patientData.phoneHome
        });
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMessageForm({
            ...messageForm,
            [name]: value
        });
    };

    // Handle message sending
    const handleSendMessage = () => {
        if (!messageForm.recipient || !messageForm.body) {
            alert('Please fill out required fields');
            return;
        }

        const message = {
            templateId: selectedTemplate?.id || null,
            type: messageForm.type,
            recipient: messageForm.recipient,
            subject: messageForm.subject,
            body: messageForm.body,
            patientId: messageForm.patientId,
            patientName: messageForm.patientName,
            clientId: messageForm.clientId,
            clientName: messageForm.clientName,
            sentBy: 'Current User',
        };

        sendMessage(message);

        // Reset form
        setMessageForm({
            type: 'SMS',
            recipient: patientData.phoneHome || patientData.clientEmail,
            subject: '',
            body: '',
            patientId: patientData.patientId,
            patientName: patientData.patientName,
            clientId: patientData.clientId,
            clientName: `${patientData.clientFirstName} ${patientData.clientLastName}`,
        });
        setSelectedTemplate(null);

        // Switch to history tab to show the sent message
        setActiveTab('history');
    };

    // Render message composition tab
    const renderMessagesTab = () => (
        <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
            {/* Template list */}
            <div style={{ flex: '1', overflowY: 'auto', marginRight: '16px', padding: '8px', border: '1px solid #888' }}>
                <h3>Message Templates</h3>
                {templates.map((template) => (
                    <div
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        style={{
                            cursor: 'pointer',
                            padding: '8px',
                            marginBottom: '8px',
                            border: '1px solid #ccc',
                            backgroundColor: selectedTemplate?.id === template.id ? '#0078D7' : '#f0f0f0',
                            color: selectedTemplate?.id === template.id ? 'white' : 'black',
                        }}
                    >
                        <div><strong>{template.name}</strong></div>
                        <div style={{ fontSize: '12px' }}>Type: {template.type}</div>
                        <div style={{ fontSize: '12px' }}>Last Modified: {template.lastModified}</div>
                    </div>
                ))}
            </div>

            {/* Message composition form */}
            <div style={{ flex: '3', overflowY: 'auto' }}>
                <h3>Compose Message</h3>

                <div className="form-row">
                    <label>Message Type:</label>
                    <select name="type" value={messageForm.type} onChange={handleTypeChange}>
                        <option value="SMS">SMS</option>
                        <option value="Email">Email</option>
                    </select>
                </div>

                <div className="form-row">
                    <label>Recipient:</label>
                    <input
                        type="text"
                        name="recipient"
                        value={messageForm.recipient}
                        onChange={handleInputChange}
                        placeholder={messageForm.type === 'Email' ? 'Email address' : 'Phone number'}
                        style={{ width: '300px' }}
                    />
                </div>

                {messageForm.type === 'Email' && (
                    <div className="form-row">
                        <label>Subject:</label>
                        <input
                            type="text"
                            name="subject"
                            value={messageForm.subject}
                            onChange={handleInputChange}
                            placeholder="Email subject"
                            style={{ width: '300px' }}
                        />
                    </div>
                )}

                <div className="form-row">
                    <label>Message:</label>
                    <textarea
                        name="body"
                        value={messageForm.body}
                        onChange={handleInputChange}
                        placeholder="Enter your message"
                        style={{ width: '100%', height: '200px' }}
                    />
                </div>

                <div style={{ marginTop: '16px' }}>
                    <button
                        className="windows-button"
                        onClick={handleSendMessage}
                        disabled={!messageForm.recipient || !messageForm.body}
                    >
                        Send Message
                    </button>
                    <button
                        className="windows-button"
                        style={{ marginLeft: '8px' }}
                        onClick={() => {
                            setSelectedTemplate(null);
                            setMessageForm({
                                type: 'SMS',
                                recipient: patientData.phoneHome || patientData.clientEmail,
                                subject: '',
                                body: '',
                                patientId: patientData.patientId,
                                patientName: patientData.patientName,
                                clientId: patientData.clientId,
                                clientName: `${patientData.clientFirstName} ${patientData.clientLastName}`,
                            });
                        }}
                    >
                        Clear Form
                    </button>
                </div>
            </div>
        </div>
    );

    // Render message history tab
    const renderHistoryTab = () => {
        // Sort messages in reverse chronological order (newest first)
        const sortedMessages = [...messageHistory].sort((a, b) =>
            new Date(b.sentDate) - new Date(a.sentDate)
        );

        return (
            <div style={{ height: '100%', overflowY: 'auto' }}>
                <h3>Message History</h3>

                <table className="windows-table" style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th>Date/Time</th>
                            <th>Type</th>
                            <th>Recipient</th>
                            <th>Subject</th>
                            <th>Message</th>
                            <th>Status</th>
                            <th>Sent By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedMessages.map((message) => (
                            <tr key={message.id}>
                                <td>{new Date(message.sentDate).toLocaleString()}</td>
                                <td>{message.type}</td>
                                <td>{message.recipient}</td>
                                <td>{message.subject}</td>
                                <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {message.body}
                                </td>
                                <td>{message.status}</td>
                                <td>{message.sentBy}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ marginTop: '16px' }}>
                    <button className="windows-button">Export History</button>
                </div>
            </div>
        );
    };

    // Render reminder queue tab
    const renderRemindersTab = () => {
        // Sort reminders by scheduled send date
        const sortedReminders = [...reminderQueue].sort((a, b) =>
            new Date(a.scheduledSendDate) - new Date(b.scheduledSendDate)
        );

        return (
            <div style={{ height: '100%', overflowY: 'auto' }}>
                <h3>Appointment Reminders</h3>

                <table className="windows-table" style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Patient</th>
                            <th>Appointment Date</th>
                            <th>Send Date</th>
                            <th>Template</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedReminders.map((reminder) => {
                            const template = templates.find(t => t.id === reminder.templateId);
                            return (
                                <tr key={reminder.id}>
                                    <td>{reminder.id}</td>
                                    <td>{reminder.patientName}</td>
                                    <td>{new Date(reminder.appointmentDate).toLocaleString()}</td>
                                    <td>{new Date(reminder.scheduledSendDate).toLocaleString()}</td>
                                    <td>{template?.name || 'Custom'}</td>
                                    <td>{reminder.status}</td>
                                    <td>
                                        <button className="windows-button">Edit</button>
                                        <button className="windows-button" style={{ marginLeft: '4px' }}>Cancel</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <div style={{ marginTop: '16px' }}>
                    <button className="windows-button">Add Reminder</button>
                    <button className="windows-button" style={{ marginLeft: '8px' }}>Schedule Batch</button>
                </div>
            </div>
        );
    };

    // Render campaigns tab
    const renderCampaignsTab = () => (
        <div style={{ height: '100%', overflowY: 'auto' }}>
            <h3>Marketing Campaigns</h3>

            <table className="windows-table" style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Target Audience</th>
                        <th>Status</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Sent</th>
                        <th>Open Rate</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {campaigns.map((campaign) => {
                        const openRate = campaign.openedCount > 0
                            ? Math.round((campaign.openedCount / campaign.deliveredCount) * 100)
                            : 0;

                        return (
                            <tr key={campaign.id}>
                                <td>{campaign.name}</td>
                                <td>{campaign.targetAudience}</td>
                                <td style={{
                                    backgroundColor:
                                        campaign.status === 'Active' ? '#dff0d8' :
                                            campaign.status === 'Draft' ? '#fcf8e3' :
                                                '#f2dede',
                                    fontWeight: 'bold'
                                }}>
                                    {campaign.status}
                                </td>
                                <td>{campaign.startDate?.split('T')[0]}</td>
                                <td>{campaign.endDate?.split('T')[0]}</td>
                                <td>{campaign.sentCount}/{campaign.deliveredCount}</td>
                                <td>{openRate}%</td>
                                <td>
                                    <button className="windows-button">Edit</button>
                                    <button
                                        className="windows-button"
                                        style={{ marginLeft: '4px' }}
                                        disabled={campaign.status === 'Completed'}
                                    >
                                        {campaign.status === 'Draft' ? 'Start' : campaign.status === 'Active' ? 'Stop' : 'View'}
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div style={{ marginTop: '16px' }}>
                <button className="windows-button">Create New Campaign</button>
                <button className="windows-button" style={{ marginLeft: '8px' }}>Import Contact List</button>
            </div>
        </div>
    );

    // Render template management tab
    const renderTemplatesTab = () => (
        <div style={{ height: '100%', overflowY: 'auto' }}>
            <h3>Message Templates</h3>

            <table className="windows-table" style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Created Date</th>
                        <th>Last Modified</th>
                        <th>Preview</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {templates.map((template) => (
                        <tr key={template.id}>
                            <td>{template.name}</td>
                            <td>{template.type}</td>
                            <td>{template.createdDate}</td>
                            <td>{template.lastModified}</td>
                            <td>
                                <button
                                    className="windows-button"
                                    onClick={() => handleTemplateSelect(template)}
                                >
                                    Preview
                                </button>
                            </td>
                            <td>
                                <button className="windows-button">Edit</button>
                                <button className="windows-button" style={{ marginLeft: '4px' }}>Clone</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ marginTop: '16px' }}>
                <button className="windows-button">Create New Template</button>
                <button className="windows-button" style={{ marginLeft: '8px' }}>Import Templates</button>
            </div>

            {/* Preview of selected template */}
            {selectedTemplate && (
                <div style={{ marginTop: '24px', border: '1px solid #ccc', padding: '16px' }}>
                    <h4>Template Preview: {selectedTemplate.name}</h4>
                    {selectedTemplate.type === 'Email' && selectedTemplate.subject && (
                        <div className="form-row">
                            <strong>Subject:</strong> {selectedTemplate.subject}
                        </div>
                    )}
                    <div className="form-row">
                        <strong>Body:</strong>
                    </div>
                    <div style={{ whiteSpace: 'pre-line', marginTop: '8px', padding: '8px', border: '1px solid #eee' }}>
                        {selectedTemplate.body}
                    </div>
                    <div style={{ marginTop: '16px' }}>
                        <button
                            className="windows-button"
                            onClick={() => {
                                setSelectedTemplate(null);
                                setActiveTab('messages');
                                handleTemplateSelect(selectedTemplate);
                            }}
                        >
                            Use This Template
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="windows-classic">
            <div className="window" style={{ margin: '0', height: '100%' }}>
                <div className="title-bar">
                    <div className="title-bar-text">Client Communications</div>
                    <div className="title-bar-controls">
                        <button aria-label="Minimize"></button>
                        <button aria-label="Maximize"></button>
                        <button aria-label="Close"></button>
                    </div>
                </div>

                <div className="window-body" style={{ padding: '16px', display: 'flex', flexDirection: 'column', height: 'calc(100% - 32px)' }}>
                    {/* Client info header */}
                    <div className="fieldset" style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <div className="form-row">
                                    <strong>Client:</strong> {patientData.clientFirstName} {patientData.clientLastName} ({patientData.clientId})
                                </div>
                                <div className="form-row">
                                    <strong>Phone:</strong> {patientData.phoneHome || 'Not provided'}
                                </div>
                            </div>
                            <div>
                                <div className="form-row">
                                    <strong>Email:</strong> {patientData.clientEmail || 'Not provided'}
                                </div>
                                <div className="form-row">
                                    <strong>Patient:</strong> {patientData.patientName} ({patientData.patientId})
                                </div>
                            </div>
                            <div>
                                <button className="windows-button">Change Client</button>
                            </div>
                        </div>
                    </div>

                    {/* Tab buttons */}
                    <div style={{ display: 'flex', marginBottom: '16px' }}>
                        <button
                            className={`windows-button ${activeTab === 'messages' ? 'active' : ''}`}
                            onClick={() => setActiveTab('messages')}
                            style={{
                                backgroundColor: activeTab === 'messages' ? '#000080' : '',
                                color: activeTab === 'messages' ? 'white' : '',
                                marginRight: '4px'
                            }}
                        >
                            Compose Message
                        </button>
                        <button
                            className={`windows-button ${activeTab === 'history' ? 'active' : ''}`}
                            onClick={() => setActiveTab('history')}
                            style={{
                                backgroundColor: activeTab === 'history' ? '#000080' : '',
                                color: activeTab === 'history' ? 'white' : '',
                                marginRight: '4px'
                            }}
                        >
                            Message History
                        </button>
                        <button
                            className={`windows-button ${activeTab === 'reminders' ? 'active' : ''}`}
                            onClick={() => setActiveTab('reminders')}
                            style={{
                                backgroundColor: activeTab === 'reminders' ? '#000080' : '',
                                color: activeTab === 'reminders' ? 'white' : '',
                                marginRight: '4px'
                            }}
                        >
                            Appointment Reminders
                        </button>
                        <button
                            className={`windows-button ${activeTab === 'campaigns' ? 'active' : ''}`}
                            onClick={() => setActiveTab('campaigns')}
                            style={{
                                backgroundColor: activeTab === 'campaigns' ? '#000080' : '',
                                color: activeTab === 'campaigns' ? 'white' : '',
                                marginRight: '4px'
                            }}
                        >
                            Marketing Campaigns
                        </button>
                        <button
                            className={`windows-button ${activeTab === 'templates' ? 'active' : ''}`}
                            onClick={() => setActiveTab('templates')}
                            style={{
                                backgroundColor: activeTab === 'templates' ? '#000080' : '',
                                color: activeTab === 'templates' ? 'white' : '',
                                marginRight: '4px'
                            }}
                        >
                            Templates
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
                        {activeTab === 'messages' && renderMessagesTab()}
                        {activeTab === 'history' && renderHistoryTab()}
                        {activeTab === 'reminders' && renderRemindersTab()}
                        {activeTab === 'campaigns' && renderCampaignsTab()}
                        {activeTab === 'templates' && renderTemplatesTab()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunicationsScreen; 