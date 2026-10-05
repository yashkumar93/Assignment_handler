import React from 'react';

export default function RequirementsSection({ onOpenGithubGuide, onOpenPdfGuide, studentName }) {
  const slug = studentName
    ? studentName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : 'student-name';

  return (
    <section id="requirements">
      <div className="wrap">
        <div className="section-header">
          <h2>Mandatory Submission Requirements</h2>
          <p>Every student must complete all three requirements to submit their portfolio assignment.</p>
        </div>

        <div className="req-grid">
          {/* Deployment Requirement */}
          <div className="req-card" id="deployment">
            <h3>Deployment Requirement</h3>
            <p>
              This is another requirement I'd make mandatory. Every student must deploy their portfolio on the niat.tech platform/domain taught in your course.
            </p>

            <div className="req-sub-box">
              <strong>They must submit:</strong>
              <span>Live Portfolio URL</span>
              <div style={{ marginTop: '0.5rem' }}>
                <code>https://yassh.niat.tech/</code>
              </div>
            </div>

            {/* Reference Material Link */}
            <div
              className="req-reference-box"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
                padding: '0.875rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-accent-subtle)',
                border: '1px solid var(--color-accent-border)',
                marginBlockStart: 'auto',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', minWidth: 0, flex: '1 1 200px' }}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-accent-text)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0 }}
                  aria-hidden="true"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    Reference Material
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                    Deployment instructions and walkthrough guide
                  </div>
                </div>
              </div>

              <a
                href="https://drive.google.com/file/d/1OMf-oKbmzHiXzJiowW4vrHyRUF6Ts37j/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
                style={{
                  borderColor: 'var(--color-accent-border)',
                  color: 'var(--color-accent-text)',
                  backgroundColor: 'var(--color-bg-surface)',
                  textDecoration: 'none',
                  flexShrink: 0,
                }}
              >
                <span>View Reference</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>
          </div>

          {/* GitHub Requirement */}
          <div className="req-card" id="github">
            <h3>GitHub Requirement</h3>
            <p>Every student must push their complete source code to GitHub.</p>

            <div className="req-sub-box">
              <strong>{studentName ? `${studentName} must submit:` : 'The student must submit:'}</strong>
              <span>GitHub Repository URL (make sure it should be public)</span>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              The repository should contain the actual code used for their deployed website.
            </p>

            {/* Portfolio 101 Helping Guide Box */}
            <div
              className="req-reference-box"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
                padding: '0.875rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-accent-subtle)',
                border: '1px solid var(--color-accent-border)',
                marginBlockStart: 'auto',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', minWidth: 0, flex: '1 1 200px' }}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-accent-text)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0 }}
                  aria-hidden="true"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    Portfolio 101: GitHub Guide
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                    Complete step-by-step walkthrough to put your code on GitHub
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenGithubGuide}
                className="btn btn-primary btn-sm"
                style={{ flexShrink: 0 }}
              >
                <span>Open Guide</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          {/* Full-Page Screenshot PDF Requirement */}
          <div className="req-card" id="screenshot-pdf">
            <h3>Full-Page Screenshot (PDF) Requirement</h3>
            <p>
              Every student must capture a complete full-page screenshot of their deployed portfolio website and export it in PDF format.
            </p>

            <div className="req-sub-box">
              <strong>{studentName ? `${studentName} must submit:` : 'The student must submit:'}</strong>
              <span>Full-Page Portfolio PDF file (uploaded in the submission form)</span>
              <div style={{ marginTop: '0.5rem' }}>

                <code>Yash_portfolio.pdf</code>
              </div>
            </div>

            {/* Helping Guide Box */}
            <div
              className="req-reference-box"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
                padding: '0.875rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-accent-subtle)',
                border: '1px solid var(--color-accent-border)',
                marginBlockStart: 'auto',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', minWidth: 0, flex: '1 1 200px' }}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-accent-text)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0 }}
                  aria-hidden="true"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <circle cx="10" cy="9" r="1.5"></circle>
                </svg>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    Screenshot & PDF Guide
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                    How to capture your full page and export as a PDF
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenPdfGuide}
                className="btn btn-primary btn-sm"
                style={{ flexShrink: 0 }}
              >
                <span>Open Guide</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
