import React from 'react';

export default function Hero({ onBackToHome, onBackToAssessments, studentName }) {
  const technologies = ['HTML5', 'CSS3', 'JavaScript'];

  return (
    <section className="hero" id="top">
      <div className="wrap">
        {/* Top Assessment Navigation Bar */}
        <div className="hero-top-nav-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBlockEnd: '1.25rem' }}>
          {onBackToAssessments && (
            <button
              type="button"
              onClick={onBackToAssessments}
              className="btn-icon hero-back-btn"
              aria-label="Back to Assessments"
              title="Choose another assessment"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '6px 14px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                borderRadius: '8px',
                border: '1px solid var(--color-border-subtle)',
                background: 'var(--color-bg-surface)',
                cursor: 'pointer',
                transition: 'all 140ms ease'
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back to Assessments</span>
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="pill" style={{ fontSize: '0.75rem', padding: '3px 10px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', borderColor: 'rgba(37, 99, 235, 0.25)', fontWeight: 600 }}>
              Assessment 01 of 04
            </span>
          </div>
        </div>

        <div className="pill" style={{ marginBlockEnd: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>HTML & CSS Track</span>
          {studentName && (
            <>
              <span style={{ opacity: 0.5 }}>·</span>
              <span style={{ color: 'var(--color-accent-text)', fontWeight: 600 }}>{studentName}</span>
            </>
          )}
        </div>
        <h1 className="hero-title">HTML & CSS Portfolio Assignment</h1>
        <p className="hero-desc">
          The portfolio must be a single-page website built with HTML and CSS. Follow the required structure in this exact order.
        </p>

        <div className="hero-tech-card">
          <div className="hero-tech-title">Technology Restrictions</div>
          <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', marginBlockEnd: '0.75rem' }}>
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
