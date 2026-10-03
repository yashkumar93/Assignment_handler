import React from 'react';

export default function Footer({ theme, onToggleTheme }) {
  return (
    <footer className="footer" id="contact">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <h4>Student Name</h4>
            <p>
              Portfolio Assignment website for first-semester NIAT students. Built with HTML5, CSS3, and JavaScript.
            </p>
          </div>

          <div className="footer-links-col">
            <div className="footer-col-title">Footer Links</div>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="mailto:student@niat.tech">
              Contact Information
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>Copyright &copy; 2026 Student Name / NIAT. All rights reserved.</span>

          {/* Dark Mode toggle in footer */}
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
        </div>
      </div>
    </footer>
  );
}
