import React from 'react';
import SkipperCanvas from './SkipperCanvas';
import BrandLogo from './BrandLogo';

export default function LandingPage({ onSelectTrack, studentName }) {
  return (
    <div className="landing-wrapper">
      {/* Skipper Animated Walking Crowd Canvas Background */}
      <SkipperCanvas className="skipper-canvas" />

      {/* Ambient background glow */}
      <div className="landing-glow" aria-hidden="true" />

      {/* Top Header */}
      <header className="landing-header">
        <div className="nav-brand">
          <BrandLogo size={26} />
          <span>Assignment Portal</span>
          {studentName && (
            <span className="pill" style={{ fontSize: '0.75rem', padding: '2px 8px', marginInlineStart: '0.5rem' }}>
              👤 {studentName}
            </span>
          )}
        </div>
      </header>

      {/* Main Centered Buttons (No Dialog Box) */}
      <main className="landing-buttons-wrapper">
        <div className="landing-buttons-group">
          {/* Button 1: HTML & CSS */}
          <button
            type="button"
            className="landing-track-btn landing-track-btn-primary"
            onClick={() => onSelectTrack('assignment')}
            id="btn-html-css-track"
          >
            <span className="track-btn-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </span>
            <span className="track-btn-text">HTML & CSS</span>
            <span className="track-btn-arrow" aria-hidden="true">→</span>
          </button>

          {/* Button 2: Generative AI */}
          <button
            type="button"
            className="landing-track-btn landing-track-btn-secondary"
            id="btn-genai-track"
          >
            <span className="track-btn-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </span>
            <span className="track-btn-text">Generative AI</span>
            <span className="track-btn-badge">Future</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="landing-footer">

      </footer>
    </div>
  );
}
