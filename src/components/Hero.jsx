import React from 'react';

export default function Hero({ onBackToHome }) {
  const technologies = ['HTML5', 'CSS3', 'JavaScript'];

  return (
    <section className="hero" id="top">
      <div className="wrap">
        {onBackToHome && (
          <div style={{ marginBottom: '1.25rem' }}>
            <button
              onClick={onBackToHome}
              className="btn btn-outline"
              style={{ fontSize: '0.8125rem', padding: '6px 14px' }}
              aria-label="Back to track selection"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to Track Selection
            </button>
          </div>
        )}

        <h1 className="hero-title">Assignment Structure</h1>
        <p className="hero-desc">
          The portfolio must be a single-page website. Follow the required structure in this exact order.
        </p>

        <div className="hero-tech-card">
          <div className="hero-tech-title">Technology Restrictions</div>
          <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
            Students must use only:
          </p>
          <div className="hero-tech-badges">
            {technologies.map((tech) => (
              <span key={tech} className="tech-pill">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
