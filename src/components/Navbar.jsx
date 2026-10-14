import React from 'react';
import BrandLogo from './BrandLogo';
import { ProgressiveBlur } from './ui/skiper-ui/skiper41';
import { ThemeToggleButton } from './ui/skiper-ui/skiper26';

export default function Navbar({ onBackToHome, onBackToAssignment, view, track, studentName, theme, onToggleTheme, onOpenClipboard }) {
  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      {/* Progressive Blur Transition Bar */}
      <ProgressiveBlur
        position="top"
        height="96px"
        blurAmount="12px"
        backgroundColor="var(--color-bg-canvas)"
        className="pointer-events-none"
      />

      <div className="wrap relative z-10">
        <a
          className="nav-brand"
          href="#top"
          onClick={(e) => {
            if (onBackToAssignment) {
              e.preventDefault();
              onBackToAssignment();
            } else if (onBackToHome) {
              e.preventDefault();
              onBackToHome();
            }
          }}
          aria-label="Assignment Portal"
        >
          <BrandLogo size={26} />
          <span style={{ fontWeight: 700 }}>
            {view === 'genai' || track === 'genai' ? 'Generative AI' : 'HTML & CSS'}
          </span>
          <span className="pill" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
            {view === 'genai'
              ? 'Project Track'
              : view === 'github-guide'
              ? (track === 'genai' ? 'Gen AI Guide' : 'Portfolio 101')
              : view === 'pdf-guide'
              ? (track === 'genai' ? 'Gen AI PDF Guide' : 'PDF Guide')
              : 'Portfolio Track'}
          </span>
        </a>

        <div className="nav-actions">
          {studentName && (
            <div className="nav-student-pill" title={`Student: ${studentName}`}>
              <span className="nav-student-dot" aria-hidden="true" />
              <span className="nav-student-name">{studentName}</span>
            </div>
          )}

          {onOpenClipboard && (
            <button
              className="landing-clipboard-nav-btn navbar-clipboard-btn"
              onClick={onOpenClipboard}
              type="button"
              aria-label="Open Online Clipboard"
              title="Open Live Online Clipboard"
              style={{ padding: '6px 12px', fontSize: '0.8125rem' }}
            >
              <div className="landing-clipboard-nav-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
                <span className="landing-clipboard-nav-ping" />
              </div>
              <span className="landing-clipboard-nav-label">Clipboard</span>
            </button>
          )}

          {/* Progressive Blur Theme Toggle Button */}
          <ThemeToggleButton
            theme={theme}
            onToggleTheme={onToggleTheme}
            className="navbar-theme-toggle"
          />

          {/* Direct Return to Landing Page button */}
          {onBackToHome && (
            <button
              className="btn-icon nav-home-btn"
              onClick={onBackToHome}
              type="button"
              aria-label="Return to Landing Page"
              title="Return to Landing Page"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '6px 12px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                borderRadius: '8px',
                border: '1px solid var(--color-border-subtle)',
                background: 'var(--color-bg-surface)',
                cursor: 'pointer'
              }}
              id="navbar-btn-home"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>Home</span>
            </button>
          )}

          {onBackToAssignment && (
            <button
              className="btn-icon"
              onClick={onBackToAssignment}
              type="button"
              aria-label="Back to Assignment Specs"
              style={{ borderColor: 'var(--color-accent-border)', color: 'var(--color-accent-text)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>{track === 'genai' ? 'Gen AI Project' : 'Assignment'}</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
