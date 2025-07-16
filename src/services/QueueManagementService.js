import DataFactory from './mockData/DataFactory';
import { useUiStore } from '../stores/uiStore';

class QueueManagementService {
    constructor() {
        this.queues = new Map();
        this.rooms = new Map();
        this.staff = new Map();
        this.appointments = new Map();
        this.waitTimes = new Map();
        this.dataFactory = new DataFactory();

        this.initialize();
    }

    initialize() {
        // Initialize rooms
        this.initializeRooms();

        // Initialize staff
        this.initializeStaff();

        // Generate initial queue data
        this.generateInitialQueue();

        // Start real-time updates
        this.startRealtimeUpdates();
    }

    initializeRooms() {
        const rooms = [
            { id: 'exam-1', name: 'Exam Room 1', type: 'examination', capacity: 1, available: true },
            { id: 'exam-2', name: 'Exam Room 2', type: 'examination', capacity: 1, available: true },
            { id: 'exam-3', name: 'Exam Room 3', type: 'examination', capacity: 1, available: false },
            { id: 'surgery-1', name: 'Surgery Suite 1', type: 'surgery', capacity: 1, available: true },
            { id: 'surgery-2', name: 'Surgery Suite 2', type: 'surgery', capacity: 1, available: true },
            { id: 'treatment-1', name: 'Treatment Room 1', type: 'treatment', capacity: 2, available: true },
            { id: 'isolation-1', name: 'Isolation Room 1', type: 'isolation', capacity: 1, available: true },
            { id: 'dental-1', name: 'Dental Suite', type: 'dental', capacity: 1, available: true }
        ];

        rooms.forEach(room => {
            this.rooms.set(room.id, {
                ...room,
                currentPatient: null,
                estimatedFreeTime: null,
                utilizationToday: Math.floor(Math.random() * 80) + 20 // 20-100%
            });
        });
    }

    initializeStaff() {
        const staff = [
            { id: 'dr-smith', name: 'Dr. Smith', role: 'veterinarian', available: true, currentRoom: null },
            { id: 'dr-jones', name: 'Dr. Jones', role: 'veterinarian', available: true, currentRoom: 'exam-3' },
            { id: 'dr-wilson', name: 'Dr. Wilson', role: 'veterinarian', available: false, currentRoom: 'surgery-1' },
            { id: 'tech-alice', name: 'Alice Johnson', role: 'technician', available: true, currentRoom: null },
            { id: 'tech-bob', name: 'Bob Martinez', role: 'technician', available: true, currentRoom: 'treatment-1' },
            { id: 'tech-carol', name: 'Carol Davis', role: 'technician', available: false, currentRoom: null }
        ];

        staff.forEach(person => {
            this.staff.set(person.id, {
                ...person,
                workloadToday: Math.floor(Math.random() * 12) + 3, // 3-15 patients
                averageAppointmentTime: Math.floor(Math.random() * 20) + 25, // 25-45 minutes
                expertise: this.generateExpertise(person.role)
            });
        });
    }

    generateExpertise(role) {
        const veterinarianExpertise = ['general', 'surgery', 'dental', 'emergency'];
        const technicianExpertise = ['general', 'laboratory', 'radiology', 'anesthesia'];

        if (role === 'veterinarian') {
            return veterinarianExpertise.slice(0, Math.floor(Math.random() * 3) + 2);
        } else {
            return technicianExpertise.slice(0, Math.floor(Math.random() * 2) + 2);
        }
    }

    generateInitialQueue() {
        // Generate waiting patients
        const queueTypes = ['checkin', 'waiting', 'inprogress', 'ready'];

        queueTypes.forEach(type => {
            this.queues.set(type, []);
        });

        // Add some patients to different queue states
        for (let i = 0; i < 8; i++) {
            const patient = this.dataFactory.generatePatient({
                includeAppointment: true,
                includeOwner: true
            });

            const queueEntry = {
                id: `queue-${Date.now()}-${i}`,
                patientId: patient.id,
                patient: patient,
                appointmentTime: new Date(Date.now() + (Math.random() - 0.5) * 3600000), // ±30 minutes
                actualArrivalTime: new Date(Date.now() - Math.random() * 1800000), // Up to 30 minutes ago
                priority: this.calculatePriority(patient),
                estimatedDuration: Math.floor(Math.random() * 45) + 15, // 15-60 minutes
                reasonForVisit: this.generateReasonForVisit(),
                assignedStaff: null,
                assignedRoom: null,
                status: this.getRandomStatus(),
                waitTime: 0,
                notes: []
            };

            const queueType = this.determineQueueType(queueEntry);
            this.queues.get(queueType).push(queueEntry);

            // Update wait times
            this.updateWaitTime(queueEntry.id);
        }

        // Sort queues by priority and wait time
        this.sortAllQueues();
    }

    calculatePriority(patient) {
        // Higher priority = more urgent (1-10 scale)
        let priority = 5; // Base priority

        // Age factors
        if (patient.age < 1) priority += 2; // Young animals
        if (patient.age > 10) priority += 1; // Senior animals

        // Emergency conditions (would be determined by check-in assessment)
        const emergencyChance = Math.random();
        if (emergencyChance < 0.1) priority += 3; // 10% chance of emergency
        if (emergencyChance < 0.2) priority += 1; // Another 10% chance of urgent

        return Math.min(priority, 10);
    }

    generateReasonForVisit() {
        const reasons = [
            'Annual wellness exam',
            'Vaccination update',
            'Skin irritation',
            'Limping/lameness',
            'Digestive issues',
            'Follow-up examination',
            'Emergency visit - unknown illness',
            'Dental cleaning',
            'Spay/neuter surgery',
            'Wound care',
            'Blood work',
            'X-ray examination'
        ];

        return reasons[Math.floor(Math.random() * reasons.length)];
    }

    getRandomStatus() {
        const statuses = ['waiting', 'checkin', 'inprogress'];
        return statuses[Math.floor(Math.random() * statuses.length)];
    }

    determineQueueType(queueEntry) {
        switch (queueEntry.status) {
            case 'checkin':
                return 'checkin';
            case 'waiting':
                return 'waiting';
            case 'inprogress':
                return 'inprogress';
            case 'ready':
                return 'ready';
            default:
                return 'waiting';
        }
    }

    startRealtimeUpdates() {
        // Update wait times every 30 seconds
        setInterval(() => {
            this.updateAllWaitTimes();
            this.checkForAutomaticTransitions();
        }, 30000);

        // Simulate patient arrivals every 2-5 minutes
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance every interval
                this.simulatePatientArrival();
            }
        }, Math.random() * 180000 + 120000); // 2-5 minutes
    }

    updateAllWaitTimes() {
        this.queues.forEach((queue, queueType) => {
            queue.forEach(entry => {
                this.updateWaitTime(entry.id);
            });
        });
    }

    updateWaitTime(queueEntryId) {
        const entry = this.findQueueEntry(queueEntryId);
        if (!entry) return;

        const now = new Date();
        const arrivalTime = entry.actualArrivalTime;
        entry.waitTime = Math.floor((now - arrivalTime) / (1000 * 60)); // Minutes

        this.waitTimes.set(queueEntryId, entry.waitTime);
    }

    findQueueEntry(queueEntryId) {
        for (const [queueType, queue] of this.queues) {
            const entry = queue.find(e => e.id === queueEntryId);
            if (entry) return entry;
        }
        return null;
    }

    checkForAutomaticTransitions() {
        // Simulate completion of appointments
        const inProgressQueue = this.queues.get('inprogress');

        inProgressQueue.forEach((entry, index) => {
            // 5% chance per check that an appointment completes
            if (Math.random() < 0.05) {
                this.completeAppointment(entry.id);
            }
        });

        // Move waiting patients to available rooms
        this.assignRoomsToWaitingPatients();
    }

    assignRoomsToWaitingPatients() {
        const waitingQueue = this.queues.get('waiting');
        const availableRooms = Array.from(this.rooms.values()).filter(room => room.available);
        const availableStaff = Array.from(this.staff.values()).filter(staff => staff.available);

        waitingQueue.sort((a, b) => {
            // Sort by priority (high to low), then by wait time (long to short)
            if (a.priority !== b.priority) return b.priority - a.priority;
            return b.waitTime - a.waitTime;
        });

        let assignments = 0;
        for (const entry of waitingQueue) {
            if (assignments >= availableRooms.length || assignments >= availableStaff.length) break;

            const suitableRoom = this.findSuitableRoom(entry);
            const suitableStaff = this.findSuitableStaff(entry);

            if (suitableRoom && suitableStaff) {
                this.assignPatientToRoom(entry.id, suitableRoom.id, suitableStaff.id);
                assignments++;
            }
        }
    }

    findSuitableRoom(queueEntry) {
        const availableRooms = Array.from(this.rooms.values()).filter(room => room.available);

        // Prefer rooms based on reason for visit
        const reason = queueEntry.reasonForVisit.toLowerCase();
        let preferredType = 'examination';

        if (reason.includes('surgery') || reason.includes('spay') || reason.includes('neuter')) {
            preferredType = 'surgery';
        } else if (reason.includes('dental')) {
            preferredType = 'dental';
        } else if (reason.includes('isolation') || reason.includes('contagious')) {
            preferredType = 'isolation';
        }

        // First try to find preferred room type
        let room = availableRooms.find(r => r.type === preferredType);

        // If no preferred room, use any examination room
        if (!room && preferredType !== 'examination') {
            room = availableRooms.find(r => r.type === 'examination');
        }

        // Last resort: any available room
        if (!room) {
            room = availableRooms[0];
        }

        return room;
    }

    findSuitableStaff(queueEntry) {
        const availableStaff = Array.from(this.staff.values()).filter(staff => staff.available);

        // Prefer veterinarians for complex cases
        const reason = queueEntry.reasonForVisit.toLowerCase();
        const needsVet = reason.includes('exam') || reason.includes('surgery') ||
            reason.includes('emergency') || queueEntry.priority >= 8;

        if (needsVet) {
            const vet = availableStaff.find(s => s.role === 'veterinarian');
            if (vet) return vet;
        }

        // For routine procedures, technicians can handle
        const tech = availableStaff.find(s => s.role === 'technician');
        if (tech && !needsVet) return tech;

        // Fallback to any available staff
        return availableStaff[0];
    }

    assignPatientToRoom(queueEntryId, roomId, staffId) {
        const entry = this.findQueueEntry(queueEntryId);
        if (!entry) return false;

        // Remove from current queue
        const currentQueue = this.queues.get('waiting');
        const index = currentQueue.findIndex(e => e.id === queueEntryId);
        if (index > -1) {
            currentQueue.splice(index, 1);
        }

        // Update entry
        entry.assignedRoom = roomId;
        entry.assignedStaff = staffId;
        entry.status = 'inprogress';

        // Add to in-progress queue
        this.queues.get('inprogress').push(entry);

        // Update room and staff availability
        const room = this.rooms.get(roomId);
        const staff = this.staff.get(staffId);

        if (room) {
            room.available = false;
            room.currentPatient = entry.patientId;
            room.estimatedFreeTime = new Date(Date.now() + entry.estimatedDuration * 60000);
        }

        if (staff) {
            staff.available = false;
            staff.currentRoom = roomId;
        }

        // Log the assignment
        entry.notes.push({
            timestamp: new Date(),
            type: 'assignment',
            message: `Assigned to ${room?.name} with ${staff?.name}`
        });

        return true;
    }

    completeAppointment(queueEntryId) {
        const entry = this.findQueueEntry(queueEntryId);
        if (!entry) return false;

        // Remove from in-progress queue
        const inProgressQueue = this.queues.get('inprogress');
        const index = inProgressQueue.findIndex(e => e.id === queueEntryId);
        if (index > -1) {
            inProgressQueue.splice(index, 1);
        }

        // Update status
        entry.status = 'completed';
        entry.completionTime = new Date();

        // Free up resources
        if (entry.assignedRoom) {
            const room = this.rooms.get(entry.assignedRoom);
            if (room) {
                room.available = true;
                room.currentPatient = null;
                room.estimatedFreeTime = null;
            }
        }

        if (entry.assignedStaff) {
            const staff = this.staff.get(entry.assignedStaff);
            if (staff) {
                staff.available = true;
                staff.currentRoom = null;
            }
        }

        // Log completion
        entry.notes.push({
            timestamp: new Date(),
            type: 'completion',
            message: `Appointment completed successfully`
        });

        return true;
    }

    simulatePatientArrival() {
        const patient = this.dataFactory.generatePatient({
            includeAppointment: true,
            includeOwner: true
        });

        const queueEntry = {
            id: `queue-${Date.now()}-${Math.random()}`,
            patientId: patient.id,
            patient: patient,
            appointmentTime: new Date(Date.now() + Math.random() * 1800000), // Next 30 minutes
            actualArrivalTime: new Date(),
            priority: this.calculatePriority(patient),
            estimatedDuration: Math.floor(Math.random() * 45) + 15,
            reasonForVisit: this.generateReasonForVisit(),
            assignedStaff: null,
            assignedRoom: null,
            status: 'checkin',
            waitTime: 0,
            notes: [{
                timestamp: new Date(),
                type: 'arrival',
                message: 'Patient arrived for appointment'
            }]
        };

        this.queues.get('checkin').push(queueEntry);
        this.sortQueue('checkin');
    }

    sortAllQueues() {
        this.queues.forEach((queue, queueType) => {
            this.sortQueue(queueType);
        });
    }

    sortQueue(queueType) {
        const queue = this.queues.get(queueType);
        if (!queue) return;

        queue.sort((a, b) => {
            // Sort by priority (high to low), then by wait time (long to short)
            if (a.priority !== b.priority) return b.priority - a.priority;
            return b.waitTime - a.waitTime;
        });
    }

    // Public API methods
    getAllQueues() {
        const result = {};
        this.queues.forEach((queue, type) => {
            result[type] = [...queue]; // Return copies
        });
        return result;
    }

    getQueueStatistics() {
        const stats = {
            totalPatients: 0,
            averageWaitTime: 0,
            peakWaitTime: 0,
            roomUtilization: 0,
            staffUtilization: 0,
            priorityDistribution: { low: 0, medium: 0, high: 0, emergency: 0 }
        };

        let totalWaitTime = 0;
        let maxWaitTime = 0;

        this.queues.forEach(queue => {
            queue.forEach(entry => {
                stats.totalPatients++;
                totalWaitTime += entry.waitTime;
                maxWaitTime = Math.max(maxWaitTime, entry.waitTime);

                // Priority distribution
                if (entry.priority <= 3) stats.priorityDistribution.low++;
                else if (entry.priority <= 6) stats.priorityDistribution.medium++;
                else if (entry.priority <= 8) stats.priorityDistribution.high++;
                else stats.priorityDistribution.emergency++;
            });
        });

        stats.averageWaitTime = stats.totalPatients > 0 ? Math.round(totalWaitTime / stats.totalPatients) : 0;
        stats.peakWaitTime = maxWaitTime;

        // Room utilization
        const totalRooms = this.rooms.size;
        const occupiedRooms = Array.from(this.rooms.values()).filter(r => !r.available).length;
        stats.roomUtilization = Math.round((occupiedRooms / totalRooms) * 100);

        // Staff utilization
        const totalStaff = this.staff.size;
        const busyStaff = Array.from(this.staff.values()).filter(s => !s.available).length;
        stats.staffUtilization = Math.round((busyStaff / totalStaff) * 100);

        return stats;
    }

    getAllRooms() {
        return Array.from(this.rooms.values());
    }

    getAllStaff() {
        return Array.from(this.staff.values());
    }

    movePatientToQueue(queueEntryId, targetQueueType) {
        const entry = this.findQueueEntry(queueEntryId);
        if (!entry) return false;

        // Find and remove from current queue
        for (const [queueType, queue] of this.queues) {
            const index = queue.findIndex(e => e.id === queueEntryId);
            if (index > -1) {
                queue.splice(index, 1);
                break;
            }
        }

        // Update status and add to new queue
        entry.status = targetQueueType;
        this.queues.get(targetQueueType).push(entry);

        // Log the move
        entry.notes.push({
            timestamp: new Date(),
            type: 'status_change',
            message: `Moved to ${targetQueueType} queue`
        });

        this.sortQueue(targetQueueType);
        return true;
    }

    updatePatientPriority(queueEntryId, newPriority) {
        const entry = this.findQueueEntry(queueEntryId);
        if (!entry) return false;

        entry.priority = Math.max(1, Math.min(10, newPriority));

        entry.notes.push({
            timestamp: new Date(),
            type: 'priority_change',
            message: `Priority updated to ${entry.priority}`
        });

        // Re-sort the queue
        for (const [queueType, queue] of this.queues) {
            if (queue.includes(entry)) {
                this.sortQueue(queueType);
                break;
            }
        }

        return true;
    }

    getEstimatedWaitTime(priority = 5) {
        const waitingQueue = this.queues.get('waiting');

        // Count patients with equal or higher priority
        const ahead = waitingQueue.filter(entry => entry.priority >= priority).length;

        // Average appointment duration
        const avgDuration = 30; // minutes

        // Available staff count
        const availableStaff = Array.from(this.staff.values()).filter(s => s.available).length;

        if (availableStaff === 0) {
            return Math.ceil(ahead * avgDuration);
        }

        return Math.ceil((ahead * avgDuration) / availableStaff);
    }
}

export default QueueManagementService;
export { QueueManagementService }; 