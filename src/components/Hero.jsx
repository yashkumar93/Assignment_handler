import React from 'react';

export default function Hero({ onBackToHome, studentName }) {
  const technologies = ['HTML5', 'CSS3', 'JavaScript'];

  return (
    <section className="hero" id="top">
      <div className="wrap">
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
