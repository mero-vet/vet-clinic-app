# PRD-14: Log Explorer UI

Current Status: PLANNED
Next Action Item: Approve functional requirements
Blocking Issues: None

## Key Files and Components

### Files to Create
- `src/components/TestManager/LogExplorer.jsx`
  - Main container for the Log Explorer modal / route
  - Handles data loading, timeline sync, and UI state
- `src/components/TestManager/ScreenshotTimeline.jsx`
  - Horizontal scroll / scrub bar showing screenshot thumbnails
  - Emits `onTimeSelect(timestamp)` events
- `src/components/TestManager/LogViewer.jsx`
  - Pretty-prints JSON log entries with syntax highlighting
  - Filters by timestamp range coming from `ScreenshotTimeline`
- `src/components/TestManager/HeatmapOverlay.jsx`
  - Draws click dots and optional cursor path lines on screenshots
  - Data source: mouse-event coordinates in log payload
- `src/styles/LogExplorer.css`
  - Styling for responsive split-panel layout and dark mode

### Existing Dependencies
- `src/context/TestLoggerContext.jsx` (provides recorded logs)
- `src/components/ReplayViewer.jsx` (prototype that can be refactored)
- `src/services/api.js` (may be extended to fetch logs from new storage location)

## Objective

Provide a dedicated Log Explorer that lets developers and QA visually replay any recorded session. The UI should synchronise beautified action logs with the corresponding timestamped screenshots, enabling frame-by-frame inspection, cursor heat-map overlays, and quick navigation through a scrub-bar. This improves debugging efficiency and demonstrates the agent's behaviour to stakeholders.

## Implementation Plan

### Phase 1: MVP Viewer (Static File)
- [ ] 1.1 Build `LogExplorer` route/modal with two-pane layout (left = screenshot, right = log list)
- [ ] 1.2 Implement `ScreenshotTimeline` with horizontal scroll + active frame highlight
- [ ] 1.3 Pretty-print JSON in `LogViewer`; auto-scroll to keep current frame centred
- [ ] 1.4 Accept local `.json` + image folder drag-and-drop for offline use

### Phase 2: Heat-Map & Cursor Overlay
- [ ] 2.1 Parse mouse events and generate dot/line overlay on the current screenshot
- [ ] 2.2 Toggle overlay visibility + legend for click types

### Phase 3: Integrated Data Source
- [ ] 3.1 Switch to new central storage API (defined in PRD-15) for fetching logs + screenshots by `sessionId`
- [ ] 3.2 Add session selector drop-down with search & sort
- [ ] 3.3 Implement deep-link route `/log-explorer/:sessionId`

### Phase 4: Usability Polish
- [ ] 4.1 Keyboard shortcuts for scrub (←/→) and zoom (+/-)
- [ ] 4.2 Dark-mode theming, responsive mobile view
- [ ] 4.3 Export annotated screenshot as PNG

## Technical Design

### Data Contract
```jsonc
{
  "sessionId": "string",
  "startedAt": "ISO-timestamp",
  "screenshots": [
    {
      "timestamp": 0,
      "path": "/logs/{sessionId}/img/000.png"
    }
  ],
  "events": [
    {
      "timestamp": 0,
      "type": "click|keydown|mousemove",
      "x": 123,
      "y": 456,
      "selector": "button#save",
      "key": "S"
    }
  ]
}
```

### Timeline Sync Algorithm (pseudo-code)
```javascript
function findFrameIdx(events, ts) {
  return screenshots.findIndex((f, i) => ts < screenshots[i + 1]?.timestamp);
}
```

### Performance Notes
- Lazy-load screenshots as they enter viewport
- Memoise parsed events by second to keep rendering below 16 ms per frame

## Success Criteria
- Render first screenshot within 1 s on standard laptop
- Scrub latency < 150 ms for 95th percentile of frames
- Heat-map overlay accuracy ±2 px versus raw coordinates
- Developers rate new tool 8/10 or higher in post-beta survey

## Risks and Mitigations
- **Large sessions (>500 screenshots)** may cause memory spikes → implement virtualised list & image caching.
- **Coordinate mismatch** between screenshots and viewport → store viewport size in log header for proper scaling.
- **Time-sync drift** if screenshots or logs drop frames → interpolate based on nearest timestamp.

## Future Considerations
- Support side-by-side diff of two sessions
- Annotate events with AI "intent" metadata
- Export to MP4 for sharing 