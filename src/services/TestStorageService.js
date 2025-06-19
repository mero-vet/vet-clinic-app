// TestStorageService.js - Centralized storage for test logs and screenshots

class TestStorageService {
  constructor() {
    this.currentSessionId = null;
    this.sessionMeta = null;
    this.storageMode = import.meta.env.VITE_TEST_STORAGE_MODE || 'local';
    this.adapter = null;
    this.initializeAdapter();
  }

  async initializeAdapter() {
    if (this.storageMode === 'local') {
      this.adapter = new LocalDiskAdapter();
    } else {
      // Future: S3 adapter
      this.adapter = new LocalDiskAdapter(); // fallback for now
    }
    await this.adapter.initialize();
  }

  async initSession(meta) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const sessionId = `${timestamp}_${meta.scenarioId || 'unknown'}`;
    
    this.currentSessionId = sessionId;
    this.sessionMeta = {
      ...meta,
      sessionId,
      startTime: Date.now(),
      status: 'in_progress'
    };

    await this.adapter.createSession(sessionId, this.sessionMeta);
    return sessionId;
  }

  async saveEvent(event) {
    if (!this.currentSessionId) {
      throw new Error('No active session. Call initSession first.');
    }
    await this.adapter.saveEvent(this.currentSessionId, event);
  }

  async saveScreenshot(blob, timestamp) {
    if (!this.currentSessionId) {
      throw new Error('No active session. Call initSession first.');
    }
    await this.adapter.saveScreenshot(this.currentSessionId, blob, timestamp);
  }

  async finaliseSession(evaluation) {
    if (!this.currentSessionId) {
      throw new Error('No active session to finalize.');
    }

    const finalMeta = {
      ...this.sessionMeta,
      endTime: Date.now(),
      duration: Date.now() - this.sessionMeta.startTime,
      status: 'completed',
      evaluation
    };

    await this.adapter.finalizeSession(this.currentSessionId, finalMeta);
    
    const sessionId = this.currentSessionId;
    this.currentSessionId = null;
    this.sessionMeta = null;
    
    return sessionId;
  }

  async listSessions(limit = 50) {
    return await this.adapter.listSessions(limit);
  }

  async getSession(sessionId) {
    return await this.adapter.getSession(sessionId);
  }

  async exportZip(sessionId) {
    return await this.adapter.exportZip(sessionId);
  }

  async deleteOldSessions(daysToKeep = 30) {
    return await this.adapter.deleteOldSessions(daysToKeep);
  }
}

// Local Disk Adapter using File System Access API with IndexedDB fallback
class LocalDiskAdapter {
  constructor() {
    this.dbName = 'VetClinicTestLogs';
    this.db = null;
    this.rootDirHandle = null;
    this.useFileSystem = false;
  }

  async initialize() {
    // Try File System Access API first
    if ('showDirectoryPicker' in window) {
      try {
        // Check if we have a cached directory handle
        const handles = await navigator.storage.getDirectory();
        if (handles) {
          this.rootDirHandle = handles;
          this.useFileSystem = true;
          console.log('Using File System Access API for test storage');
          return;
        }
      } catch {
        console.log('File System Access not available, falling back to IndexedDB');
      }
    }

    // Fall back to IndexedDB
    await this.initIndexedDB();
  }

  async initIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        console.log('Using IndexedDB for test storage');
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionsStore = db.createObjectStore('sessions', { keyPath: 'sessionId' });
          sessionsStore.createIndex('startTime', 'startTime');
        }
        
        if (!db.objectStoreNames.contains('events')) {
          const eventsStore = db.createObjectStore('events', { autoIncrement: true });
          eventsStore.createIndex('sessionId', 'sessionId');
          eventsStore.createIndex('timestamp', 'timestamp');
        }
        
        if (!db.objectStoreNames.contains('screenshots')) {
          const screenshotsStore = db.createObjectStore('screenshots', { autoIncrement: true });
          screenshotsStore.createIndex('sessionId', 'sessionId');
          screenshotsStore.createIndex('timestamp', 'timestamp');
        }
      };
    });
  }

  async requestFileSystemAccess() {
    if (!('showDirectoryPicker' in window)) {
      return false;
    }

    try {
      this.rootDirHandle = await window.showDirectoryPicker({
        mode: 'readwrite'
      });
      
      // Cache the handle for future use
      await navigator.storage.persist();
      
      this.useFileSystem = true;
      return true;
    } catch (err) {
      console.error('File system access denied:', err);
      return false;
    }
  }

  async createSession(sessionId, meta) {
    if (this.useFileSystem) {
      await this.createSessionFileSystem(sessionId, meta);
    } else {
      await this.createSessionIndexedDB(sessionId, meta);
    }
  }

  async createSessionFileSystem(sessionId, meta) {
    try {
      // Create session directory
      const sessionDir = await this.rootDirHandle.getDirectoryHandle(sessionId, { create: true });
      
      // Write meta.json
      const metaFile = await sessionDir.getFileHandle('meta.json', { create: true });
      const writable = await metaFile.createWritable();
      await writable.write(JSON.stringify(meta, null, 2));
      await writable.close();
      
      // Create img directory
      await sessionDir.getDirectoryHandle('img', { create: true });
    } catch (err) {
      console.error('Failed to create session in file system:', err);
      throw err;
    }
  }

  async createSessionIndexedDB(sessionId, meta) {
    const transaction = this.db.transaction(['sessions'], 'readwrite');
    const store = transaction.objectStore('sessions');
    await store.put(meta);
  }

  async saveEvent(sessionId, event) {
    if (this.useFileSystem) {
      await this.saveEventFileSystem(sessionId, event);
    } else {
      await this.saveEventIndexedDB(sessionId, event);
    }
  }

  async saveEventFileSystem(sessionId, event) {
    try {
      const sessionDir = await this.rootDirHandle.getDirectoryHandle(sessionId);
      
      // Append to events.jsonl
      const eventsFile = await sessionDir.getFileHandle('events.jsonl', { create: true });
      const writable = await eventsFile.createWritable({ keepExistingData: true });
      const file = await eventsFile.getFile();
      await writable.seek(file.size);
      await writable.write(JSON.stringify(event) + '\n');
      await writable.close();
    } catch (err) {
      console.error('Failed to save event to file system:', err);
      throw err;
    }
  }

  async saveEventIndexedDB(sessionId, event) {
    const transaction = this.db.transaction(['events'], 'readwrite');
    const store = transaction.objectStore('events');
    await store.add({ ...event, sessionId });
  }

  async saveScreenshot(sessionId, blob, timestamp) {
    if (this.useFileSystem) {
      await this.saveScreenshotFileSystem(sessionId, blob, timestamp);
    } else {
      await this.saveScreenshotIndexedDB(sessionId, blob, timestamp);
    }
  }

  async saveScreenshotFileSystem(sessionId, blob, timestamp) {
    try {
      const sessionDir = await this.rootDirHandle.getDirectoryHandle(sessionId);
      const imgDir = await sessionDir.getDirectoryHandle('img');
      
      // Generate filename based on timestamp
      const index = Math.floor(timestamp / 1000);
      const filename = `${String(index).padStart(3, '0')}.png`;
      
      const file = await imgDir.getFileHandle(filename, { create: true });
      const writable = await file.createWritable();
      await writable.write(blob);
      await writable.close();
    } catch (err) {
      console.error('Failed to save screenshot to file system:', err);
      throw err;
    }
  }

  async saveScreenshotIndexedDB(sessionId, blob, timestamp) {
    const transaction = this.db.transaction(['screenshots'], 'readwrite');
    const store = transaction.objectStore('screenshots');
    await store.add({ sessionId, timestamp, data: blob });
  }

  async finalizeSession(sessionId, finalMeta) {
    if (this.useFileSystem) {
      await this.finalizeSessionFileSystem(sessionId, finalMeta);
    } else {
      await this.finalizeSessionIndexedDB(sessionId, finalMeta);
    }
  }

  async finalizeSessionFileSystem(sessionId, finalMeta) {
    try {
      const sessionDir = await this.rootDirHandle.getDirectoryHandle(sessionId);
      
      // Update meta.json
      const metaFile = await sessionDir.getFileHandle('meta.json');
      const writable = await metaFile.createWritable();
      await writable.write(JSON.stringify(finalMeta, null, 2));
      await writable.close();
    } catch (err) {
      console.error('Failed to finalize session in file system:', err);
      throw err;
    }
  }

  async finalizeSessionIndexedDB(sessionId, finalMeta) {
    const transaction = this.db.transaction(['sessions'], 'readwrite');
    const store = transaction.objectStore('sessions');
    await store.put(finalMeta);
  }

  async listSessions(limit) {
    if (this.useFileSystem) {
      return await this.listSessionsFileSystem(limit);
    } else {
      return await this.listSessionsIndexedDB(limit);
    }
  }

  async listSessionsFileSystem(limit) {
    const sessions = [];
    
    try {
      for await (const entry of this.rootDirHandle.values()) {
        if (entry.kind === 'directory') {
          try {
            const metaFile = await entry.getFileHandle('meta.json');
            const file = await metaFile.getFile();
            const meta = JSON.parse(await file.text());
            sessions.push(meta);
          } catch (err) {
            console.warn(`Failed to read session ${entry.name}:`, err);
          }
        }
      }
    } catch (err) {
      console.error('Failed to list sessions from file system:', err);
      return [];
    }
    
    // Sort by start time descending and limit
    return sessions
      .sort((a, b) => b.startTime - a.startTime)
      .slice(0, limit);
  }

  async listSessionsIndexedDB(limit) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['sessions'], 'readonly');
      const store = transaction.objectStore('sessions');
      const index = store.index('startTime');
      const sessions = [];
      
      const request = index.openCursor(null, 'prev');
      let count = 0;
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor && count < limit) {
          sessions.push(cursor.value);
          count++;
          cursor.continue();
        } else {
          resolve(sessions);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  async getSession(sessionId) {
    if (this.useFileSystem) {
      return await this.getSessionFileSystem(sessionId);
    } else {
      return await this.getSessionIndexedDB(sessionId);
    }
  }

  async getSessionFileSystem(sessionId) {
    try {
      const sessionDir = await this.rootDirHandle.getDirectoryHandle(sessionId);
      
      // Read meta.json
      const metaFile = await sessionDir.getFileHandle('meta.json');
      const metaText = await (await metaFile.getFile()).text();
      const meta = JSON.parse(metaText);
      
      // Read events
      const events = [];
      try {
        const eventsFile = await sessionDir.getFileHandle('events.jsonl');
        const eventsText = await (await eventsFile.getFile()).text();
        const lines = eventsText.trim().split('\n');
        for (const line of lines) {
          if (line) {
            events.push(JSON.parse(line));
          }
        }
      } catch {
        // No events file
      }
      
      // Read screenshots
      const screenshots = [];
      try {
        const imgDir = await sessionDir.getDirectoryHandle('img');
        for await (const entry of imgDir.values()) {
          if (entry.kind === 'file' && entry.name.endsWith('.png')) {
            const file = await entry.getFile();
            const arrayBuffer = await file.arrayBuffer();
            const blob = new Blob([arrayBuffer], { type: 'image/png' });
            const dataUrl = await this.blobToDataURL(blob);
            const timestamp = parseInt(entry.name.replace('.png', '')) * 1000;
            screenshots.push({ timestamp, dataUrl });
          }
        }
      } catch {
        // No screenshots
      }
      
      screenshots.sort((a, b) => a.timestamp - b.timestamp);
      
      return { meta, events, screenshots };
    } catch (err) {
      console.error('Failed to get session from file system:', err);
      throw err;
    }
  }

  async getSessionIndexedDB(sessionId) {
    const transaction = this.db.transaction(['sessions', 'events', 'screenshots'], 'readonly');
    
    // Get meta
    const sessionStore = transaction.objectStore('sessions');
    const meta = await this.getFromStore(sessionStore, sessionId);
    
    if (!meta) {
      throw new Error('Session not found');
    }
    
    // Get events
    const eventsStore = transaction.objectStore('events');
    const eventsIndex = eventsStore.index('sessionId');
    const events = await this.getAllFromIndex(eventsIndex, sessionId);
    
    // Get screenshots
    const screenshotsStore = transaction.objectStore('screenshots');
    const screenshotsIndex = screenshotsStore.index('sessionId');
    const screenshotRecords = await this.getAllFromIndex(screenshotsIndex, sessionId);
    
    const screenshots = await Promise.all(
      screenshotRecords.map(async (record) => ({
        timestamp: record.timestamp,
        dataUrl: await this.blobToDataURL(record.data)
      }))
    );
    
    return { meta, events, screenshots };
  }

  async exportZip(sessionId) {
    const session = await this.getSession(sessionId);
    
    // Create zip file using JSZip (will need to add this dependency)
    // For now, return a JSON blob
    const exportData = {
      meta: session.meta,
      events: session.events,
      screenshotCount: session.screenshots.length
    };
    
    return new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  }

  async deleteOldSessions(daysToKeep) {
    const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    const sessions = await this.listSessions(1000); // Get more sessions for cleanup
    
    const toDelete = sessions.filter(s => s.startTime < cutoffTime);
    
    for (const session of toDelete) {
      await this.deleteSession(session.sessionId);
    }
    
    return toDelete.length;
  }

  async deleteSession(sessionId) {
    if (this.useFileSystem) {
      await this.deleteSessionFileSystem(sessionId);
    } else {
      await this.deleteSessionIndexedDB(sessionId);
    }
  }

  async deleteSessionFileSystem(sessionId) {
    try {
      await this.rootDirHandle.removeEntry(sessionId, { recursive: true });
    } catch (err) {
      console.error('Failed to delete session from file system:', err);
    }
  }

  async deleteSessionIndexedDB(sessionId) {
    const transaction = this.db.transaction(['sessions', 'events', 'screenshots'], 'readwrite');
    
    // Delete session
    transaction.objectStore('sessions').delete(sessionId);
    
    // Delete events
    const eventsIndex = transaction.objectStore('events').index('sessionId');
    const eventKeys = await this.getAllKeysFromIndex(eventsIndex, sessionId);
    for (const key of eventKeys) {
      transaction.objectStore('events').delete(key);
    }
    
    // Delete screenshots
    const screenshotsIndex = transaction.objectStore('screenshots').index('sessionId');
    const screenshotKeys = await this.getAllKeysFromIndex(screenshotsIndex, sessionId);
    for (const key of screenshotKeys) {
      transaction.objectStore('screenshots').delete(key);
    }
  }

  // Helper methods
  async blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async getFromStore(store, key) {
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllFromIndex(index, key) {
    return new Promise((resolve, reject) => {
      const results = [];
      const request = index.openCursor(IDBKeyRange.only(key));
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  async getAllKeysFromIndex(index, key) {
    return new Promise((resolve, reject) => {
      const keys = [];
      const request = index.openCursor(IDBKeyRange.only(key));
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          keys.push(cursor.primaryKey);
          cursor.continue();
        } else {
          resolve(keys);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }
}

// Create singleton instance
const testStorageService = new TestStorageService();

export default testStorageService;