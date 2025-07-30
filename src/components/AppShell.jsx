import React, { useState, useEffect, useCallback } from 'react';
import SplitPane, { Pane } from 'split-pane-react';
import 'split-pane-react/esm/themes/default.css';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { MdMinimize, MdClose, MdCropSquare } from 'react-icons/md';
import CovetrusMenuButton from './CovetrusMenuButton';

/**
 * AppShell – Generic Windows-XP-like shell used by the Covetrus persona.
 *
 * Grid rows: 32px header, 28px menu, 48px toolbar, auto content, 22px status.
 * Grid columns: 240px left, auto, 340px right – middle two columns are resizable via SplitPane.
 * Column sizes persist in localStorage so users keep their preference on refresh.
 */
const AppShell = ({
  menu,
  topToolbar,
  leftPane,
  rightPane,
  children,
}) => {
  // --- Split-pane persistence helpers -------------------------------------
  const readSize = (key, defaultValue) => {
    const raw = window.localStorage.getItem(key);
    const val = Number(raw);
    return Number.isFinite(val) ? val : defaultValue;
  };

  const [leftSize, setLeftSize] = useState(() => readSize('covetrusLeftWidth', 200));
  const [rightSize, setRightSize] = useState(() => readSize('covetrusRightWidth', 300));
  const sizes = [leftSize, 'auto', rightSize];

  const saveSize = useCallback((key, value) => {
    window.localStorage.setItem(key, String(value));
  }, []);

  useEffect(() => saveSize('covetrusLeftWidth', leftSize), [leftSize, saveSize]);
  useEffect(() => saveSize('covetrusRightWidth', rightSize), [rightSize, saveSize]);

  // --- Render ------------------------------------------------------------
  return (
          <div
        style={{
          display: 'grid',
          gridTemplateRows: '32px 28px 48px 1fr 22px',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
      {/* Header */}
      <AppBar position="static" color="primary" sx={{ height: 32, minHeight: 32 }}>
        <Toolbar variant="dense" sx={{ minHeight: 32, height: 32, px: 1 }}>
          <div style={{ marginRight: 8 }}>
            <CovetrusMenuButton />
          </div>
          <Typography variant="caption" sx={{ fontWeight: 600, flexGrow: 1 }}>
            Impromed&nbsp;Infinity
          </Typography>
          <IconButton size="small" color="inherit" sx={{ p: 0.5 }}>
            <MdMinimize size={16} />
          </IconButton>
          <IconButton size="small" color="inherit" sx={{ p: 0.5 }}>
            <MdCropSquare size={16} />
          </IconButton>
          <IconButton size="small" color="inherit" sx={{ p: 0.5 }}>
            <MdClose size={16} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Menu */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 8,
          fontSize: 13,
          background: 'var(--menu-bg, #eaeaea)',
        }}
      >
        {menu || null}
      </div>

      {/* Top green toolbar */}
      <div style={{ height: '48px' }}>
        {topToolbar || null}
      </div>

      {/* Content area with resizable columns */}
      <SplitPane
        split="vertical"
        sizes={sizes}
        onChange={([newLeft, , newRight]) => {
          setLeftSize(newLeft);
          setRightSize(newRight);
        }}
        sashRender={() => <div style={{ width: '1px', background: '#ccc' }} />}  
        style={{ height: '100%' }}
      >
        <Pane minSize={180} maxSize="50%">
          <div style={{ height: '100%', overflow: 'auto' }}>{leftPane}</div>
        </Pane>

        <div style={{ height: '100%', overflow: 'auto' }}>{children}</div>

        <Pane minSize={240} maxSize="50%">
          <div style={{ height: '100%', overflow: 'auto' }}>{rightPane}</div>
        </Pane>
      </SplitPane>

      {/* Status strip */}
      <StatusStrip />
    </div>
  );
};

const StatusStrip = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 12,
        padding: '0 8px',
        background: 'var(--status-bg, #eaeaea)',
        borderTop: '1px solid #c9c9c9',
      }}
    >
      <span>User: Demo | Location: Main Hospital</span>
      <span>{now.toLocaleString()}</span>
    </div>
  );
};

AppShell.propTypes = {
  menu: PropTypes.node,
  topToolbar: PropTypes.node,
  leftPane: PropTypes.node,
  rightPane: PropTypes.node,
  children: PropTypes.node,
};

export default AppShell; 