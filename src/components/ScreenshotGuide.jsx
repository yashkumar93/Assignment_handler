import React, { useState, useEffect } from 'react';
import { getGenAiProjectForStudent, GENAI_PROJECTS } from '../data/genAiProjects';
import { GENAI_SUBMISSION_FORM_URL } from '../data/classLinks';

const CATEGORY_COLORS = {
  'AI-Powered': { bg: 'rgba(139, 92, 246, 0.12)', border: 'rgba(139, 92, 246, 0.3)', text: '#A78BFA' },
  'Business & Commerce': { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.3)', text: '#34D399' },
  'Data & Dashboards': { bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.3)', text: '#60A5FA' },
  'Social & Community': { bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)', text: '#FBBF24' },
  'Student & Campus': { bg: 'rgba(236, 72, 153, 0.12)', border: 'rgba(236, 72, 153, 0.3)', text: '#F472B6' },
  'Creative & Interactive': { bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.3)', text: '#C084FC' },
};

export default function ScreenshotGuide({
  onBackToAssignment,
  studentName,
  track,
  initialTrack = 'assignment',
}) {
  const [activeTrack, setActiveTrack] = useState(() => (track || initialTrack || 'assignment'));
  const [showRosterPicker, setShowRosterPicker] = useState(false);
  const [rosterQuery, setRosterQuery] = useState('');
  const [selectedStudentOverride, setSelectedStudentOverride] = useState(null);
  const [copiedFormUrl, setCopiedFormUrl] = useState(false);

  useEffect(() => {
    const current = track || initialTrack;
    if (current) {
      setActiveTrack(current === 'genai' ? 'genai' : 'assignment');
    }
  }, [track, initialTrack]);

  const isGenAi = activeTrack === 'genai';

  // Resolve student and project allocation
  const currentLookupName = selectedStudentOverride || studentName;
  const matchedProject = getGenAiProjectForStudent(currentLookupName);

  const fallbackProject = {
    sno: 1,
    studentName: studentName?.trim() || 'Student',
    projectNo: 26,
    title: 'Real estate listing site',
    category: 'Business & Commerce',
    difficulty: 'Standard',
    description: 'A property listing site with price and area filters, saved favourites, and an inquiry form.',
    learningOutcomesList: [
      'Build filter and search logic',
      'Save user favourites in localStorage',
      'Handle inquiry form submissions & validation',
    ],
    mustHavesList: [
      'Property listings grid & detail preview',
      'Interactive filters (price, area, property type)',
      'Saved favourites / bookmarking',
      'Interactive inquiry form',
    ],
  };

  const project = isGenAi ? (matchedProject || fallbackProject) : null;
  const displayName = (isGenAi ? project?.studentName : studentName)?.trim() || 'Student';

  const formattedName = displayName.replace(/\s+/g, '_');
  const projectTitleSlug = (project?.title || 'GenAI_Project').replace(/[^a-zA-Z0-9]+/g, '_');

  const sampleFileName = isGenAi
    ? `${formattedName}_${projectTitleSlug}_FullPage.pdf`
    : `${formattedName}_Portfolio.pdf`;

  const categoryStyle = project && CATEGORY_COLORS[project.category]
    ? CATEGORY_COLORS[project.category]
    : { bg: 'rgba(139, 92, 246, 0.12)', border: 'rgba(139, 92, 246, 0.3)', text: '#A78BFA' };

  // Checklist state per track
  const storageKey = isGenAi ? 'niat_genai_pdf_checklist' : 'niat_pdf_checklist';

  const getInitialChecklist = (forGenAi) => {
    const key = forGenAi ? 'niat_genai_pdf_checklist' : 'niat_pdf_checklist';
    try {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    return forGenAi
      ? {
          pdfFormat: false,
          mustHavesVisible: false,
          sharp: false,
          complete: false,
          named: false,
        }
      : {
          pdfFormat: false,
          allSections: false,
          sharp: false,
          complete: false,
          named: false,
        };
  };

  const [checklist, setChecklist] = useState(() => getInitialChecklist(isGenAi));

  useEffect(() => {
    setChecklist(getInitialChecklist(isGenAi));
  }, [isGenAi]);

  const toggleCheck = (key) => {
    setChecklist((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (e) { }
      return updated;
    });
  };

  const handleResetChecklist = () => {
    const empty = isGenAi
      ? {
          pdfFormat: false,
          mustHavesVisible: false,
          sharp: false,
          complete: false,
          named: false,
        }
      : {
          pdfFormat: false,
          allSections: false,
          sharp: false,
          complete: false,
          named: false,
        };
    setChecklist(empty);
    try {
      localStorage.removeItem(storageKey);
    } catch (e) { }
  };

  const totalChecked = Object.values(checklist).filter(Boolean).length;
  const progressPercent = Math.round((totalChecked / 5) * 100);

  const flowSteps = isGenAi
    ? ['Install Extension', 'Populate Demo Data', 'Capture Full Page', 'Save as PDF', 'Upload to Form']
    : ['Install', 'Open your site', 'Capture', 'Save as PDF', 'Upload'];

  const submissionUrl = isGenAi
    ? GENAI_SUBMISSION_FORM_URL
    : 'https://forms.gle/1wHqKKibLkC69xBJ7';

  const copyFormLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(submissionUrl);
      setCopiedFormUrl(true);
      setTimeout(() => setCopiedFormUrl(false), 2000);
    }
  };

  const genAiChecklistItems = [
    {
      id: 'pdfFormat',
      label: 'Document is saved as a genuine PDF (.pdf) file, not a raw PNG or JPEG image',
    },
    {
      id: 'mustHavesVisible',
      label: `All ${project?.mustHavesList?.length || 4} assigned Must-Haves (${(project?.mustHavesList || []).slice(0, 2).join(', ')}...) are visible with active sample data`,
    },
    {
      id: 'sharp',
      label: 'All cards, UI text, prompt controls, and outputs are sharp and fully legible when zoomed in',
    },
    {
      id: 'complete',
      label: 'The entire application from navbar to footer is captured without cutoff components or blank patches',
    },
    {
      id: 'named',
      label: `File is named properly with student & project name (${sampleFileName})`,
    },
  ];

  const portfolioChecklistItems = [
    { id: 'pdfFormat', label: 'It opens as a PDF file, not an image file' },
    { id: 'allSections', label: 'All sections are there, top to bottom (nav, about, skills, projects, footer)' },
    { id: 'sharp', label: 'Text and images are sharp and readable when I zoom in' },
    { id: 'complete', label: 'Nothing is cut off or left blank' },
    { id: 'named', label: `The file name has my name in it (${sampleFileName})` },
  ];

  const activeChecklistItems = isGenAi ? genAiChecklistItems : portfolioChecklistItems;

  const filteredRoster = GENAI_PROJECTS.filter((p) => {
    const q = rosterQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.studentName.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="github-guide-page">
      <div className="wrap" style={{ paddingBlock: '2.5rem 5rem' }}>
        {/* Track Switcher Bar */}
        <div className="guide-track-switcher-wrap" style={{ marginBottom: '2rem' }}>
          <div className="guide-track-switcher">
            <button
              type="button"
              className={`guide-track-switcher-btn ${isGenAi ? 'active' : ''}`}
              onClick={() => setActiveTrack('genai')}
            >
              <span>Generative AI Project</span>
              {project && (
                <span className="guide-track-badge-mini">
                  #{project.projectNo}
                </span>
              )}
            </button>
            <button
              type="button"
              className={`guide-track-switcher-btn ${!isGenAi ? 'active' : ''}`}
              onClick={() => setActiveTrack('assignment')}
            >
              <span>HTML &amp; CSS Portfolio</span>
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="guide-hero">
          <div className="pill" style={{ marginBottom: '1rem', borderColor: isGenAi ? 'var(--color-accent-border)' : undefined }}>
            <span>{isGenAi ? 'Generative AI · Full-Page Screenshot (PDF) Guide' : 'Portfolio 101 · PDF Guide'}</span>
          </div>

          <h1 className="hero-title" style={{ marginBottom: '1rem' }}>
            {isGenAi ? (
              <>
                Turn your <span style={{ color: 'var(--color-accent-text)' }}>{project?.title}</span> into a PDF.
              </>
            ) : (
              'Turn your portfolio into a PDF.'
            )}
          </h1>

          <p className="hero-desc" style={{ maxWidth: '68ch', marginBottom: '2rem' }}>
            {isGenAi
              ? `Take a high-resolution, full-page screenshot of your live Generative AI application using the free GoFullPage Chrome extension, save it as a PDF, and upload it to the official assessment form. It takes under 3 minutes.`
              : 'Take a full page screenshot of your live website with a free Chrome extension, save it as a PDF, and upload it to the Google Form. It takes about 3 minutes.'}
          </p>

          {/* Personalized Gen AI Project Banner Card */}
          {isGenAi && project && (
            <div className="genai-guide-project-badge-card" style={{ marginBottom: '2.5rem' }}>
              <div className="genai-guide-badge-top">
                <span
                  className="genai-category-badge"
                  style={{
                    backgroundColor: categoryStyle.bg,
                    borderColor: categoryStyle.border,
                    color: categoryStyle.text,
                  }}
                >
                  <span>{project.category}</span>
                </span>
                <span className="genai-project-id-pill">
                  Project #{project.projectNo}
                </span>
                <span className="genai-roll-pill">
                  Student #{project.sno} of 48
                </span>

                <button
                  type="button"
                  className="genai-guide-roster-btn"
                  onClick={() => setShowRosterPicker(true)}
                  title="Switch to another student project"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <span>Switch Project ({displayName})</span>
                </button>
              </div>

              <div className="genai-guide-badge-body">
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                  Allocated to <strong style={{ color: 'var(--color-text-primary)' }}>{project.studentName}</strong>
                </div>
                <h3 className="genai-guide-assigned-title">{project.title}</h3>
                <p className="genai-guide-assigned-desc">{project.description}</p>

                <div className="genai-guide-meta-grid">
                  <div className="genai-guide-meta-item">
                    <span className="genai-guide-meta-label">Must-Haves to Showcase in PDF:</span>
                    <strong className="genai-guide-meta-value" style={{ color: 'var(--color-accent-text)' }}>
                      {project.mustHavesList.join(' • ')}
                    </strong>
                  </div>
                  <div className="genai-guide-meta-item">
                    <span className="genai-guide-meta-label">Recommended PDF File Name:</span>
                    <code className="code-pill" style={{ fontWeight: 700 }}>{sampleFileName}</code>
                  </div>
                </div>
              </div>
            </div>
          )}

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
            Confirm these key requirements before capturing:
          </p>

          <div className="before-start-checks">
            <div className="before-start-check-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>I'm on a <strong>laptop or desktop computer</strong> with <strong>Google Chrome</strong>. (Full-page extensions require desktop Chrome).</span>
            </div>
            <div className="before-start-check-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>My {isGenAi ? 'Generative AI project' : 'portfolio'} is <strong>live</strong> and opens cleanly from its public URL.</span>
            </div>
            <div className="before-start-check-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>
                {isGenAi
                  ? 'I have populated realistic sample data (e.g. search filters applied, items showing, inquiry forms filled) so evaluators see all Must-Haves active.'
                  : "I've verified every section looks right. Fix any layout or image issues first, then capture."}
              </span>
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
                <h3>{isGenAi ? 'Open your live site & populate sample data' : 'Open your live portfolio'}</h3>
                <p>
                  {isGenAi ? (
                    <>
                      Go to your live deployment URL in a new tab. Maximise the browser window to full desktop resolution.
                    </>
                  ) : (
                    <>
                      Go to your portfolio link in a new tab. Maximise the browser window so the page loads in its full desktop layout.
                    </>
                  )}
                </p>
                <div className="tip-callout" style={{ marginTop: '0.75rem' }}>
                  <div>
                    <strong>Pro tip:</strong>{' '}
                    {isGenAi
                      ? 'Interact with your app before capturing! Apply a filter, type an inquiry, or trigger sample cards. Evaluators want to see your Must-Haves populated and working in the PDF.'
                      : 'Scroll to the bottom and back to the top once before capturing. This triggers any lazy-loaded images or animations that only appear while scrolling.'}
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
                  Click the camera icon in your Chrome toolbar, or use the keyboard shortcut:
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
                  The page scrolls automatically while capturing. Do not touch your mouse or keyboard until it completes.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="step-card">
              <div className="step-badge">5</div>
              <div className="step-body">
                <h3>Inspect the screenshot</h3>
                <p>
                  A new tab opens with your full-page preview. Scroll through it carefully:
                  {isGenAi ? (
                    <>
                      {' '}Verify that your header, filters, listings, dynamic content, and footer are fully captured without cutoff components.
                    </>
                  ) : (
                    <>
                      {' '}Every section from the navbar to the footer should be visible and complete.
                    </>
                  )}
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
                  <em>Fallback note:</em> If you only see PNG, download that image, open it in Chrome, press <kbd className="kbd-chip">Ctrl</kbd> + <kbd className="kbd-chip">P</kbd> (<kbd className="kbd-chip">Cmd</kbd> + <kbd className="kbd-chip">P</kbd> on Mac), and set the destination to <strong>Save as PDF</strong>.
                </p>
              </div>
            </div>

            {/* Step 7 */}
            <div className="step-card">
              <div className="step-badge">7</div>
              <div className="step-body">
                <h3>Name the file properly</h3>
                <p>
                  Rename your exported document using this standard convention:{' '}
                  <code className="code-pill">
                    {isGenAi ? 'YourName_ProjectTitle_FullPage.pdf' : 'YourName_Portfolio.pdf'}
                  </code>.
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
                <h3>Upload to the Official Submission Form</h3>
                <p>
                  {isGenAi ? (
                    <>
                      Open the official <strong>Generative AI Assessment Form</strong>, upload your exported PDF document, and paste your public GitHub repository URL and live deployment link.
                    </>
                  ) : (
                    <>
                      Open the official submission form, select your exported PDF file, and provide your live URL and public GitHub link. Submit before the deadline and keep your confirmation screenshot.
                    </>
                  )}
                </p>
                <div style={{ marginTop: '0.875rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <a
                    href={submissionUrl}
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

                  {isGenAi && (
                    <button
                      type="button"
                      onClick={copyFormLink}
                      className="btn btn-secondary btn-sm"
                    >
                      {copiedFormUrl ? 'Form URL Copied' : 'Copy Form URL'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Check your PDF (Interactive Checklist) */}
        <section className="guide-card" style={{ marginBottom: '2.5rem' }}>
          <div className="guide-card-header">
            <span className="card-num" style={{ fontSize: '0.75rem', width: '24px', height: '24px' }}>2</span>
            <h3>{isGenAi ? 'Gen AI PDF Quality Checklist' : 'Check your PDF'}</h3>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            Verify each requirement before submitting to ensure your submission passes all visual evaluation criteria:
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
              <div>
                <strong>PDF is ready for submission</strong>
                <span>
                  {isGenAi
                    ? `All 5 quality checks verified. Your ${project?.title} full-page capture is complete, sharp, and properly formatted for evaluation.`
                    : 'All 5 quality checks verified. Your document is clean, readable, and properly named.'}
                </span>
              </div>
            </div>
          )}

          <div className="checklist-container">
            {activeChecklistItems.map((item) => (
              <label key={item.id} className={`checklist-item ${checklist[item.id] ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  checked={checklist[item.id] || false}
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
            Quick solutions to the most common capture problems encountered.
          </p>

          <div className="faq-grid">
            <div className="faq-card">
              <h4>Parts of my page or dynamic cards are blank</h4>
              <p>
                Those elements didn't finish loading before capture started. Scroll through the entire page slowly from top to bottom, ensure sample data is populated, then trigger GoFullPage again.
              </p>
            </div>

            <div className="faq-card">
              <h4>The screenshot looks like a narrow mobile layout</h4>
              <p>
                Your browser window was too small. Maximise Google Chrome on your desktop or zoom out (<kbd className="kbd-chip">Ctrl</kbd> + <kbd className="kbd-chip">-</kbd>) before capturing.
              </p>
            </div>

            {isGenAi ? (
              <div className="faq-card">
                <h4>Where do I submit the PDF document?</h4>
                <p>
                  Upload your exported PDF into the official <strong>Gen AI Assessment Google Form</strong> ({GENAI_SUBMISSION_FORM_URL}) along with your live URL and public GitHub link.
                </p>
              </div>
            ) : null}

            <div className="faq-card" style={{ gridColumn: isGenAi ? undefined : '1 / -1' }}>
              <h4>The PDF file is too large to upload</h4>
              <p>
                If your PDF exceeds the form upload limit, compress it using a free online tool like{' '}
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
            <div>
              <strong>Questions or blockers?</strong> Reach out to your instructors in the course chat before the submission deadline.
            </div>
          </div>
        </section>

        {/* Bottom Return Action */}
        {onBackToAssignment && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onBackToAssignment}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back to {isGenAi ? 'Gen AI Assignment Project' : 'Portfolio Assignment'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Roster Project Switcher Modal */}
      {showRosterPicker && (
        <div
          className="genai-roster-modal-overlay"
          onClick={() => setShowRosterPicker(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="roster-modal-title"
        >
          <div
            className="genai-roster-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '640px' }}
          >
            <div className="genai-roster-modal-header">
              <div>
                <h3 id="roster-modal-title" style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                  Preview PDF Guide For Another Project
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Select any student to see how this PDF guide customizes to their allocated deliverables.
                </p>
              </div>
              <button
                type="button"
                className="genai-roster-close-btn"
                onClick={() => setShowRosterPicker(false)}
                aria-label="Close project picker"
              >
                Close
              </button>
            </div>

            <div className="genai-roster-search-bar" style={{ margin: '1rem 0' }}>
              <input
                type="text"
                placeholder="Search by student name, project title, or category..."
                value={rosterQuery}
                onChange={(e) => setRosterQuery(e.target.value)}
                className="genai-roster-search-input"
                autoFocus
              />
            </div>

            <div className="genai-roster-list" style={{ maxHeight: '380px', overflowY: 'auto' }}>
              {filteredRoster.map((item) => (
                <button
                  key={item.sno}
                  type="button"
                  className={`genai-roster-item ${displayName === item.studentName ? 'is-active' : ''}`}
                  onClick={() => {
                    setSelectedStudentOverride(item.studentName);
                    setShowRosterPicker(false);
                    setRosterQuery('');
                  }}
                >
                  <div className="genai-roster-avatar">
                    {item.studentName.charAt(0).toUpperCase()}
                  </div>
                  <div className="genai-roster-details" style={{ textAlign: 'start' }}>
                    <span className="genai-roster-name">{item.studentName}</span>
                    <span className="genai-roster-title">
                      Project #{item.projectNo}: {item.title}
                    </span>
                  </div>
                  <span className="genai-roster-cat-pill">
                    {item.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
