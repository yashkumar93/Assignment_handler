import React from 'react';
import BrandLogo from './BrandLogo';

const HTML_CSS_ASSESSMENTS = [
  {
    id: 'assessment-1',
    number: 1,
    label: 'Assessment 1',
    status: 'active',
    statusLabel: 'Active',
    description: 'Core portfolio assignment with structured requirements, rubric, and submission form.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    id: 'assessment-2',
    number: 2,
    label: 'Assessment 2',
    status: 'coming-soon',
    statusLabel: 'Coming Soon',
    description: 'Details for Assessment 2 will be announced soon. Stay tuned!',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: 'assessment-3',
    number: 3,
    label: 'Assessment 3',
    status: 'coming-soon',
    statusLabel: 'Coming Soon',
    description: 'Details for Assessment 3 will be announced soon. Stay tuned!',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: 'assessment-4',
    number: 4,
    label: 'Assessment 4',
    status: 'coming-soon',
    statusLabel: 'Coming Soon',
    description: 'Details for Assessment 4 will be announced soon. Stay tuned!',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

const GENAI_ASSESSMENTS = [
  {
    id: 'assessment-1',
    number: 1,
    label: 'Assessment 1',
    status: 'active',
    statusLabel: 'Active',
    description: 'Build a Generative AI project — structured requirements, rubric, and submission form.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    id: 'assessment-2',
    number: 2,
    label: 'Assessment 2',
    status: 'active',
    statusLabel: 'Active',
    description: 'Complete Anthropic\'s free Claude 101 course and submit your certificate of completion.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
  },
  {
    id: 'assessment-3',
    number: 3,
    label: 'Assessment 3',
    status: 'coming-soon',
    statusLabel: 'Coming Soon',
    description: 'Details for Assessment 3 will be announced soon. Stay tuned!',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: 'assessment-4',
    number: 4,
    label: 'Assessment 4',
    status: 'coming-soon',
    statusLabel: 'Coming Soon',
    description: 'Details for Assessment 4 will be announced soon. Stay tuned!',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

export default function TrackAssessmentPage({ track, studentName, onSelectAssessment, onBackToLanding }) {
  const isGenAi = track === 'genai';
  const trackLabel = isGenAi ? 'Generative AI' : 'HTML & CSS';
  const trackColor = isGenAi ? '#8B5CF6' : '#2563EB';
  const trackColorSubtle = isGenAi ? 'rgba(139, 92, 246, 0.12)' : 'rgba(37, 99, 235, 0.10)';
  const trackColorBorder = isGenAi ? 'rgba(139, 92, 246, 0.3)' : 'rgba(37, 99, 235, 0.25)';
  const ASSESSMENTS = isGenAi ? GENAI_ASSESSMENTS : HTML_CSS_ASSESSMENTS;

  return (
    <div className="track-assessment-wrapper">
      {/* Ambient Glow */}
      <div
        className="track-assessment-glow"
        aria-hidden="true"
        style={{ background: isGenAi
          ? 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(139,92,246,0.13) 0%, transparent 70%)'
          : 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(37,99,235,0.10) 0%, transparent 70%)'
        }}
      />

      {/* Header */}
      <header className="track-assessment-header">
        <div className="nav-brand">
          <BrandLogo size={24} />
          <span>Assignment Portal</span>
        </div>
        <button
          type="button"
          className="track-assessment-back-btn"
          onClick={onBackToLanding}
          aria-label="Back to Tracks"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Back to Tracks</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="track-assessment-main">
        {/* Track Badge + Heading */}
        <div className="track-assessment-heading-block">
          <span
            className="track-assessment-badge"
            style={{
              background: trackColorSubtle,
              borderColor: trackColorBorder,
              color: trackColor,
            }}
          >
            <span
              className="track-assessment-dot"
              style={{ background: trackColor }}
              aria-hidden="true"
            />
            {trackLabel} Track
          </span>

          <h1 className="track-assessment-title">
            Choose your Assessment
          </h1>
          <p className="track-assessment-subtitle">
            {studentName
              ? `Welcome, ${studentName}! Select an assessment below to view its details and get started.`
              : 'Select an assessment below to view its details and get started.'}
          </p>
        </div>

        {/* Assessment Cards Grid */}
        <div className="track-assessment-grid">
          {ASSESSMENTS.map((a) => {
            const isActive = a.status === 'active';
            return (
              <button
                key={a.id}
                type="button"
                className={`track-assessment-card ${isActive ? 'is-active' : 'is-locked'}`}
                onClick={() => isActive && onSelectAssessment(a.number)}
                disabled={!isActive}
                aria-label={`${a.label} – ${isActive ? 'Open' : 'Coming Soon'}`}
              >
                {/* Card Top Row */}
                <div className="tac-top-row">
                  <div
                    className="tac-icon-box"
                    style={isActive ? { background: trackColorSubtle, color: trackColor } : {}}
                  >
                    {a.icon}
                  </div>
                  <span
                    className={`tac-status-badge ${isActive ? 'tac-badge-active' : 'tac-badge-locked'}`}
                    style={isActive ? { background: trackColorSubtle, color: trackColor, borderColor: trackColorBorder } : {}}
                  >
                    {isActive && (
                      <span
                        className="tac-live-dot"
                        style={{ background: trackColor }}
                        aria-hidden="true"
                      />
                    )}
                    {a.statusLabel}
                  </span>
                </div>

                {/* Assessment Number + Label */}
                <div className="tac-number">
                  <span className="tac-number-text">
                    {a.number < 10 ? `0${a.number}` : a.number}
                  </span>
                </div>
                <h2 className="tac-label">{a.label}</h2>
                <p className="tac-desc">{a.description}</p>

                {/* CTA Arrow */}
                {isActive && (
                  <div className="tac-cta-row">
                    <span className="tac-cta-text" style={{ color: trackColor }}>Open Assessment</span>
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke={trackColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                )}

                {!isActive && (
                  <div className="tac-locked-row">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span>To be announced</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="track-assessment-footer" />
    </div>
  );
}

