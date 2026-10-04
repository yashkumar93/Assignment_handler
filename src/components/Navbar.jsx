import React, { useState } from 'react';

export default function Navbar({ theme, onToggleTheme, onBackToHome }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Education', href: '#education' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
    { label: 'Deployment', href: '#deployment' },
    { label: 'GitHub', href: '#github' },
    { label: 'Rubric', href: '#rubric' },
    { label: 'Submit Form', href: '#submission-form' },
  ];

  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <div className="wrap">
        <a
          className="nav-brand"
          href="#top"
          onClick={(e) => {
            if (onBackToHome) {
              e.preventDefault();
              onBackToHome();
            }
          }}
          aria-label="Portfolio Assignment Home or Back to Tracks"
        >
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>Student Name / Logo</span>
        </a>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`} id="navLinks" role="list">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="nav-actions">
          {onBackToHome && (
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

          {/* Dark Mode / Light Mode toggle */}
          <button
            className="btn-icon"
            onClick={onToggleTheme}
            type="button"
            aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button
            className="nav-burger"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
