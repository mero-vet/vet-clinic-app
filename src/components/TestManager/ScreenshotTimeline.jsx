import React, { useRef, useEffect, useState } from 'react';

const ScreenshotTimeline = ({ screenshots, currentTimestamp, onTimeSelect }) => {
  const scrollRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    // Auto-scroll to keep current screenshot in view
    if (scrollRef.current && screenshots.length > 0) {
      const currentIndex = screenshots.findIndex(s => s.timestamp === currentTimestamp);
      if (currentIndex >= 0) {
        const thumbnail = scrollRef.current.children[currentIndex];
        if (thumbnail) {
          thumbnail.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      }
    }
  }, [currentTimestamp, screenshots]);

  const formatTime = (timestamp) => {
    const seconds = Math.floor(timestamp / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const milliseconds = timestamp % 1000;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  const handleThumbnailClick = (screenshot) => {
    onTimeSelect(screenshot.timestamp);
  };

  const handleKeyDown = (e) => {
    if (!screenshots || screenshots.length === 0) return;

    const currentIndex = screenshots.findIndex(s => s.timestamp === currentTimestamp);
    
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
      onTimeSelect(screenshots[currentIndex - 1].timestamp);
    } else if (e.key === 'ArrowRight' && currentIndex < screenshots.length - 1) {
      onTimeSelect(screenshots[currentIndex + 1].timestamp);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTimestamp, screenshots]);

  if (!screenshots || screenshots.length === 0) {
    return (
      <div className="screenshot-timeline empty">
        <p>No screenshots available</p>
      </div>
    );
  }

  return (
    <div className="screenshot-timeline">
      <div className="timeline-controls">
        <button 
          onClick={() => onTimeSelect(screenshots[0].timestamp)}
          disabled={currentTimestamp === screenshots[0].timestamp}
        >
          ⏮ First
        </button>
        <button
          onClick={() => {
            const currentIndex = screenshots.findIndex(s => s.timestamp === currentTimestamp);
            if (currentIndex > 0) {
              onTimeSelect(screenshots[currentIndex - 1].timestamp);
            }
          }}
          disabled={currentTimestamp === screenshots[0].timestamp}
        >
          ◀ Previous
        </button>
        <span className="timeline-position">
          {screenshots.findIndex(s => s.timestamp === currentTimestamp) + 1} / {screenshots.length}
        </span>
        <button
          onClick={() => {
            const currentIndex = screenshots.findIndex(s => s.timestamp === currentTimestamp);
            if (currentIndex < screenshots.length - 1) {
              onTimeSelect(screenshots[currentIndex + 1].timestamp);
            }
          }}
          disabled={currentTimestamp === screenshots[screenshots.length - 1].timestamp}
        >
          Next ▶
        </button>
        <button
          onClick={() => onTimeSelect(screenshots[screenshots.length - 1].timestamp)}
          disabled={currentTimestamp === screenshots[screenshots.length - 1].timestamp}
        >
          Last ⏭
        </button>
      </div>

      <div className="timeline-scroll-container" ref={scrollRef}>
        {screenshots.map((screenshot, index) => (
          <div
            key={`${screenshot.timestamp}-${index}`}
            className={`timeline-thumbnail ${screenshot.timestamp === currentTimestamp ? 'active' : ''}`}
            onClick={() => handleThumbnailClick(screenshot)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <img src={screenshot.dataUrl || screenshot.data} alt={`Frame ${index + 1}`} />
            <div className="thumbnail-overlay">
              <span className="frame-number">#{index + 1}</span>
              <span className="timestamp">{formatTime(screenshot.timestamp)}</span>
            </div>
            {hoveredIndex === index && (
              <div className="thumbnail-tooltip">
                Frame {index + 1} @ {formatTime(screenshot.timestamp)}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="timeline-info">
        <span>Use ← → arrow keys to navigate</span>
      </div>
    </div>
  );
};

export default ScreenshotTimeline;