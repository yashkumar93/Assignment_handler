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

export default function GenAiSection({ studentName, onBackToHome, onUpdateStudentName }) {
  const [showRosterModal, setShowRosterModal] = useState(false);
  const [rosterSearch, setRosterSearch] = useState('');
  
  // Find project based on studentName
  const project = getGenAiProjectForStudent(studentName);

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
      } catch {}
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

            {/* Submission Section Placeholder (as requested) */}
            <div className="genai-card genai-submission-placeholder-card">
              <div className="genai-submission-badge">
                <span>Final Phase · Project Submission</span>
              </div>
              <h2 className="genai-submission-title">
                Ready to submit your GenAI assignment?
              </h2>
              <p className="genai-submission-desc">
                The official Google Form submission link for Generative AI projects will be released shortly by your instructor. Please ensure your project repository is ready and all must-have features are implemented before final submission.
              </p>

              <div className="genai-submission-action-bar">
                <div className="genai-disabled-submission-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>Google Form Submission Opening Soon</span>
                </div>
                <span className="genai-submission-hint">
                  Your instructor will activate the submission form URL here.
                </span>
              </div>
            </div>
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
