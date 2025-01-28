// src/services/ClientService.js
// Mock service methods for client creation, suitable for a front-end only demo.

/**
 * createClient
 * Simulates sending client data to an API and returns a Promise.
 *
 * @param {Object} clientData - The new client's information.
 * @returns {Promise<Object>} A Promise resolving to a fake success response.
 */
export function createClient(clientData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, you'd do an HTTP POST request here.
      resolve({
        success: true,
        data: {
          id: Date.now(), // mock unique ID
          ...clientData,
        },
      });
    }, 500);
  });
}