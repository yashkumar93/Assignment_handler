import React, { useState } from 'react';

export const CLAUDE_101_SUBMISSION_FORM_URL = 'https://forms.gle/56UV3eHNccwb5LHK6';

/* ── Colour tokens (purple GenAI palette) ── */
const PURPLE = '#8B5CF6';
const PURPLE_SUBTLE = 'rgba(139,92,246,0.10)';
const PURPLE_BORDER = 'rgba(139,92,246,0.25)';
const NAVY = '#1B2A4A';

/* ── Small reusable helpers ── */
function StepBadge({ n }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 28, height: 28, borderRadius: '50%',
      background: PURPLE_SUBTLE, color: PURPLE,
      fontWeight: 700, fontSize: '0.8125rem', flexShrink: 0,
      border: `1.5px solid ${PURPLE_BORDER}`,
    }}>{n}</span>
  );
}

function SectionTitle({ icon, children }) {
  return (
    <h3 style={{
      display: 'flex', alignItems: 'center', gap: '0.6rem',
      fontSize: '1.0625rem', fontWeight: 700,
      color: 'var(--color-text-primary)', marginBottom: '0.625rem',
    }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 30, height: 30, borderRadius: 8,
        background: PURPLE_SUBTLE, color: PURPLE, flexShrink: 0,
      }}>{icon}</span>
      {children}
    </h3>
  );
}

function CheckItem({ children }) {
  return (
    <li style={{
      display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
      marginBottom: '0.4rem', fontSize: '0.9375rem', lineHeight: 1.6,
      color: 'var(--color-text-secondary)',
    }}>
      <svg style={{ marginTop: 3, flexShrink: 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <span>{children}</span>
    </li>
  );
}

function InfoCard({ title, children, accent = PURPLE }) {
  return (
    <div style={{
      background: 'var(--color-bg-surface)', border: `1px solid var(--color-border-default)`,
      borderLeft: `4px solid ${accent}`, borderRadius: 10,
      padding: '0.875rem 1.15rem', marginBottom: '0.75rem',
    }}>
      {title && <div style={{ fontWeight: 700, fontSize: '0.875rem', color: accent, marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</div>}
      {children}
    </div>
  );
}

const CURRICULUM = [
  { part: 'Part 1', title: 'Meet Claude', lessons: ['What is Claude?', 'Your first conversation with Claude'] },
  { part: 'Part 2', title: 'Getting better results', lessons: ['How to write clearer prompts and improve Claude\'s answers'] },
  { part: 'Part 3', title: 'How you\'ll work with Claude on your desktop', lessons: ['Ways to use Claude across your devices and apps'] },
  { part: 'Part 4', title: 'Organizing your work and knowledge', lessons: ['Introduction to Projects', 'Creating with Artifacts', 'Working with Skills'] },
  { part: 'Part 5', title: 'Expanding Claude\'s reach', lessons: ['Connecting your tools', 'Enterprise search', 'Research for deep dives'] },
  { part: 'Part 6', title: 'Putting it all together', lessons: ['Claude in action: use-cases by role', 'Other ways to work with Claude'] },
  { part: 'Part 7', title: 'Conclusion and certificate', lessons: ['What\'s next?', 'Certificate of completion'] },
];

const TROUBLESHOOTING = [
  { q: 'I cannot open the course link.', a: 'Try another browser, turn off VPN or ad blockers, or search for "Anthropic Academy Claude 101".' },
  { q: 'I did not receive the verification email.', a: 'Check spam and promotions folders, wait a few minutes, then request the email again. Check that the address has no typing mistakes.' },
  { q: 'A lesson will not mark as complete.', a: 'Scroll to the bottom of the lesson, finish any video, and click the Complete / Next button. Refresh the page and check again.' },
  { q: 'My name on the certificate is wrong.', a: 'Correct your profile name first, then check whether the certificate updates. If it does not, contact Academy support or tell your teacher before submitting.' },
  { q: 'Claude says I reached a usage limit.', a: 'Free accounts have limits. Wait a few hours and continue, or do the Claude practice later. You can still read the lessons.' },
  { q: 'Can I use a phone?', a: 'Yes for reading and watching, but a laptop is better for typing prompts and for downloading the certificate.' },
];

export default function GenAiAssessment2({ studentName, onBackToAssessments }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [copiedSubmissionUrl, setCopiedSubmissionUrl] = useState(false);

  const handleCopySubmissionUrl = async () => {
    try {
      await navigator.clipboard.writeText(CLAUDE_101_SUBMISSION_FORM_URL);
      setCopiedSubmissionUrl(true);
      setTimeout(() => setCopiedSubmissionUrl(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = CLAUDE_101_SUBMISSION_FORM_URL;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedSubmissionUrl(true);
      setTimeout(() => setCopiedSubmissionUrl(false), 2000);
    }
  };

  return (
    <article style={{ paddingBottom: '2rem' }}>

      {/* ── BACK + BADGE ROW ── */}
      <div className="wrap" style={{ paddingTop: '1rem' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem',
        }}>
          {onBackToAssessments && (
            <button
              type="button"
              onClick={onBackToAssessments}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                padding: '6px 14px', fontSize: '0.8125rem', fontWeight: 600,
                color: 'var(--color-text-secondary)', borderRadius: 8,
                border: '1px solid var(--color-border-subtle)',
                background: 'var(--color-bg-surface)', cursor: 'pointer', transition: 'all 140ms',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Assessments
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="pill" style={{ fontSize: '0.75rem', padding: '3px 10px', background: PURPLE_SUBTLE, color: PURPLE, borderColor: PURPLE_BORDER, fontWeight: 600 }}>
              Assessment 02 of 04
            </span>
            <span className="pill" style={{ fontSize: '0.75rem', padding: '3px 10px', fontWeight: 600 }}>
              Generative AI Track
            </span>
          </div>
        </div>

        {/* ── HERO HEADER ── */}
        <div style={{
          background: `linear-gradient(135deg, ${PURPLE_SUBTLE} 0%, rgba(139,92,246,0.04) 100%)`,
          border: `1.5px solid ${PURPLE_BORDER}`, borderRadius: 16,
          padding: 'clamp(1.25rem, 3vw, 2rem)', marginBottom: '1.25rem',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* decorative bg circle */}
          <div aria-hidden="true" style={{
            position: 'absolute', top: -60, right: -60, width: 220, height: 220,
            borderRadius: '50%', background: `radial-gradient(circle, ${PURPLE_SUBTLE} 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 44, height: 44, borderRadius: 12,
              background: PURPLE, color: '#fff', flexShrink: 0,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
            </span>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: PURPLE, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Assessment 2 · Generative AI Track</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-tertiary)' }}>Anthropic Academy · Free · ~2.5 hours</div>
            </div>
          </div>

          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.6rem', lineHeight: 1.2 }}>
            Claude 101 Course
          </h1>
          <p style={{ fontSize: '1.0625rem', fontWeight: 600, color: PURPLE, marginBottom: '0.75rem' }}>
            Student Guide &amp; Completion Verification
          </p>
          <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, maxWidth: '70ch', marginBottom: '1.25rem' }}>
            A step-by-step guide for students to complete Anthropic's free Claude 101 course and submit proof of completion.
          </p>

          {/* Meta pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {[
              { icon: '🎓', text: 'Claude 101 · Anthropic Academy' },
              { icon: '💸', text: 'Free' },
              { icon: '⏱️', text: '~2.5 hours (pauseable)' },
              { icon: '👤', text: 'Prepared for Students' },
            ].map(({ icon, text }) => (
              <span key={text} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                padding: '4px 12px', borderRadius: 20,
                background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)',
                fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500,
              }}>{icon} {text}</span>
            ))}
          </div>

          {/* Quick CTA Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
            <a
              href="https://academy.claude.com/courses/claude-101"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '9px 18px', borderRadius: 8,
                background: PURPLE, color: '#fff',
                fontWeight: 700, fontSize: '0.84rem', textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(139,92,246,0.3)',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
              Open Claude 101 Course
            </a>
            <a
              href={CLAUDE_101_SUBMISSION_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '9px 18px', borderRadius: 8,
                background: 'var(--color-bg-surface)', color: 'var(--color-text-primary)',
                fontWeight: 700, fontSize: '0.84rem', textDecoration: 'none',
                border: `1.5px solid ${PURPLE_BORDER}`,
              }}
            >
              <span>Submit Proof (Google Form)</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>

        {/* ── SECTION 1: WHAT IS THIS? ── */}
        <section style={{ marginBottom: '1.25rem' }}>
          <SectionTitle icon={
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          }>1. What is this assignment?</SectionTitle>

          <div style={{
            background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)',
            borderRadius: 12, padding: '1.15rem 1.35rem',
            fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.65,
          }}>
            <p style={{ marginBottom: '0.75rem' }}>
              You are being asked to complete <strong style={{ color: 'var(--color-text-primary)' }}>Claude 101</strong>, a beginner course offered by <strong style={{ color: 'var(--color-text-primary)' }}>Anthropic Academy</strong>. Anthropic is the company that makes Claude, an AI assistant.
            </p>
            <p style={{ marginBottom: '0.75rem' }}>
              The course teaches you how to use Claude for everyday study and work tasks, how to write better prompts, and how to use features such as Projects, Artifacts, Skills, connected tools and Research.
            </p>
            <p style={{ marginBottom: 0 }}>
              When you finish the course, you receive an official <strong style={{ color: PURPLE }}>Certificate of Completion</strong>. That certificate, with its verification link, is what you will submit to prove you did the course.
            </p>
          </div>
        </section>

        {/* ── SECTION 2: BEFORE YOU START ── */}
        <section style={{ marginBottom: '1.25rem' }}>
          <SectionTitle icon={
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          }>2. Before you start (checklist)</SectionTitle>

          <div style={{
            background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)',
            borderRadius: 12, padding: '1.15rem 1.35rem',
          }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)', marginBottom: '0.75rem' }}>Make sure you have all of this ready:</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <CheckItem>A computer or phone with a stable internet connection (a laptop is easier for the exercises)</CheckItem>
              <CheckItem>A working email address that you can access</CheckItem>
              <CheckItem>About <strong>2.5 hours</strong> in total — you do not need to finish in one sitting; your progress is saved</CheckItem>
              <CheckItem>A modern browser such as Chrome, Edge, Firefox or Safari</CheckItem>
              <CheckItem>Your <strong>full real name</strong>, exactly as you want it printed on the certificate (see Step 3 — this is very important)</CheckItem>
            </ul>
            <InfoCard title="No experience needed" accent="#10B981">
              <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                You do not need any coding or AI experience. The course is for complete beginners.
              </span>
            </InfoCard>
          </div>
        </section>

        {/* ── SECTION 3: STEP-BY-STEP ── */}
        <section style={{ marginBottom: '1.25rem' }}>
          <SectionTitle icon={
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          }>3. Step-by-step instructions</SectionTitle>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

            {/* Step 1 */}
            <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)', borderRadius: 12, padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.9rem' }}>
                <StepBadge n={1} />
                <h4 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-primary)', margin: 0 }}>Create a free Claude account <span style={{ fontWeight: 400, color: 'var(--color-text-tertiary)', fontSize: '0.8125rem' }}>(recommended)</span></h4>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem', lineHeight: 1.6 }}>
                The course includes practice with Claude itself, so having an account helps.
              </p>
              <ol style={{ paddingLeft: '1.25rem', margin: 0 }}>
                {[
                  <>Open <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" style={{ color: PURPLE }}>claude.ai</a> in your browser.</>,
                  'Click Sign up (or Continue with Google if you prefer).',
                  'Enter your email address and follow the verification step (a code or link will arrive in your inbox).',
                  'Complete any short profile questions and accept the terms.',
                  'You should now see a chat box. A free account is enough for the exercises in the course.',
                ].map((item, i) => (
                  <li key={i} style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: '0.4rem' }}>{item}</li>
                ))}
              </ol>
            </div>

            {/* Step 2 */}
            <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)', borderRadius: 12, padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.9rem' }}>
                <StepBadge n={2} />
                <h4 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-primary)', margin: 0 }}>Open the Anthropic Academy course page</h4>
              </div>
              <ol style={{ paddingLeft: '1.25rem', margin: 0 }}>
                {[
                  <>Go to <a href="https://academy.claude.com/courses/claude-101" target="_blank" rel="noopener noreferrer" style={{ color: PURPLE, wordBreak: 'break-all' }}>https://academy.claude.com/courses/claude-101</a></>,
                  <>If the link does not open, go to <a href="https://academy.claude.com" target="_blank" rel="noopener noreferrer" style={{ color: PURPLE }}>academy.claude.com</a> and click the course named <em>Claude 101</em>.</>,
                  'Read the short description — it covers using Claude for everyday work, understanding core features, and finding resources for more advanced learning.',
                ].map((item, i) => (
                  <li key={i} style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: '0.4rem' }}>{item}</li>
                ))}
              </ol>
            </div>

            {/* Step 3 */}
            <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)', borderRadius: 12, padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.9rem' }}>
                <StepBadge n={3} />
                <h4 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-primary)', margin: 0 }}>Register and set up your Academy profile</h4>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem', lineHeight: 1.6 }}>
                The course is hosted on a learning platform called Skilljar. You need to register there.
              </p>
              <ol style={{ paddingLeft: '1.25rem', margin: 0 }}>
                {[
                  'Click the Register (or Sign up / Start course) button.',
                  'Create your account with your email, or use the sign-in option offered on the page.',
                  'After registering, open your profile or account settings.',
                  'Check that your first name and last name are spelled correctly and are your real full name. The certificate prints this name. If it is wrong, the certificate will not match your identity and may not be accepted.',
                  'Save your profile.',
                ].map((item, i) => (
                  <li key={i} style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: '0.4rem' }}>{item}</li>
                ))}
              </ol>
              <InfoCard title="⚠️ Important" accent="#F59E0B">
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  Your name on the Academy profile must match your real full name exactly as you want it on the certificate.
                </span>
              </InfoCard>
            </div>

            {/* Step 4 — Curriculum */}
            <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)', borderRadius: 12, padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.9rem' }}>
                <StepBadge n={4} />
                <h4 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-primary)', margin: 0 }}>Start the course and complete every lesson</h4>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
                Open the course and work through the lessons in order. Here is the full curriculum:
              </p>

              <div style={{ display: 'grid', gap: '0.6rem', marginBottom: '1rem' }}>
                {CURRICULUM.map(({ part, title, lessons }) => (
                  <div key={part} style={{
                    borderRadius: 8, border: '1px solid var(--color-border-subtle)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      background: PURPLE_SUBTLE, padding: '8px 14px',
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                    }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: PURPLE, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{part}</span>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>· {title}</span>
                    </div>
                    <div style={{ padding: '8px 14px 10px' }}>
                      {lessons.map((l) => (
                        <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '0.2rem' }}>
                          <span style={{ color: PURPLE, fontSize: '0.65rem' }}>●</span> {l}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>How to work through each lesson:</p>
              <ol style={{ paddingLeft: '1.25rem', margin: 0 }}>
                {[
                  'Open a lesson, read or watch it fully, and do not skip ahead.',
                  'When a lesson suggests an activity (e.g. "try this prompt in Claude"), actually do it in your Claude account.',
                  'Click the Next / Complete / Mark as complete button at the end of each lesson. The platform tracks progress by these clicks, so a lesson you did not click through will block your certificate.',
                  'Look at the progress bar or course outline. Every lesson should show a completed tick before you finish.',
                  'Take short notes as you go (see Section 5).',
                ].map((item, i) => (
                  <li key={i} style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: '0.4rem' }}>{item}</li>
                ))}
              </ol>
            </div>

            {/* Step 5 */}
            <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)', borderRadius: 12, padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.9rem' }}>
                <StepBadge n={5} />
                <h4 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-primary)', margin: 0 }}>Complete any quiz or final requirement</h4>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                If the course shows a quiz or final assessment, complete it and pass it. If a quiz is not passed, the certificate may not be issued. You can usually retry — read each question carefully and use your notes.
              </p>
            </div>

            {/* Step 6 */}
            <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)', borderRadius: 12, padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.9rem' }}>
                <StepBadge n={6} />
                <h4 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-primary)', margin: 0 }}>Get your Certificate of Completion</h4>
              </div>
              <ol style={{ paddingLeft: '1.25rem', margin: 0 }}>
                {[
                  'Go to the last section called Conclusion & certificate, then open Certificate of completion.',
                  'Click the button to view or download your certificate.',
                  'Confirm that the certificate shows your full name, the course name Claude 101, the offering organization Anthropic Education, and a completion date.',
                  'Download it as a PDF or image and keep a copy.',
                ].map((item, i) => (
                  <li key={i} style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: '0.4rem' }}>{item}</li>
                ))}
              </ol>
            </div>

            {/* Step 7 — Submit */}
            <div style={{
              background: `linear-gradient(135deg, ${PURPLE_SUBTLE} 0%, rgba(139,92,246,0.03) 100%)`,
              border: `1.5px solid ${PURPLE_BORDER}`, borderRadius: 12, padding: '1.25rem 1.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.9rem' }}>
                <StepBadge n={7} />
                <h4 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-primary)', margin: 0 }}>Submit your proof</h4>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.9rem', lineHeight: 1.6 }}>
                Submit <strong>all</strong> of the following using the official Google Form below:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {[
                  'Your full name and roll number / student ID',
                  'The verification link of your certificate',
                  'The certificate file (PDF or image)',
                  'A screenshot of your course progress page showing 100% or all lessons completed',

                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                    background: 'var(--color-bg-surface)', borderRadius: 8,
                    padding: '8px 12px', border: '1px solid var(--color-border-subtle)',
                  }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 22, height: 22, borderRadius: '50%',
                      background: PURPLE, color: '#fff', fontSize: '0.72rem', fontWeight: 700, flexShrink: 0,
                    }}>{i + 1}</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* Official Google Form Submission CTA Banner */}
              <div style={{
                background: 'var(--color-bg-surface)', border: `1.5px solid ${PURPLE_BORDER}`,
                borderRadius: 10, padding: '14px 16px', marginBottom: '1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
                    Official Google Form Submission
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                    Submit your certificate link and progress screenshot directly here.
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <a
                    href={CLAUDE_101_SUBMISSION_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                      padding: '8px 16px', borderRadius: 8,
                      background: PURPLE, color: '#fff',
                      fontWeight: 700, fontSize: '0.8125rem', textDecoration: 'none',
                      boxShadow: '0 2px 8px rgba(139,92,246,0.3)',
                    }}
                  >
                    <span>Open Google Form</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                  <button
                    type="button"
                    onClick={handleCopySubmissionUrl}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                      padding: '8px 14px', borderRadius: 8,
                      background: copiedSubmissionUrl ? 'rgba(16,185,129,0.12)' : 'var(--color-bg-surface-alt)',
                      color: copiedSubmissionUrl ? '#10B981' : 'var(--color-text-secondary)',
                      border: copiedSubmissionUrl ? '1px solid #10B981' : '1px solid var(--color-border-default)',
                      fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    {copiedSubmissionUrl ? 'Copied Link!' : 'Copy Link'}
                  </button>
                </div>
              </div>

              {/* Verification Link */}
              <div style={{
                background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)',
                borderRadius: 8, padding: '12px 14px',
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: PURPLE, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  Sample Verification Link
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <code style={{
                    fontSize: '0.8125rem', color: 'var(--color-text-secondary)', wordBreak: 'break-all',
                    background: 'var(--color-bg-surface-alt)', padding: '3px 8px', borderRadius: 5,
                    border: '1px solid var(--color-border-subtle)',
                  }}>
                    https://academy.claude.com/verify/8e68c779cd13dbc6a29a03fa088be01c
                  </code>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText('https://academy.claude.com/verify/8e68c779cd13dbc6a29a03fa088be01c')}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                      padding: '4px 10px', fontSize: '0.75rem', fontWeight: 600,
                      color: PURPLE, background: PURPLE_SUBTLE, border: `1px solid ${PURPLE_BORDER}`,
                      borderRadius: 6, cursor: 'pointer',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy
                  </button>
                </div>
              </div>

              <div style={{
                marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border-subtle)',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                  <strong style={{ color: 'var(--color-text-primary)' }}>Deadline:</strong> To be announced by your teacher.
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* ── SECTION 4: TROUBLESHOOTING ── */}
        <section style={{ marginBottom: '1.25rem' }}>
          <SectionTitle icon={
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          }>4. Troubleshooting for beginners</SectionTitle>

          <div style={{
            background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)',
            borderRadius: 12, overflow: 'hidden',
          }}>
            {TROUBLESHOOTING.map(({ q, a }, i) => (
              <div key={i} style={{ borderBottom: i < TROUBLESHOOTING.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: '1rem', padding: '0.875rem 1.15rem',
                    background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.4 }}>{q}</span>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms', flexShrink: 0 }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 1.15rem 0.875rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 5: ACADEMIC HONESTY ── */}
        <section style={{ marginBottom: '1.25rem' }}>
          <SectionTitle icon={
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          }>5. Academic honesty rules</SectionTitle>

          <div style={{
            background: 'rgba(239,68,68,0.06)', border: '1.5px solid rgba(239,68,68,0.25)',
            borderRadius: 12, padding: '1.15rem 1.35rem',
          }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                'Complete the course yourself, with your own account and your own name.',
                'Do not share, borrow or reuse another person\'s certificate or link.',
                'Submitting someone else\'s certificate or an edited image will be treated as academic dishonesty.',
              ].map((rule, i) => (
                <li key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
                  marginBottom: i < 2 ? '0.5rem' : 0,
                  fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.55,
                }}>
                  <svg style={{ marginTop: 3, flexShrink: 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── SECTION 6: OFFICIAL SUBMISSION FORM ── */}
        <section id="claude-submission-form" style={{ marginBottom: '1.25rem' }}>
          <div style={{
            background: 'var(--color-bg-surface)',
            border: `1.5px solid ${PURPLE_BORDER}`,
            borderRadius: 14,
            padding: '1.5rem 1.75rem',
            boxShadow: 'var(--shadow-md, 0 4px 20px rgba(0,0,0,0.06))',
          }}>
            <div className="pill" style={{
              background: PURPLE_SUBTLE,
              borderColor: PURPLE_BORDER,
              color: PURPLE,
              marginBottom: '0.75rem',
              width: 'fit-content',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              <span>Final Step · Official Submission</span>
            </div>

            <h2 style={{ fontSize: 'clamp(1.25rem, 2.2vw, 1.65rem)', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.45rem' }}>
              Ready to submit your Claude 101 proof?
            </h2>

            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.55, maxWidth: '68ch', marginBottom: '1.15rem' }}>
              Once you have finished all lessons and received your official Certificate of Completion, submit your verification link and completion proof through the official Google Form below.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.625rem', marginBottom: '1.25rem' }}>
              <div style={{ background: 'var(--color-bg-surface-alt)', border: '1px solid var(--color-border-subtle)', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>1. Certificate Verification Link</span>
              </div>
              <div style={{ background: 'var(--color-bg-surface-alt)', border: '1px solid var(--color-border-subtle)', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>2. Certificate File (PDF / Image)</span>
              </div>
              <div style={{ background: 'var(--color-bg-surface-alt)', border: '1px solid var(--color-border-subtle)', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>3. 100% Progress Screenshot</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flexWrap: 'wrap' }}>
              <a
                href={CLAUDE_101_SUBMISSION_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                id="btn-claude-google-form"
                style={{
                  minHeight: '42px',
                  paddingInline: '22px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none',
                  background: PURPLE,
                  boxShadow: '0 3px 12px rgba(139,92,246,0.3)',
                }}
              >
                <span>Open Google Form</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>

              <button
                type="button"
                onClick={handleCopySubmissionUrl}
                className="btn-icon"
                style={{
                  minHeight: '42px',
                  paddingInline: '16px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: copiedSubmissionUrl ? 'rgba(16,185,129,0.12)' : 'var(--color-bg-surface-alt)',
                  color: copiedSubmissionUrl ? '#10B981' : 'var(--color-text-secondary)',
                  border: copiedSubmissionUrl ? '1px solid #10B981' : '1px solid var(--color-border-default)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                {copiedSubmissionUrl ? 'Copied Form Link!' : 'Copy Form Link'}
              </button>

              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-tertiary)' }}>
                Opens Google Form in a new tab
              </span>
            </div>
          </div>
        </section>

        {/* ── START COURSE CTA ── */}
        <div style={{
          background: `linear-gradient(135deg, ${PURPLE_SUBTLE} 0%, rgba(139,92,246,0.03) 100%)`,
          border: `1.5px solid ${PURPLE_BORDER}`, borderRadius: 14,
          padding: '1.25rem 1.5rem', textAlign: 'center',
        }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
            Ready to start the course?
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', marginBottom: '1rem', lineHeight: 1.55 }}>
            Click the button below to open Claude 101 on Anthropic Academy. It's free and takes about 2.5 hours.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a
              href="https://academy.claude.com/courses/claude-101"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '10px 24px', borderRadius: 8,
                background: PURPLE, color: '#fff',
                fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none',
                boxShadow: '0 3px 12px rgba(139,92,246,0.3)', transition: 'opacity 150ms',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
              Open Claude 101 Course
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
            {onBackToAssessments && (
              <button
                type="button"
                onClick={onBackToAssessments}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '10px 18px', borderRadius: 8,
                  background: 'var(--color-bg-surface)', color: 'var(--color-text-secondary)',
                  fontWeight: 600, fontSize: '0.84rem', cursor: 'pointer',
                  border: '1px solid var(--color-border-default)', textDecoration: 'none',
                }}
              >
                ← Choose Another Assessment
              </button>
            )}
          </div>
        </div>

      </div>
    </article>
  );
}

