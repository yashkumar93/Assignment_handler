import React, { useState } from 'react';

export default function ScreenshotGuide({ onBackToAssignment, studentName }) {
  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem('niat_pdf_checklist');
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    return {
      pdfFormat: false,
      allSections: false,
      sharp: false,
      complete: false,
      named: false,
    };
  });

  const toggleCheck = (key) => {
    setChecklist((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem('niat_pdf_checklist', JSON.stringify(updated));
      } catch (e) { }
      return updated;
    });
  };

  const handleResetChecklist = () => {
    const empty = {
      pdfFormat: false,
      allSections: false,
      sharp: false,
      complete: false,
      named: false,
    };
    setChecklist(empty);
    try {
      localStorage.removeItem('niat_pdf_checklist');
    } catch (e) { }
  };

  const totalChecked = Object.values(checklist).filter(Boolean).length;
  const progressPercent = Math.round((totalChecked / 5) * 100);

  const formattedName = studentName ? studentName.trim().replace(/\s+/g, '_') : 'YourName';
  const sampleFileName = studentName ? `${formattedName}_Portfolio.pdf` : 'Riya_Sharma_Portfolio.pdf';

  const flowSteps = ['Install', 'Open your site', 'Capture', 'Save as PDF', 'Upload'];

  return (
    <div className="github-guide-page">
      <div className="wrap" style={{ paddingBlock: '3rem 5rem' }}>
        {/* Title Section */}
        <div className="guide-hero">
          <div className="pill" style={{ marginBottom: '1rem' }}>
            <span>Portfolio 101 · PDF Guide</span>
          </div>
          <h1 className="hero-title" style={{ marginBottom: '1rem' }}>
            Turn your portfolio into a PDF.
          </h1>
          <p className="hero-desc" style={{ maxWidth: '68ch', marginBottom: '2rem' }}>
            Take a full page screenshot of your live website with a free Chrome extension, save it as a PDF, and upload it to the Google Form. It takes about 3 minutes.
          </p>

          {/* Quick Action Button & Flow Badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
            <div>
              <a
                href="https://chromewebstore.google.com/detail/gofullpage-full-page-scre/fdpohaocaechififmbbbbbknoalclacl?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ minHeight: '44px', paddingInline: '20px', display: 'inline-flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}
              >
                <span>Get GoFullPage Extension</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>

            {/* Workflow Step Indicator */}
            <div className="guide-flow-bar" aria-label="Process steps">
              {flowSteps.map((step, idx) => (
                <React.Fragment key={step}>
                  <span className="guide-flow-step">{step}</span>
                  {idx < flowSteps.length - 1 && (
                    <span className="guide-flow-arrow" aria-hidden="true">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Section 0: Before you start */}
        <section className="guide-card" style={{ marginBottom: '2.5rem' }}>
          <div className="guide-card-header">
            <span className="card-num" style={{ fontSize: '0.75rem', width: '24px', height: '24px' }}>0</span>
            <h3>Before you start</h3>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
            Confirm these three requirements before starting the capture:
          </p>

          <div className="before-start-checks">
            <div className="before-start-check-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>I'm on a <strong>laptop or desktop</strong> with <strong>Google Chrome</strong>. (The extension doesn't work on mobile phones).</span>
            </div>
            <div className="before-start-check-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>My portfolio is <strong>live</strong> and opens cleanly from its URL.</span>
            </div>
            <div className="before-start-check-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>I've verified every section looks right. Fix any layout or image issues first, then capture.</span>
            </div>
          </div>
        </section>

        {/* Section 1: Step by step */}
        <section className="guide-card" style={{ marginBottom: '2.5rem' }}>
          <div className="guide-card-header">
            <span className="card-num" style={{ fontSize: '0.75rem', width: '24px', height: '24px' }}>1</span>
            <h3>Step by step</h3>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            Follow these in order from Step 1 to Step 8.
          </p>

          <div className="path-steps-list">
            {/* Step 1 */}
            <div className="step-card">
              <div className="step-badge">1</div>
              <div className="step-body">
                <h3>Install GoFullPage</h3>
                <p>
                  Open the{' '}
                  <a
                    href="https://chromewebstore.google.com/detail/gofullpage-full-page-scre/fdpohaocaechififmbbbbbknoalclacl?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--color-accent-text)', textDecoration: 'underline', fontWeight: 500 }}
                  >
                    GoFullPage page on the Chrome Web Store
                  </a>{' '}
                  and click <strong>Add to Chrome</strong>. Confirm by clicking <strong>Add extension</strong>.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="step-card">
              <div className="step-badge">2</div>
              <div className="step-body">
                <h3>Pin it to your toolbar</h3>
                <p>
                  Click the puzzle-piece icon at the top right of Chrome, then click the pin icon next to GoFullPage. Now the camera icon stays visible in your toolbar.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="step-card">
              <div className="step-badge">3</div>
              <div className="step-body">
                <h3>Open your live portfolio</h3>
                <p>
                  Go to your portfolio link in a new tab. Maximise the browser window so the page loads in its full desktop layout.
                </p>
                <div className="tip-callout" style={{ marginTop: '0.75rem' }}>
                  <span style={{ fontSize: '1rem' }}>💡</span>
                  <div>
                    <strong>Pro tip:</strong> Scroll to the bottom and back to the top once before capturing. This triggers any lazy-loaded images or animations that only appear while scrolling.
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="step-card">
              <div className="step-badge">4</div>
              <div className="step-body">
                <h3>Click the GoFullPage icon</h3>
                <p>
                  Click the camera icon in the toolbar, or use the keyboard shortcut:
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBlock: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Windows:</span>
                    <kbd className="kbd-chip">Alt</kbd> + <kbd className="kbd-chip">Shift</kbd> + <kbd className="kbd-chip">P</kbd>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Mac:</span>
                    <kbd className="kbd-chip">Option</kbd> + <kbd className="kbd-chip">Shift</kbd> + <kbd className="kbd-chip">P</kbd>
                  </div>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)' }}>
                  The page scrolls by itself while it captures. Don't touch your mouse or keyboard until it finishes.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="step-card">
              <div className="step-badge">5</div>
              <div className="step-body">
                <h3>Check the screenshot</h3>
                <p>
                  A new tab opens with your full-page screenshot. Scroll through it. Every section from the navbar to the footer should be visible and complete.
                </p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="step-card">
              <div className="step-badge">6</div>
              <div className="step-body">
                <h3>Save it as a PDF</h3>
                <p>
                  Click the <strong>Download</strong> button at the top right of the GoFullPage viewer and choose <strong>PDF</strong>.
                </p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  <em>Fallback note:</em> If you only see PNG, download that image, open the image file in Chrome, press <kbd className="kbd-chip">Ctrl</kbd> + <kbd className="kbd-chip">P</kbd> (<kbd className="kbd-chip">Cmd</kbd> + <kbd className="kbd-chip">P</kbd> on Mac), and set the destination printer to <strong>Save as PDF</strong>.
                </p>
              </div>
            </div>

            {/* Step 7 */}
            <div className="step-card">
              <div className="step-badge">7</div>
              <div className="step-body">
                <h3>Name the file properly</h3>
                <p>
                  Rename your exported file using this format: <code className="code-pill">YourName_Portfolio.pdf</code>.
                </p>
                <div style={{ marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Your file name: </span>
                  <code className="code-pill" style={{ fontWeight: 600 }}>{sampleFileName}</code>
                </div>
              </div>
            </div>

            {/* Step 8 */}
            <div className="step-card">
              <div className="step-badge">8</div>
              <div className="step-body">
                <h3>Upload to the Google Form</h3>
                <p>
                  Open the official submission form, select your exported PDF file, and provide your live URL and public GitHub link. Submit before the deadline and keep your confirmation screenshot.
                </p>
                <div style={{ marginTop: '0.875rem' }}>
                  <a
                    href="https://forms.gle/1wHqKKibLkC69xBJ7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Open Submission Form</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Check your PDF (Interactive Checklist) */}
        <section className="guide-card" style={{ marginBottom: '2.5rem' }}>
          <div className="guide-card-header">
            <span className="card-num" style={{ fontSize: '0.75rem', width: '24px', height: '24px' }}>2</span>
            <h3>Check your PDF</h3>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            Check each box before uploading your document to guarantee full marks:
          </p>

          {/* Progress Tracker */}
          <div className="checklist-progress-wrapper">
            <div className="checklist-progress-header">
              <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {totalChecked} of 5 items verified ({progressPercent}%)
              </span>
              {totalChecked > 0 && (
                <button
                  type="button"
                  onClick={handleResetChecklist}
                  className="checklist-reset-btn"
                  title="Reset all checklist items"
                >
                  Reset checklist
                </button>
              )}
            </div>
            <div className="checklist-progress-track">
              <div
                className={`checklist-progress-bar ${totalChecked === 5 ? 'complete' : ''}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Celebration Banner */}
          {totalChecked === 5 && (
            <div className="checklist-celebration-banner">
              <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>🎉</span>
              <div>
                <strong>PDF is ready for submission!</strong>
                <span>All 5 quality checks verified. Your document is clean, readable, and properly named.</span>
              </div>
            </div>
          )}

          <div className="checklist-container">
            {[
              { id: 'pdfFormat', label: 'It opens as a PDF file, not an image file' },
              { id: 'allSections', label: 'All sections are there, top to bottom (nav, about, skills, projects, footer)' },
              { id: 'sharp', label: 'Text and images are sharp and readable when I zoom in' },
              { id: 'complete', label: 'Nothing is cut off or left blank' },
              { id: 'named', label: `The file name has my name in it (${sampleFileName})` },
            ].map((item) => (
              <label key={item.id} className={`checklist-item ${checklist[item.id] ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  checked={checklist[item.id]}
                  onChange={() => toggleCheck(item.id)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--color-accent-text)', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.9375rem', color: checklist[item.id] ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', fontWeight: checklist[item.id] ? 600 : 400 }}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* Section 3: If something goes wrong (FAQ / Troubleshooting) */}
        <section className="guide-card" style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>If something goes wrong</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            Quick solutions to the most common capture problems students encounter.
          </p>

          <div className="faq-grid">
            <div className="faq-card">
              <h4>Parts of my page are blank</h4>
              <p>
                Those sections didn't load yet. Scroll through the whole page slowly from top to bottom, then capture again.
              </p>
            </div>


            <div className="faq-card">
              <h4>The screenshot looks like a mobile layout</h4>
              <p>
                Your window was too narrow. Maximise Chrome or zoom out with <kbd className="kbd-chip">Ctrl</kbd> + <kbd className="kbd-chip">-</kbd>, then capture again.
              </p>
            </div>



            <div className="faq-card" style={{ gridColumn: '1 / -1' }}>
              <h4>The PDF is too large to upload</h4>
              <p>
                Try capturing again with the window slightly smaller. You can also compress the PDF with a free tool like{' '}
                <a
                  href="https://www.ilovepdf.com/compress_pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--color-accent-text)', textDecoration: 'underline' }}
                >
                  iLovePDF (Compress PDF)
                </a>.
              </p>
            </div>
          </div>

          <div className="instructor-callout" style={{ marginTop: '2rem' }}>
            <span style={{ fontSize: '1.25rem' }}>💬</span>
            <div>
              <strong>Stuck?</strong> Ask your instructor before the deadline.
            </div>
          </div>
        </section>

        {/* Bottom Return Action */}

      </div>
    </div>
  );
}
