import React from 'react';
import { usePIMS } from '../context/PIMSContext';
import PIMSScreenWrapper from '../components/PIMSScreenWrapper';
import QueueDashboard from '../components/QueueManagement/QueueDashboard';

const QueueManagementScreen = () => {
    const { config } = usePIMS();

    return (
        <PIMSScreenWrapper
            screenName="queue-management"
            title={config?.screenLabels?.['queue-management'] || 'Queue Management'}
        >
            <div style={{ padding: '1rem', minHeight: '100vh' }}>
                <QueueDashboard />
            </div>
        </PIMSScreenWrapper>
    );
};

export default QueueManagementScreen; 