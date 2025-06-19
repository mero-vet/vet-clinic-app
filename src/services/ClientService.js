// Mock client data storage
let clients = [];

// Initialize with some mock data
const initializeClients = () => {
  const mockClients = [
    {
      clientId: 'C-2024-001',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@email.com',
      phone: '(555) 123-4567',
      alternatePhone: '',
      street: '123 Oak Street',
      city: 'Springfield',
      state: 'IL',
      zip: '62701',
      preferredContact: 'phone',
      notes: 'Prefers morning appointments',
      createdDate: '2024-01-15T10:00:00Z',
      lastModified: '2024-01-15T10:00:00Z'
    },
    {
      clientId: 'C-2024-002',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'mchen@email.com',
      phone: '(555) 234-5678',
      alternatePhone: '(555) 234-5679',
      street: '456 Elm Avenue',
      city: 'Springfield',
      state: 'IL',
      zip: '62702',
      preferredContact: 'email',
      notes: 'Has two dogs and a cat',
      createdDate: '2024-01-20T14:30:00Z',
      lastModified: '2024-01-20T14:30:00Z'
    },
    {
      clientId: 'C-2024-003',
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@email.com',
      phone: '(555) 345-6789',
      alternatePhone: '',
      street: '789 Pine Road',
      city: 'Springfield',
      state: 'IL',
      zip: '62703',
      preferredContact: 'text',
      notes: 'Works night shift - call after 2pm',
      createdDate: '2024-02-01T09:15:00Z',
      lastModified: '2024-02-01T09:15:00Z'
    }
  ];
  
  // Load from localStorage if available
  const stored = localStorage.getItem('vetClinicClients');
  if (stored) {
    clients = JSON.parse(stored);
  } else {
    clients = mockClients;
    localStorage.setItem('vetClinicClients', JSON.stringify(clients));
  }
};

// Initialize on load
initializeClients();

/**
 * Generate a unique client ID
 */
const generateClientId = () => {
  const year = new Date().getFullYear();
  const existingIds = clients.filter(c => c.clientId.startsWith(`C-${year}-`));
  const nextNumber = existingIds.length + 1;
  return `C-${year}-${String(nextNumber).padStart(3, '0')}`;
};

/**
 * Check for duplicate clients
 * @param {Object} clientData - The new client's information
 * @returns {Promise<Array>} Array of potential duplicate clients
 */
export function checkDuplicateClients(clientData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { firstName, lastName, email, phone } = clientData;
      
      // Normalize phone for comparison
      const normalizePhone = (phone) => phone.replace(/\D/g, '');
      const normalizedNewPhone = normalizePhone(phone);
      
      const duplicates = clients.filter(client => {
        // Check exact email match
        if (email && client.email && email.toLowerCase() === client.email.toLowerCase()) {
          return true;
        }
        
        // Check exact phone match
        if (phone && client.phone && normalizePhone(client.phone) === normalizedNewPhone) {
          return true;
        }
        
        // Check name similarity (same last name and similar first name)
        if (lastName && client.lastName && 
            lastName.toLowerCase() === client.lastName.toLowerCase() &&
            firstName && client.firstName &&
            (firstName.toLowerCase() === client.firstName.toLowerCase() ||
             firstName.toLowerCase().startsWith(client.firstName.toLowerCase().charAt(0)))) {
          return true;
        }
        
        return false;
      });
      
      resolve(duplicates);
    }, 200);
  });
}

/**
 * Create a new client
 * @param {Object} clientData - The new client's information
 * @returns {Promise<Object>} A Promise resolving to the created client
 */
export function createClient(clientData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const newClient = {
          ...clientData,
          clientId: generateClientId(),
          createdDate: clientData.createdDate || new Date().toISOString(),
          lastModified: clientData.lastModified || new Date().toISOString()
        };
        
        // Add to storage
        clients.push(newClient);
        localStorage.setItem('vetClinicClients', JSON.stringify(clients));
        
        resolve({
          success: true,
          data: newClient
        });
      } catch (error) {
        reject({
          success: false,
          error: 'Failed to create client'
        });
      }
    }, 500);
  });
}

/**
 * Get a client by ID
 * @param {string} clientId - The client ID
 * @returns {Promise<Object>} The client data
 */
export function getClientById(clientId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const client = clients.find(c => c.clientId === clientId);
      if (client) {
        resolve({
          success: true,
          data: client
        });
      } else {
        reject({
          success: false,
          error: 'Client not found'
        });
      }
    }, 100);
  });
}

/**
 * Update a client
 * @param {string} clientId - The client ID
 * @param {Object} updates - The fields to update
 * @returns {Promise<Object>} The updated client
 */
export function updateClient(clientId, updates) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = clients.findIndex(c => c.clientId === clientId);
      if (index !== -1) {
        clients[index] = {
          ...clients[index],
          ...updates,
          lastModified: new Date().toISOString()
        };
        localStorage.setItem('vetClinicClients', JSON.stringify(clients));
        
        resolve({
          success: true,
          data: clients[index]
        });
      } else {
        reject({
          success: false,
          error: 'Client not found'
        });
      }
    }, 300);
  });
}

/**
 * Search clients
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching clients
 */
export function searchClients(query) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!query || query.trim() === '') {
        resolve([]);
        return;
      }
      
      const lowerQuery = query.toLowerCase();
      const results = clients.filter(client => {
        return (
          client.firstName.toLowerCase().includes(lowerQuery) ||
          client.lastName.toLowerCase().includes(lowerQuery) ||
          client.email.toLowerCase().includes(lowerQuery) ||
          client.phone.includes(query) ||
          client.clientId.toLowerCase().includes(lowerQuery)
        );
      });
      
      resolve(results);
    }, 200);
  });
}

/**
 * Get all clients
 * @returns {Promise<Array>} Array of all clients
 */
export function getAllClients() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(clients);
    }, 100);
  });
}