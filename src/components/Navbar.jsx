import React from 'react';
import BrandLogo from './BrandLogo';
import { ProgressiveBlur } from './ui/skiper-ui/skiper41';
import { ThemeToggleButton } from './ui/skiper-ui/skiper26';

export default function Navbar({ onBackToHome, onBackToAssignment, view, track, studentName, theme, onToggleTheme }) {
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

          {/* Progressive Blur Theme Toggle Button */}
          <ThemeToggleButton
            theme={theme}
            onToggleTheme={onToggleTheme}
            className="navbar-theme-toggle"
          />

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
