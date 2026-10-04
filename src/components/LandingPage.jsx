import React from 'react';
import SkipperCanvas from './SkipperCanvas';

export default function LandingPage({ onSelectTrack, theme, onToggleTheme }) {
  return (
    <div className="landing-wrapper">
      {/* Skipper Animated Walking Crowd Canvas Background */}
      <SkipperCanvas className="skipper-canvas" />

      {/* Ambient background glow */}
      <div className="landing-glow" aria-hidden="true" />

      {/* Top Header */}
      <header className="landing-header">
        <div className="nav-brand">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>Portfolio Portal</span>
        </div>

        <button
          className="btn-icon"
          onClick={onToggleTheme}
          type="button"
          aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
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
