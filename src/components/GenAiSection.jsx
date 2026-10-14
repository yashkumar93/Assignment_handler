import React, { useState, useEffect } from 'react';
import { GENAI_PROJECTS, getGenAiProjectForStudent, ALL_STUDENT_NAMES } from '../data/genAiProjects';

const CATEGORY_COLORS = {
  'AI-Powered': { bg: 'rgba(139, 92, 246, 0.12)', border: 'rgba(139, 92, 246, 0.3)', text: '#A78BFA', icon: '🤖' },
  'Business & Commerce': { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.3)', text: '#34D399', icon: '💼' },
  'Data & Dashboards': { bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.3)', text: '#60A5FA', icon: '📊' },
  'Social & Community': { bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)', text: '#FBBF24', icon: '🤝' },
  'Student & Campus': { bg: 'rgba(236, 72, 153, 0.12)', border: 'rgba(236, 72, 153, 0.3)', text: '#F472B6', icon: '🎓' },
  'Creative & Interactive': { bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.3)', text: '#C084FC', icon: '🎨' },
};

export const GENAI_SUBMISSION_FORM_URL = 'https://forms.gle/4u63uAuy5ygU3q9b9';

export default function GenAiSection({
  studentName,
  onBackToHome,
  onUpdateStudentName,
  onOpenGithubGuide,
  onOpenPdfGuide,
}) {
  const [showRosterModal, setShowRosterModal] = useState(false);
  const [rosterSearch, setRosterSearch] = useState('');
  const [copiedFormLink, setCopiedFormLink] = useState(false);

  // Find project based on studentName
  const project = getGenAiProjectForStudent(studentName);

  const studentSlug = (studentName || 'student')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const handleCopyFormLink = async () => {
    try {
      await navigator.clipboard.writeText(GENAI_SUBMISSION_FORM_URL);
      setCopiedFormLink(true);
      setTimeout(() => setCopiedFormLink(false), 2500);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = GENAI_SUBMISSION_FORM_URL;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedFormLink(true);
      setTimeout(() => setCopiedFormLink(false), 2500);
    }
  };

  // Completed checklist items state persisted in localStorage
  const storageKey = project ? `niat_genai_checklist_${project.sno}` : null;
  const [checkedFeatures, setCheckedFeatures] = useState(() => {
    if (!storageKey || typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (storageKey && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        setCheckedFeatures(saved ? JSON.parse(saved) : {});
      } catch {
        setCheckedFeatures({});
      }
    }
  }, [storageKey]);

  const toggleFeature = (index) => {
    const updated = { ...checkedFeatures, [index]: !checkedFeatures[index] };
    setCheckedFeatures(updated);
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch { }
    }
  };

  const handleSelectDifferentStudent = (newName) => {
    if (onUpdateStudentName) {
      onUpdateStudentName(newName);
    }
    setShowRosterModal(false);
    setRosterSearch('');
  };

  const categoryStyle = project && CATEGORY_COLORS[project.category]
    ? CATEGORY_COLORS[project.category]
    : { bg: 'var(--color-accent-subtle)', border: 'var(--color-accent-border)', text: 'var(--color-accent-text)', icon: '✨' };

  // Checklist completion stats
  const mustHavesList = project ? project.mustHavesList : [];
  const completedCount = mustHavesList.filter((_, idx) => !!checkedFeatures[idx]).length;
  const progressPercent = mustHavesList.length > 0
    ? Math.round((completedCount / mustHavesList.length) * 100)
    : 0;

  // Filtered roster for student switcher modal
  const filteredRoster = GENAI_PROJECTS.filter((p) => {
    const q = rosterSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      p.studentName.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="genai-page-wrapper">
      <div className="wrap">
        {/* Top Navigation & Student Context Bar */}
        <div className="genai-header-bar">
          <button
            type="button"
            onClick={onBackToHome}
            className="btn-icon genai-back-btn"
            aria-label="Back to Tracks"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back to Tracks</span>
          </button>

          <div className="genai-header-pills">
            <div className="genai-track-pill">
              <span className="genai-pill-dot" />
              <span>Generative AI Track</span>
            </div>

            <a
              href="#genai-requirements"
              className="genai-quick-req-pill"
              onClick={(e) => {
                const el = document.getElementById('genai-requirements');
                if (el) {
                  e.preventDefault();
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              title="Jump to requirements guide"
            >
              <span>Requirements</span>
              <span aria-hidden="true">↓</span>
            </a>

            <a
              href="#genai-submission"
              className="genai-quick-submit-pill"
              onClick={(e) => {
                const el = document.getElementById('genai-submission');
                if (el) {
                  e.preventDefault();
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              title="Jump to submission form"
            >
              <span>Submit Form</span>
              <span aria-hidden="true">↓</span>
            </a>

            <button
              type="button"
              className="genai-student-selector-btn"
              onClick={() => setShowRosterModal(true)}
              title="Click to switch student"
            >
              <span className="genai-student-icon">👤</span>
              <span className="genai-student-name-text">
                {studentName || 'Select Student'}
              </span>
              <span className="genai-switch-tag">Switch ▾</span>
            </button>
          </div>
        </div>

        {/* If NO project found for student name */}
        {!project ? (
          <div className="genai-card genai-not-found-card">
            <div className="genai-card-badge" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              ⚠️ Allocation Not Found
            </div>
            <h2 className="genai-not-found-title">
              No assignment found for "{studentName || 'Anonymous'}"
            </h2>
            <p className="genai-not-found-desc">
              We couldn't match your name with the 48 registered students in the Generative AI project roster. Please select your official name below to load your personalized assignment.
            </p>

            <div className="genai-quick-submit-fallback" style={{ marginBlock: '1.25rem', padding: '1rem 1.25rem', background: 'var(--color-bg-surface-alt)', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', width: '100%' }}>
              <div style={{ textAlign: 'left' }}>
                <strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>Looking for the submission form?</strong>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>You can submit your Gen AI assessment responses directly.</span>
              </div>
              <a
                href={GENAI_SUBMISSION_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ fontSize: '0.875rem', padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
              >
                <span>Open Submission Form</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>

            <div className="genai-quick-select-box">
              <div className="genai-search-input-wrap">
                <input
                  type="text"
                  className="genai-search-input"
                  placeholder="Search your name or project title..."
                  value={rosterSearch}
                  onChange={(e) => setRosterSearch(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="genai-roster-list-preview">
                {filteredRoster.slice(0, 10).map((item) => (
                  <button
                    key={item.sno}
                    type="button"
                    className="genai-roster-item-btn"
                    onClick={() => handleSelectDifferentStudent(item.studentName)}
                  >
                    <div className="genai-roster-avatar">
                      {item.studentName.charAt(0).toUpperCase()}
                    </div>
                    <div className="genai-roster-details">
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
        ) : (
          /* PERSONALIZED STUDENT PROJECT VIEW */
          <div className="genai-assignment-container">
            {/* Student Project Hero Banner */}
            <header className="genai-hero-card">
              <div className="genai-hero-meta">
                <span
                  className="genai-category-badge"
                  style={{
                    backgroundColor: categoryStyle.bg,
                    borderColor: categoryStyle.border,
                    color: categoryStyle.text,
                  }}
                >
                  <span className="category-icon">{categoryStyle.icon}</span>
                  <span>{project.category}</span>
                </span>

                <span className="genai-project-id-pill">
                  Project #{project.projectNo}
                </span>

                <span className={`genai-difficulty-pill ${project.difficulty.includes('Advanced') ? 'is-advanced' : 'is-standard'}`}>
                  {project.difficulty.includes('Advanced') ? '⚡ Advanced: External API / Real-time' : 'Standard Complexity'}
                </span>

                <span className="genai-roll-pill">
                  Student #{project.sno} of 48
                </span>
              </div>

              <div className="genai-hero-content">
                <div className="genai-student-subheading">
                  Personalized Assignment for <strong style={{ color: 'var(--color-text-primary)' }}>{project.studentName}</strong>
                </div>
                <h1 className="genai-project-title">
                  {project.title}
                </h1>
              </div>
            </header>

            {/* Core Details Grid: Overview & Outcomes */}
            <div className="genai-grid-two-col">
              {/* Card 1: Project Description */}
              <div className="genai-card">
                <div className="genai-card-header">
                  <div className="genai-card-icon-box">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h2 className="genai-card-title">Project Description</h2>
                    <p className="genai-card-subtitle">Scope & core functionality</p>
                  </div>
                </div>

                <div className="genai-card-body">
                  <p className="genai-desc-text">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Card 2: Learning Outcomes */}
              <div className="genai-card">
                <div className="genai-card-header">
                  <div className="genai-card-icon-box" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                      <path d="M2 12h20"></path>
                    </svg>
                  </div>
                  <div>
                    <h2 className="genai-card-title">Learning Outcomes</h2>
                    <p className="genai-card-subtitle">Key architectural & coding skills to build</p>
                  </div>
                </div>

                <div className="genai-card-body">
                  <ul className="genai-outcomes-list">
                    {project.learningOutcomesList.map((outcome, idx) => (
                      <li key={idx} className="genai-outcome-item">
                        <span className="genai-outcome-bullet" aria-hidden="true">🎯</span>
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Card 3: Must-Have Features (Evaluated under Core Features) */}
            <div className="genai-card genai-features-card">
              <div className="genai-card-header" style={{ justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="genai-card-icon-box" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 11 12 14 22 4"></polyline>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <h2 className="genai-card-title">Project-Specific Must-Have Features</h2>
                      <span className="pill" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                        Checked under Core Features
                      </span>
                    </div>
                    <p className="genai-card-subtitle">
                      Your evaluator will specifically verify these exact deliverables during grading.
                    </p>
                  </div>
                </div>

                {/* Progress Tracker Pill */}
                <div className="genai-progress-chip">
                  <span className="genai-progress-fraction">
                    {completedCount} / {mustHavesList.length} Completed
                  </span>
                  <div className="genai-progress-track">
                    <div
                      className="genai-progress-fill"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="genai-card-body">
                <div className="genai-checklist-grid">
                  {mustHavesList.map((item, idx) => {
                    const isChecked = !!checkedFeatures[idx];
                    return (
                      <div
                        key={idx}
                        className={`genai-checklist-item ${isChecked ? 'is-completed' : ''}`}
                        onClick={() => toggleFeature(idx)}
                        role="checkbox"
                        aria-checked={isChecked}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            toggleFeature(idx);
                          }
                        }}
                      >
                        <div className={`genai-custom-checkbox ${isChecked ? 'checked' : ''}`}>
                          {isChecked && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </div>
                        <div className="genai-checklist-label">
                          <span className="genai-feature-number">Feature {idx + 1}:</span> {item}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="genai-checklist-tip">
                  💡 <strong>Tip:</strong> Click each item as you build it to track your completion status. Progress is automatically saved in your browser.
                </div>
              </div>
            </div>

            {/* Mandatory Submission Requirements Guide */}
            <section id="genai-requirements" className="genai-reqs-section">
              <div className="genai-reqs-header">
                <div className="pill" style={{ marginBottom: '0.75rem', width: 'fit-content' }}>
                  <span>📋 Mandatory Project Deliverables Guide</span>
                </div>
                <h2 className="genai-reqs-title">
                  Submission Requirements Guide
                </h2>
                <p className="genai-reqs-subtitle">
                  Every student must complete all three requirements before submitting their Generative AI project. Ensure your project is deployed live, public on GitHub, and documented with a full-page PDF screenshot.
                </p>
              </div>

              <div className="genai-reqs-grid">
                {/* 1. Live Deployment Requirement - NO LIMITATIONS */}
                <div className="genai-req-card step-deployment" id="genai-req-deployment">
                  <div className="genai-req-top">
                    <span className="genai-step-pill">STEP 01</span>
                    <span className="genai-status-badge badge-deployment">
                      ✓ Deploy Anywhere
                    </span>
                  </div>

                  <div className="genai-req-title-wrap">
                    <div className="genai-req-icon-box icon-deployment">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="genai-req-name">Live Deployment</h3>
                      <span className="genai-req-sub">Zero Platform Limitations</span>
                    </div>
                  </div>

                  <p className="genai-req-description">
                    You can deploy your project <strong>anywhere with zero restrictions</strong>. Vercel, Netlify, Render, Railway, GitHub Pages, Firebase, Supabase, or AWS are all 100% permitted. Just paste a live working link through which the evaluator can browse your website.
                  </p>

                  <div className="genai-req-box">
                    <span className="genai-req-box-label">REQUIRED DELIVERABLE</span>
                    <span className="genai-req-box-item">Live Interactive Website URL</span>
                    <code className="genai-req-code">https://{studentSlug || 'your-project'}.vercel.app</code>
                  </div>

                  <ul className="genai-req-points">
                    <li>
                      <svg className="check-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Deploy anywhere: Vercel, Netlify, Render, Pages, etc.</span>
                    </li>
                    <li>
                      <svg className="check-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Must be live & browseable (no localhost or private links)</span>
                    </li>
                    <li>
                      <svg className="check-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Ensure all must-have features can be clicked and tested</span>
                    </li>
                  </ul>

                  <div className="genai-req-footer">
                    <span className="genai-req-footer-tip">
                      💡 <strong>Rule:</strong> No platform lock-in. Any working public host is valid.
                    </span>
                  </div>
                </div>

                {/* 2. GitHub Requirement */}
                <div className="genai-req-card step-github" id="genai-req-github">
                  <div className="genai-req-top">
                    <span className="genai-step-pill">STEP 02</span>
                    <span className="genai-status-badge badge-github">
                      Must be Public
                    </span>
                  </div>

                  <div className="genai-req-title-wrap">
                    <div className="genai-req-icon-box icon-github">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="genai-req-name">GitHub Repository</h3>
                      <span className="genai-req-sub">Full Source Code</span>
                    </div>
                  </div>

                  <p className="genai-req-description">
                    Every student must push their complete, unminified source code to a <strong>public GitHub repository</strong>. Evaluators will inspect your repository structure, commits, and code authenticity.
                  </p>

                  <div className="genai-req-box">
                    <span className="genai-req-box-label">REQUIRED DELIVERABLE</span>
                    <span className="genai-req-box-item">Public GitHub Repository URL</span>
                    <code className="genai-req-code">https://github.com/your-username/{project ? project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'genai-project'}</code>
                  </div>

                  <ul className="genai-req-points">
                    <li>
                      <svg className="check-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Repository visibility must be strictly set to <strong>Public</strong></span>
                    </li>
                    <li>
                      <svg className="check-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Include README.md describing the project and features</span>
                    </li>
                    <li>
                      <svg className="check-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Source code must match your live deployed website</span>
                    </li>
                  </ul>

                  <div className="genai-req-footer">
                    <div className="genai-req-footer-guide-info">
                      <strong>GitHub Walkthrough</strong>
                      <span>Step-by-step setup guide</span>
                    </div>
                    {onOpenGithubGuide && (
                      <button
                        type="button"
                        onClick={onOpenGithubGuide}
                        className="btn btn-primary btn-sm genai-guide-btn"
                      >
                        <span>Open Guide</span>
                        <span aria-hidden="true">→</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. Full-Page Screenshot PDF Requirement */}
                <div className="genai-req-card step-pdf" id="genai-req-pdf">
                  <div className="genai-req-top">
                    <span className="genai-step-pill">STEP 03</span>
                    <span className="genai-status-badge badge-pdf">
                      Upload in Form
                    </span>
                  </div>

                  <div className="genai-req-title-wrap">
                    <div className="genai-req-icon-box icon-pdf">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <circle cx="10" cy="9" r="1.5"></circle>
                      </svg>
                    </div>
                    <div>
                      <h3 className="genai-req-name">Screenshot (PDF)</h3>
                      <span className="genai-req-sub">Full-Page Capture</span>
                    </div>
                  </div>

                  <p className="genai-req-description">
                    Every student must capture a <strong>complete full-page screenshot</strong> of their running deployed application (header to footer) and export it as a <strong>PDF file</strong> to upload in the form.
                  </p>

                  <div className="genai-req-box">
                    <span className="genai-req-box-label">REQUIRED DELIVERABLE</span>
                    <span className="genai-req-box-item">Full-Page Application PDF</span>
                    <code className="genai-req-code">{studentSlug || 'student'}_genai_project.pdf</code>
                  </div>

                  <ul className="genai-req-points">
                    <li>
                      <svg className="check-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Full page capture from top header down to footer</span>
                    </li>
                    <li>
                      <svg className="check-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Export & save the full capture as a <strong>.PDF</strong> document</span>
                    </li>
                    <li>
                      <svg className="check-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Upload the PDF directly into the Google Form</span>
                    </li>
                  </ul>

                  <div className="genai-req-footer">
                    <div className="genai-req-footer-guide-info">
                      <strong>Screenshot & PDF Guide</strong>
                      <span>Chrome & Edge capture steps</span>
                    </div>
                    {onOpenPdfGuide && (
                      <button
                        type="button"
                        onClick={onOpenPdfGuide}
                        className="btn btn-primary btn-sm genai-guide-btn"
                      >
                        <span>Open Guide</span>
                        <span aria-hidden="true">→</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Active Official Google Form Submission Section */}
            <section id="genai-submission" style={{ scrollMarginTop: '6rem' }}>
              <div className="genai-card genai-submission-active-card">
                <div className="genai-submission-badge active">
                  <span className="live-pulse-dot" aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                  <span>Final Phase · Submissions Open</span>
                </div>
                <h2 className="genai-submission-title">
                  Ready to submit your Gen AI Project?
                </h2>
                <p className="genai-submission-desc">
                  Submit your responses, live deployment URL (any host), public GitHub repo, and full-page screenshot PDF for your allocated Generative AI project using the official Google Form.
                </p>

                <div className="submission-checklist-preview" style={{ marginBlockEnd: '1.75rem' }}>
                  <div className="sub-check-pill">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>1. Live Deployment URL (Any Host Allowed)</span>
                  </div>
                  <div className="sub-check-pill">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>2. Public GitHub Repo URL</span>
                  </div>
                  <div className="sub-check-pill">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>3. Full-Page Screenshot PDF</span>
                  </div>
                  <div className="sub-check-pill">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>4. Must-Have Features Built ({completedCount}/{mustHavesList.length})</span>
                  </div>
                </div>

                <div className="genai-submission-action-bar">
                  <a
                    href={GENAI_SUBMISSION_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary genai-submit-link-btn"
                    id="btn-genai-google-form"
                  >
                    <span>Open Gen AI Submission Form</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyFormLink}
                    className="btn-icon genai-copy-form-btn"
                    title="Copy Google Form URL to clipboard"
                  >
                    {copiedFormLink ? (
                      <>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span style={{ color: '#10B981', fontWeight: 600 }}>Copied Form Link! ✓</span>
                      </>
                    ) : (
                      <>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <span className="genai-submission-hint">
                    Opens Google Form in a new tab to record your responses.
                  </span>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Roster Switcher Modal (Allows instructor or student to switch allocation) */}
      {showRosterModal && (
        <div
          className="name-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="roster-modal-title"
          onClick={() => setShowRosterModal(false)}
        >
          <div
            className="name-modal-card genai-roster-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBlockEnd: '1rem' }}>
              <div className="name-modal-badge" style={{ margin: 0 }}>
                <span>Class Roster (48 Students)</span>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setShowRosterModal(false)}
                style={{ padding: '4px 8px', fontSize: '0.875rem' }}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <h2 id="roster-modal-title" className="name-modal-title" style={{ fontSize: '1.25rem' }}>
              Switch Student Allocation
            </h2>
            <p className="name-modal-desc" style={{ fontSize: '0.875rem', marginBlockEnd: '1rem' }}>
              Select any student from the 48 allocations to view their personalized assignment details:
            </p>

            <div style={{ marginBlockEnd: '1rem' }}>
              <input
                type="text"
                className="name-input"
                placeholder="Search by student name or project..."
                value={rosterSearch}
                onChange={(e) => setRosterSearch(e.target.value)}
                autoFocus
              />
            </div>

            <div className="genai-modal-roster-list">
              {filteredRoster.map((item) => (
                <button
                  key={item.sno}
                  type="button"
                  className={`genai-roster-item-btn ${project && project.studentName === item.studentName ? 'is-active-student' : ''}`}
                  onClick={() => handleSelectDifferentStudent(item.studentName)}
                >
                  <div className="genai-roster-avatar">
                    {item.studentName.charAt(0).toUpperCase()}
                  </div>
                  <div className="genai-roster-details">
                    <div className="genai-roster-name">
                      {item.studentName}
                      {project && project.studentName === item.studentName && (
                        <span className="genai-current-tag">Current</span>
                      )}
                    </div>
                    <div className="genai-roster-title">
                      #{item.projectNo} · {item.title}
                    </div>
                  </div>
                  <span className="genai-roster-cat-pill">
                    {item.category}
                  </span>
                </button>
              ))}
              {filteredRoster.length === 0 && (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: '0.875rem' }}>
                  No students found matching "{rosterSearch}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
