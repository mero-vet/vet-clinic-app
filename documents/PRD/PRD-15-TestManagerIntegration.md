# PRD-15: Test Manager – Log Explorer Integration & Centralised Log Storage

Current Status: PLANNED
Next Action Item: Confirm storage location strategy
Blocking Issues: None

## Key Files and Components

### Files to Update
- `src/components/TestManager.jsx`
  - Add **"View Log Explorer"** button
  - Route to `/log-explorer/:sessionId` with latest recording ID
- `src/context/TestLoggerContext.jsx`
  - Persist `sessionId`, `logs`, `screenshots` metadata at end of test
- `src/services/TestStorageService.js` (NEW)
  - Abstract read/write operations to chosen storage (IndexedDB → future S3/bucket)
- `src/services/api.js`
  - Proxy download link for offline export (zip)

### Build-Time Config
- `vite.config.js` – Define `VITE_TEST_STORAGE_MODE` env (`local|s3`)

## Objective

Extend the existing Test Manager so that QA engineers can jump directly into the Log Explorer after a run and so logs/screenshots are saved in a predictable folder (`~/VetClinicLogs/{date}/{sessionId}` on desktop; IndexedDB in browser). This replaces the current single-file download approach and enables multi-session history.

## Implementation Plan

### Phase 1: Storage Refactor
- [ ] 1.1 Design `TestStorageService` interface (`saveEvent()`, `saveScreenshot()`, `finaliseSession()`)
- [ ] 1.2 Implement **Local Disk** adapter using File System Access API (desktop Chrome) with graceful fallback to IndexedDB
- [ ] 1.3 Migrate existing recorder to call the new service

### Phase 2: Test Manager UI Updates
- [ ] 2.1 Add "Logs" sidebar to list past sessions (date, scenario, status)
- [ ] 2.2 Add **View Log Explorer** button that opens latest session or selected row
- [ ] 2.3 Show toast with destination path after test ends

### Phase 3: Export & Clean-Up
- [ ] 3.1 Provide "Download zip" from session row
- [ ] 3.2 Auto-purge sessions older than configurable retention (default 30 days)

## Technical Design

### Storage Path Convention
```
~/VetClinicLogs/
  2025-06-19_17-52-03_workflow-3/
    meta.json           # header (matches Log Explorer contract)
    img/000.png
    img/001.png
```

### API Surface (TypeScript)
```ts
interface TestStorageService {
  initSession(meta: SessionHeader): Promise<string>; // returns sessionId
  saveEvent(e: LogEvent): Promise<void>;
  saveScreenshot(file: Blob, ts: number): Promise<void>;
  finaliseSession(): Promise<void>;
  listSessions(limit?: number): Promise<SessionSummary[]>;
  exportZip(sessionId: string): Promise<Blob>;
}
```

### Permission Handling
- Request access on first use; cache handle in IndexedDB
- Fallback silently when permission denied → IndexedDB mode

## Success Criteria
- 100% of tests save without permission errors (or fallback)
- "View Log Explorer" opens correct session within 2 clicks
- Storage overhead ≤ 5 MB per minute of test on average
- QA can locate 14-day-old session in under 10 s via sidebar search

## Risks and Mitigations
- **File System Access API unsupported** → Provide IndexedDB fallback + manual export
- **Disk quota exceeded** → Warn user and refuse to start new test
- **Privacy concerns** → Store locally only by default, require opt-in for cloud upload

## Future Considerations
- Add S3 adapter for cloud-based CI runs
- Hook into GitHub Actions artefacts for PR validations
- Real-time streaming to WebSocket for remote observers 