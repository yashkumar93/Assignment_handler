import React from 'react';
import BrandLogo from './BrandLogo';
import { ProgressiveBlur } from './ui/skiper-ui/skiper41';
import { ThemeToggleButton } from './ui/skiper-ui/skiper26';

export default function Navbar({ onBackToHome, onBackToAssignment, view, studentName, theme, onToggleTheme }) {
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
          aria-label="HTML & CSS Portfolio Assignment"
        >
          <BrandLogo size={26} />
          <span style={{ fontWeight: 700 }}>HTML & CSS</span>
          <span className="pill" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
            {view === 'github-guide' ? 'Portfolio 101' : view === 'pdf-guide' ? 'PDF Guide' : 'Portfolio Track'}
          </span>
        </a>

        <div className="nav-actions">
          {studentName && (
            <div className="nav-student-pill" title={`Student: ${studentName}`}>
              <span className="nav-student-dot" aria-hidden="true" />
              <span className="nav-student-name">{studentName}</span>
            </div>
          )}

          {/* Progressive Blur Theme Toggle Button */}
          <ThemeToggleButton
            theme={theme}
            onToggleTheme={onToggleTheme}
            className="navbar-theme-toggle"
          />

          {onBackToAssignment ? (
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
              <span>Assignment</span>
            </button>
          ) : onBackToHome && (
            <button
              className="btn-icon"
              onClick={onBackToHome}
              type="button"
              aria-label="Back to Tracks Landing Page"
              style={{ borderColor: 'var(--color-accent-border)', color: 'var(--color-accent-text)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Tracks</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
