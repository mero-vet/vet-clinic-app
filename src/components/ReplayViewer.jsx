import React, { useRef, useState, useEffect } from 'react';

function ReplayViewer() {
  const [logData, setLogData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const playRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    try {
      const json = JSON.parse(text);
      if (json.logs) {
        setLogData(json);
        setCurrentIndex(0);
      } else {
        alert('Invalid log file');
      }
    } catch (err) {
      alert('Failed to parse JSON');
    }
  };

  // draw heatmap of clicks
  useEffect(() => {
    if (!logData || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const clickEvents = logData.logs.filter(l => l.type === 'click' && l.x != null);
    clickEvents.forEach(ev => {
      ctx.beginPath();
      ctx.arc(ev.x, ev.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,0,0,0.2)';
      ctx.fill();
    });
  }, [logData]);

  // playback effect
  useEffect(() => {
    if (!playing || !logData) return;
    const logs = logData.logs.filter(l => l.screenshot);
    if (currentIndex >= logs.length - 1) {
      setPlaying(false);
      return;
    }
    const delay = logs[currentIndex + 1].timestamp - logs[currentIndex].timestamp;
    playRef.current = setTimeout(() => {
      setCurrentIndex(idx => idx + 1);
    }, Math.max(100, delay));
    return () => clearTimeout(playRef.current);
  }, [playing, currentIndex, logData]);

  const logsWithShots = logData?.logs.filter(l => l.screenshot) || [];
  const currentShot = logsWithShots[currentIndex]?.screenshot;

  return (
    <div style={{ padding: 20 }}>
      <h2>Replay Viewer</h2>
      <input type="file" accept="application/json" onChange={handleFileChange} />

      {logData && (
        <div style={{ marginTop: 20 }}>
          <div style={{ position: 'relative', border: '1px solid #ccc', display: 'inline-block' }}>
            {currentShot && (
              <img src={currentShot} alt="screenshot" style={{ display: 'block', maxWidth: '800px' }} />
            )}
            {/* heatmap overlay */}
            {currentShot && (
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}
              />
            )}
          </div>

          <div style={{ marginTop: 10 }}>
            <button onClick={() => setPlaying(p => !p)} disabled={!logsWithShots.length}>
              {playing ? 'Pause' : 'Play'}
            </button>
            <input
              type="range"
              min={0}
              max={Math.max(0, logsWithShots.length - 1)}
              value={currentIndex}
              onChange={e => setCurrentIndex(Number(e.target.value))}
              style={{ width: '400px', marginLeft: 10 }}
            />
            <span style={{ marginLeft: 10 }}>
              {currentIndex + 1}/{logsWithShots.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReplayViewer;