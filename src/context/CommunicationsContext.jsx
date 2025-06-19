import React, { createContext, useContext, useState } from 'react';

const CommunicationsContext = createContext();

export const useCommunications = () => {
    const context = useContext(CommunicationsContext);
    if (!context) {
        throw new Error('useCommunications must be used within a CommunicationsProvider');
    }
    return context;
};

export const CommunicationsProvider = ({ children }) => {
    const [templates, setTemplates] = useState([]);
    const [messageHistory, setMessageHistory] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [reminderQueue, setReminderQueue] = useState([]);

    // Function to set mock data for testing/demo
    const setMockCommunicationsData = () => {
        // Mock message templates
        setTemplates([
            {
                id: 'TPL001',
                name: 'Appointment Reminder',
                type: 'SMS',
                subject: '',
                body: 'Hello {clientName}, this is a reminder that {patientName} has an appointment scheduled for {appointmentDate} at {appointmentTime}. Please call (555) 123-4567 if you need to reschedule.',
                createdDate: '2023-12-01',
                lastModified: '2024-01-10',
            },
            {
                id: 'TPL002',
                name: 'Vaccination Due',
                type: 'Email',
                subject: '{patientName}\'s vaccinations are due soon',
                body: 'Dear {clientName},\n\nOur records indicate that {patientName} is due for the following vaccinations:\n\n{vaccinationsList}\n\nPlease call us at (555) 123-4567 to schedule an appointment.\n\nThank you,\nPine Hills Veterinary Clinic',
                createdDate: '2023-11-15',
                lastModified: '2024-02-22',
            },
            {
                id: 'TPL003',
                name: 'Prescription Ready',
                type: 'SMS',
                subject: '',
                body: 'Hello {clientName}, {patientName}\'s prescription is ready for pickup at Pine Hills Veterinary Clinic. We are open Mon-Fri 8am-6pm, Sat 9am-2pm.',
                createdDate: '2024-01-05',
                lastModified: '2024-01-05',
            },
            {
                id: 'TPL004',
                name: 'Lab Results Ready',
                type: 'Email',
                subject: '{patientName}\'s lab results are ready',
                body: 'Dear {clientName},\n\nThe laboratory results for {patientName} from {sampleDate} are now available. Please call us at (555) 123-4567 to discuss these results with Dr. {doctorName}.\n\nThank you,\nPine Hills Veterinary Clinic',
                createdDate: '2023-10-20',
                lastModified: '2024-02-15',
            },
            {
                id: 'TPL005',
                name: 'Post-Surgery Instructions',
                type: 'Email',
                subject: 'Post-Surgery Care Instructions for {patientName}',
                body: 'Dear {clientName},\n\nThank you for trusting us with {patientName}\'s recent {procedureName} surgery. Below are detailed care instructions for home:\n\n1. {instruction1}\n2. {instruction2}\n3. {instruction3}\n\nPlease contact us immediately if you observe:\n- {warning1}\n- {warning2}\n- {warning3}\n\nYour follow-up appointment is scheduled for {followupDate} at {followupTime}.\n\nBest regards,\nDr. {doctorName}\nPine Hills Veterinary Clinic\n(555) 123-4567',
                createdDate: '2023-09-15',
                lastModified: '2024-03-01',
            },
        ]);

        // Mock message history
        setMessageHistory([
            {
                id: 'MSG001',
                clientId: 'C1001',
                patientId: 'P2001',
                templateId: 'TPL001',
                type: 'SMS',
                recipient: '(415) 200-6597',
                subject: '',
                body: 'Hello Remy, this is a reminder that Wilson has an appointment scheduled for March 18, 2024 at 9:00 AM. Please call (555) 123-4567 if you need to reschedule.',
                sentDate: '2024-03-16T10:15:00',
                status: 'Delivered',
                sentBy: 'System',
            },
            {
                id: 'MSG002',
                clientId: 'C1001',
                patientId: 'P2001',
                templateId: 'TPL004',
                type: 'Email',
                recipient: 'remy@joinmero.com',
                subject: 'Wilson\'s lab results are ready',
                body: 'Dear Remy,\n\nThe laboratory results for Wilson from March 18, 2024 are now available. Please call us at (555) 123-4567 to discuss these results with Dr. Patterson.\n\nThank you,\nPine Hills Veterinary Clinic',
                sentDate: '2024-03-19T14:30:00',
                status: 'Delivered',
                sentBy: 'Dr. Patterson',
            },
            {
                id: 'MSG003',
                clientId: 'C1001',
                patientId: 'P2001',
                templateId: null,
                type: 'SMS',
                recipient: '(415) 200-6597',
                subject: '',
                body: 'Hello Remy, this is Dr. Patterson. Just checking in on Wilson. How is he doing after yesterday\'s appointment?',
                sentDate: '2024-03-19T11:45:00',
                status: 'Delivered',
                sentBy: 'Dr. Patterson',
            },
        ]);

        // Mock marketing campaigns
        setCampaigns([
            {
                id: 'CMP001',
                name: 'Spring Heartworm Prevention',
                description: 'Reminder campaign for heartworm prevention',
                targetAudience: 'All dogs without current heartworm prevention',
                templateId: 'TPL002',
                status: 'Active',
                startDate: '2024-04-01',
                endDate: '2024-04-30',
                sentCount: 0,
                deliveredCount: 0,
                openedCount: 0,
                scheduledSendDate: '2024-04-01T09:00:00',
            },
            {
                id: 'CMP002',
                name: 'Senior Pet Wellness',
                description: 'Health check reminders for senior pets',
                targetAudience: 'Dogs and cats over 7 years old',
                templateId: 'TPL001',
                status: 'Draft',
                startDate: '2024-05-01',
                endDate: '2024-05-31',
                sentCount: 0,
                deliveredCount: 0,
                openedCount: 0,
                scheduledSendDate: null,
            },
            {
                id: 'CMP003',
                name: 'Dental Health Month',
                description: 'Promotion for dental cleanings',
                targetAudience: 'All patients not having dental cleaning in past year',
                templateId: 'TPL002',
                status: 'Completed',
                startDate: '2024-02-01',
                endDate: '2024-02-29',
                sentCount: 187,
                deliveredCount: 183,
                openedCount: 105,
                scheduledSendDate: '2024-02-01T08:30:00',
            },
        ]);

        // Mock appointment reminders in queue
        setReminderQueue([
            {
                id: 'REM001',
                clientId: 'C1002',
                patientId: 'P2002',
                appointmentId: 'A2001',
                appointmentDate: '2024-03-25T14:30:00',
                templateId: 'TPL001',
                scheduledSendDate: '2024-03-24T09:00:00',
                status: 'Scheduled',
            },
            {
                id: 'REM002',
                clientId: 'C1003',
                patientId: 'P2003',
                appointmentId: 'A2002',
                appointmentDate: '2024-03-26T10:00:00',
                templateId: 'TPL001',
                scheduledSendDate: '2024-03-25T09:00:00',
                status: 'Scheduled',
            },
            {
                id: 'REM003',
                clientId: 'C1004',
                patientId: 'P2004',
                appointmentId: 'A2003',
                appointmentDate: '2024-03-26T11:30:00',
                templateId: 'TPL001',
                scheduledSendDate: '2024-03-25T09:00:00',
                status: 'Scheduled',
            },
        ]);
    };

    // CRUD operations for templates
    const addTemplate = (template) => {
        setTemplates([...templates, template]);
    };

    const updateTemplate = (id, updatedTemplate) => {
        setTemplates(
            templates.map((template) => (template.id === id ? updatedTemplate : template))
        );
    };

    const deleteTemplate = (id) => {
        setTemplates(templates.filter((template) => template.id !== id));
    };

    // Operations for sending messages
    const sendMessage = (message) => {
        const newMessage = {
            ...message,
            id: `MSG${messageHistory.length + 1}`.padStart(6, '0'),
            sentDate: new Date().toISOString(),
            status: 'Sent',
        };
        setMessageHistory([...messageHistory, newMessage]);
        return newMessage;
    };

    // Campaign operations
    const addCampaign = (campaign) => {
        setCampaigns([...campaigns, campaign]);
    };

    const updateCampaign = (id, updatedCampaign) => {
        setCampaigns(
            campaigns.map((campaign) => (campaign.id === id ? updatedCampaign : campaign))
        );
    };

    const deleteCampaign = (id) => {
        setCampaigns(campaigns.filter((campaign) => campaign.id !== id));
    };

    // Reminder operations
    const addReminder = (reminder) => {
        setReminderQueue([...reminderQueue, reminder]);
    };

    const updateReminder = (id, updatedReminder) => {
        setReminderQueue(
            reminderQueue.map((reminder) => (reminder.id === id ? updatedReminder : reminder))
        );
    };

    const deleteReminder = (id) => {
        setReminderQueue(reminderQueue.filter((reminder) => reminder.id !== id));
    };

    // Log communication for audit trail
    const logCommunication = (communicationData) => {
        const logEntry = {
            id: `LOG${Date.now()}`,
            timestamp: new Date().toISOString(),
            ...communicationData
        };
        
        // Add to message history
        setMessageHistory(prev => [...prev, logEntry]);
        
        // If it's a reminder, add to reminder queue
        if (communicationData.type === 'appointment_reminder' && communicationData.scheduledFor) {
            const reminder = {
                id: `REM${Date.now()}`,
                ...communicationData,
                status: 'Scheduled'
            };
            setReminderQueue(prev => [...prev, reminder]);
        }
        
        return logEntry;
    };

    return (
        <CommunicationsContext.Provider
            value={{
                templates,
                messageHistory,
                campaigns,
                reminderQueue,
                setMockCommunicationsData,
                addTemplate,
                updateTemplate,
                deleteTemplate,
                sendMessage,
                addCampaign,
                updateCampaign,
                deleteCampaign,
                addReminder,
                updateReminder,
                deleteReminder,
                logCommunication,
            }}
        >
            {children}
        </CommunicationsContext.Provider>
    );
}; 