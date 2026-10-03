import React from 'react';

export default function Hero() {
  const technologies = ['HTML5', 'CSS3', 'JavaScript'];

  return (
    <section className="hero" id="top">
      <div className="wrap">
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
