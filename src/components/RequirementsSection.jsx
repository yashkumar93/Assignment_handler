import React from 'react';

export default function RequirementsSection() {
  return (
    <section id="requirements">
      <div className="wrap">
        <div className="section-header">
          <h2>Mandatory Submission Requirements</h2>
          <p>Every student must complete both requirements to submit their portfolio assignment.</p>
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
                <span>For example: </span>
                <code>https://student-name....niat.tech</code>
              </div>
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-tertiary)' }}>
              Link , how to do it - Use the exact niat.Tech deployment URL/domain provided in your course, rather than letting students deploy wherever they want.
            </p>
          </div>

          {/* GitHub Requirement */}
          <div className="req-card" id="github">
            <h3>GitHub Requirement</h3>
            <p>Every student must push their complete source code to GitHub.</p>

            <div className="req-sub-box">
              <strong>The student must submit:</strong>
              <span>GitHub Repository URL (make sure it should be public)</span>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              The repository should contain the actual code used for their deployed website.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
