import React, { useState } from 'react';

export const AI_CAPABILITIES_SUBMISSION_FORM_URL = 'https://forms.gle/PYTf3S2nsWrbBwU78';

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
  {
    part: 'Section 1',
    title: 'Getting Started',
    lessons: [
      'Intro to AI Capabilities and Limitations',
      'What We Mean by AI',
      'How AI Gets Its Character',
    ],
  },
  {
    part: 'Section 2',
    title: 'Next Token Prediction',
    lessons: [
      'Next Token Prediction',
      'Try It Out: Next Token Prediction',
    ],
  },
  {
    part: 'Section 3',
    title: 'Knowledge',
    lessons: [
      'Knowledge',
      'Try It Out: Knowledge',
    ],
  },
  {
    part: 'Section 4',
    title: 'Working Memory',
    lessons: [
      'Working Memory',
      'Try It Out: Working Memory',
    ],
  },
  {
    part: 'Section 5',
    title: 'Steerability',
    lessons: [
      'Steerability',
      'Try It Out: Steerability',
    ],
  },
  {
    part: 'Section 6',
    title: 'Putting It All Together & Next Steps',
    lessons: [
      'When Properties Collide',
      'Next Steps',
      '📝 Course Quiz',
    ],
  },
];

const TROUBLESHOOTING = [
  { q: 'I cannot open the course link.', a: 'Try another browser, disable VPN or ad blockers, or search for "AI capabilities and limitations Claude Academy". The direct link is https://academy.claude.com/courses/ai-capabilities-and-limitations.' },
  { q: 'I did not receive the account verification email.', a: 'Check spam and promotions folders, wait a few minutes, then request the email again. Ensure the address has no typos.' },
  { q: 'A lesson will not mark as complete.', a: 'Scroll to the bottom of the lesson, finish any embedded video, and click the Next / Continue button. Refresh the page and check the progress bar.' },
  { q: 'I failed the Course Quiz.', a: 'Review the lesson that the failed question came from using your notes, then retake the quiz. There is no limit on attempts.' },
  { q: 'My name on the badge is wrong.', a: 'Fix your name in Claude account settings, then check if the badge updates. If not, contact Academy support or tell your teacher before submitting.' },
  { q: 'Can I use a phone?', a: 'Yes for reading and watching, but a laptop is better for the "Try It Out" activities and for taking the quiz.' },
];

export default function GenAiAssessment3({ studentName, onBackToAssessments }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [copiedSubmissionUrl, setCopiedSubmissionUrl] = useState(false);

  const handleCopySubmissionUrl = async () => {
    try {
      await navigator.clipboard.writeText(AI_CAPABILITIES_SUBMISSION_FORM_URL);
      setCopiedSubmissionUrl(true);
      setTimeout(() => setCopiedSubmissionUrl(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = AI_CAPABILITIES_SUBMISSION_FORM_URL;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedSubmissionUrl(true);
      setTimeout(() => setCopiedSubmissionUrl(false), 2000);
    }
  };

  /* ── shared card style ── */
  const card = {
    background: 'var(--color-bg-surface)',
    border: '1px solid var(--color-border-default)',
    borderRadius: 12,
    padding: '1.25rem 1.5rem',
    marginBottom: '1rem',
  };

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>

      {/* ── Back button ── */}
      <button
        onClick={onBackToAssessments}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          background: 'none', border: 'none', cursor: 'pointer',
          color: PURPLE, fontWeight: 600, fontSize: '0.9rem',
          padding: '0.3rem 0', marginBottom: '1.25rem',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Assessments
      </button>

      {/* ── Hero ── */}
      <div style={{
        background: `linear-gradient(135deg, ${NAVY} 0%, #2D1B69 100%)`,
        borderRadius: 16, padding: '2rem 2rem 1.75rem', marginBottom: '1.5rem',
        color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        {/* decorative circles */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(139,92,246,0.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -30, left: '40%', width: 120, height: 120, borderRadius: '50%', background: 'rgba(139,92,246,0.10)', pointerEvents: 'none' }} />

        {/* badge pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          background: 'rgba(139,92,246,0.25)', borderRadius: 20,
          padding: '0.3rem 0.85rem', fontSize: '0.78rem', fontWeight: 700,
          letterSpacing: '0.04em', textTransform: 'uppercase', color: '#C4B5FD',
          marginBottom: '1rem',
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></svg>
          Assessment 03 of 04 · Generative AI Track
        </div>

        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, margin: '0 0 0.3rem', lineHeight: 1.15, color: '#fff' }}>
          AI Capabilities and Limitations
        </h1>
        <p style={{ fontSize: '1.0625rem', color: '#C4B5FD', margin: '0 0 1.25rem', fontWeight: 500 }}>
          Student Guide &amp; Completion Verification
        </p>

        {/* meta pills row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.4rem' }}>
          {[
            { icon: '🎓', text: 'AI Capabilities &amp; Limitations · Claude Academy' },
            { icon: '💸', text: 'Free' },
            { icon: '⏱️', text: '~3.5 hours (pauseable)' },
            { icon: '📚', text: '13 Lessons + 1 Quiz' },
            { icon: '👤', text: 'Prepared for Students' },
          ].map(({ icon, text }) => (
            <span key={text} style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
              background: 'rgba(255,255,255,0.10)', borderRadius: 20,
              padding: '0.3rem 0.75rem', fontSize: '0.8rem', color: '#E9D5FF',
            }}
              dangerouslySetInnerHTML={{ __html: `${icon} ${text}` }}
            />
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a
            href="https://academy.claude.com/courses/ai-capabilities-and-limitations"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
              background: PURPLE, color: '#fff',
              padding: '0.6rem 1.2rem', borderRadius: 8, fontWeight: 700,
              fontSize: '0.9rem', textDecoration: 'none',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
            Open Course
          </a>
          <a
            href={AI_CAPABILITIES_SUBMISSION_FORM_URL}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
              background: 'rgba(255,255,255,0.12)', color: '#E9D5FF',
              padding: '0.6rem 1.2rem', borderRadius: 8, fontWeight: 700,
              fontSize: '0.9rem', textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.20)',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
            Submit Badge (Google Form)
          </a>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 1 — What is this assignment?
      ══════════════════════════════════════════════════════ */}
      <div style={card}>
        <SectionTitle icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        }>1. What is this assignment?</SectionTitle>

        <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
          You are being asked to complete <strong>AI Capabilities and Limitations</strong>, a beginner course on <strong>Claude Academy</strong> — the free learning site of Anthropic (the company that makes the AI assistant Claude).
        </p>
        <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
          Most people who use AI tools have the same experience: the AI writes a great summary in seconds, then confidently invents a source that does not exist. This course gives you a simple mental model that explains why this happens, so you know when to trust AI, when to double-check it, and how to fix a bad answer.
        </p>
        <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
          The course is built around four ideas:
        </p>
        <ol style={{ paddingLeft: '1.25rem', margin: '0 0 0.75rem' }}>
          {[
            'Next Token Prediction — where an AI\'s answers come from.',
            'Knowledge — what the AI actually knows, and why it can be confidently wrong.',
            'Working Memory — what the AI can pay attention to right now, and what falls off the edge.',
            'Steerability — how much control your instructions really give you.',
          ].map((item, i) => (
            <li key={i} style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '0.3rem' }}>
              {item}
            </li>
          ))}
        </ol>
        <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>
          No technical background and no earlier AI experience are needed. When you pass the course quiz, you earn a <strong>completion badge</strong>. That badge is what you submit to prove you finished.
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 2 — Before you start
      ══════════════════════════════════════════════════════ */}
      <div style={card}>
        <SectionTitle icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
        }>2. Before you start (checklist)</SectionTitle>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <CheckItem>A computer (best) or phone with a stable internet connection</CheckItem>
          <CheckItem>A modern browser such as Chrome, Edge, Firefox or Safari</CheckItem>
          <CheckItem>An email address you can open, or a Google account, to create a Claude account</CheckItem>
          <CheckItem>About 3.5 hours in total. You do not have to finish in one sitting — your progress is saved</CheckItem>
          <CheckItem>Your full real name, exactly as it should appear on the badge (see Step 2 in the instructions)</CheckItem>
        </ul>

        <div style={{ marginTop: '0.75rem', background: PURPLE_SUBTLE, borderRadius: 8, padding: '0.65rem 0.9rem', border: `1px solid ${PURPLE_BORDER}` }}>
          <p style={{ margin: 0, fontSize: '0.875rem', color: PURPLE, fontWeight: 600 }}>
            💡 No technical background or AI experience required. The course is for complete beginners.
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 3 — Step-by-step instructions
      ══════════════════════════════════════════════════════ */}
      <div style={card}>
        <SectionTitle icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
        }>3. Step-by-step instructions</SectionTitle>

        {/* Step 1 */}
        <div style={{ display: 'flex', gap: '0.85rem', marginBottom: '1.1rem', alignItems: 'flex-start' }}>
          <StepBadge n={1} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
              Create a free Claude account
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: 0 }}>
              Claude Academy uses your Claude account to sign you in and save your progress. Go to{' '}
              <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" style={{ color: PURPLE }}>claude.ai</a>,
              click <strong>Sign up</strong>, and verify your email. Fill in any profile questions and accept the terms.
              A <strong>free account</strong> is enough. If you already have a Claude account, skip this step.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div style={{ display: 'flex', gap: '0.85rem', marginBottom: '1.1rem', alignItems: 'flex-start' }}>
          <StepBadge n={2} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
              Check your name before you begin
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: '0 0 0.5rem' }}>
              The badge shows the name saved on your account. If it is wrong or only a nickname, your teacher may not be able to match the badge to you.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <CheckItem>In Claude, open your profile or account settings</CheckItem>
              <CheckItem>Make sure your first name and last name are your real full name, spelled correctly</CheckItem>
              <CheckItem>Save the change</CheckItem>
            </ul>
          </div>
        </div>

        {/* Step 3 */}
        <div style={{ display: 'flex', gap: '0.85rem', marginBottom: '1.1rem', alignItems: 'flex-start' }}>
          <StepBadge n={3} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
              Open the course and sign in
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <CheckItem>Go to <a href="https://academy.claude.com/courses/ai-capabilities-and-limitations" target="_blank" rel="noopener noreferrer" style={{ color: PURPLE }}>academy.claude.com/courses/ai-capabilities-and-limitations</a></CheckItem>
              <CheckItem>Click <strong>Sign in to save progress</strong> and sign in with the same Claude account from Step 1</CheckItem>
              <CheckItem>Click <strong>Start course</strong>. Always sign in first — otherwise your progress may not be saved and you will not earn the badge</CheckItem>
            </ul>
          </div>
        </div>

        {/* Step 4 — Curriculum */}
        <div style={{ display: 'flex', gap: '0.85rem', marginBottom: '1.1rem', alignItems: 'flex-start' }}>
          <StepBadge n={4} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
              Complete all 13 lessons in order
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: '0 0 0.75rem' }}>
              The course has six sections. Work through them in order (titles may be slightly updated by Anthropic):
            </p>

            {/* Curriculum grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.6rem', marginBottom: '0.75rem' }}>
              {CURRICULUM.map(({ part, title, lessons }) => (
                <div key={part} style={{
                  background: 'var(--color-bg-base)', border: `1px solid ${PURPLE_BORDER}`,
                  borderRadius: 10, padding: '0.75rem 0.9rem',
                }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: PURPLE, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
                    {part}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text-primary)', marginBottom: '0.4rem' }}>
                    {title}
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {lessons.map((l) => (
                      <li key={l} style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '0.15rem', paddingLeft: '0.75rem', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, color: PURPLE }}>·</span>
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <InfoCard title="How to get the most from each lesson" accent={PURPLE}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <CheckItem>Read or watch the whole lesson. Do not skip ahead.</CheckItem>
                <CheckItem>In the "Try It Out" lessons, actually do the exercise — these hands-on activities help you pass the quiz.</CheckItem>
                <CheckItem>Move to the next lesson with the <strong>Next / Continue</strong> button so your progress is recorded.</CheckItem>
                <CheckItem>Keep short notes in your own words for each of the four ideas (Next Token Prediction, Knowledge, Working Memory, Steerability).</CheckItem>
              </ul>
            </InfoCard>
          </div>
        </div>

        {/* Step 5 */}
        <div style={{ display: 'flex', gap: '0.85rem', marginBottom: '1.1rem', alignItems: 'flex-start' }}>
          <StepBadge n={5} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
              Pass the Course Quiz
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <CheckItem>The last item is the <strong>Course Quiz</strong>. Take it only after you have finished all 13 lessons.</CheckItem>
              <CheckItem>Read each question carefully and use your notes.</CheckItem>
              <CheckItem>You must pass the quiz to earn the badge. If you do not pass, review the lesson the question came from and try again — there is no limit on attempts.</CheckItem>
            </ul>
          </div>
        </div>

        {/* Step 6 */}
        <div style={{ display: 'flex', gap: '0.85rem', marginBottom: '1.1rem', alignItems: 'flex-start' }}>
          <StepBadge n={6} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
              Get your completion badge
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <CheckItem>After you pass the quiz, the platform awards you a <strong>completion badge</strong>.</CheckItem>
              <CheckItem>Open the badge page and check that your name is correct.</CheckItem>
              <CheckItem>Find the <strong>Share</strong> or <strong>Copy link</strong> option and copy the public badge URL — this is what you will submit.</CheckItem>
              <CheckItem>Take a screenshot of the badge page showing your name, the course title, and the completion date.</CheckItem>
            </ul>
          </div>
        </div>

        {/* Step 7 */}
        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
          <StepBadge n={7} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
              Submit your proof of completion
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: '0 0 0.5rem' }}>
              Open the submission form (link in Section 6) and provide all four of the following:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <CheckItem>Your <strong>full name</strong> and <strong>roll number / student ID</strong></CheckItem>
              <CheckItem>The public <strong>badge link</strong> (the share / verification URL from Step 6)</CheckItem>
              <CheckItem>A <strong>screenshot of the badge page</strong> clearly showing your name, course title, and completion date</CheckItem>
              <CheckItem>A <strong>screenshot of the course page</strong> showing all lessons and the quiz marked as completed (every lesson ticked)</CheckItem>
            </ul>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 4 — Reflection questions
      ══════════════════════════════════════════════════════ */}


      {/* ══════════════════════════════════════════════════════
          SECTION 5 — Troubleshooting
      ══════════════════════════════════════════════════════ */}
      <div style={card}>
        <SectionTitle icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
        }>4. Troubleshooting</SectionTitle>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {TROUBLESHOOTING.map(({ q, a }, i) => (
            <div key={i} style={{
              background: 'var(--color-bg-base)', border: '1px solid var(--color-border-default)',
              borderRadius: 8, overflow: 'hidden',
            }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.7rem 0.9rem', background: 'none', border: 'none', cursor: 'pointer',
                  fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)', textAlign: 'left',
                }}
              >
                <span>{q}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 0.9rem 0.75rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
                  {a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 6 — Academic honesty
      ══════════════════════════════════════════════════════ */}
      <div style={card}>
        <SectionTitle icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
        }>5. Academic honesty</SectionTitle>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <CheckItem>Complete every lesson and the quiz yourself. Do not share your screen, account, or quiz answers with others.</CheckItem>
          <CheckItem>The badge is personal. It records your name and your account. Do not submit someone else's badge as your own.</CheckItem>
          <CheckItem>Using Claude to practise the activities during the course is explicitly encouraged and is not a violation — it is the point of the course.</CheckItem>
          <CheckItem>Submitting a fake badge, a screenshot that has been edited, or a link to someone else's badge is academic misconduct and will be treated as plagiarism.</CheckItem>
        </ul>
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 7 — Submission Form CTA
      ══════════════════════════════════════════════════════ */}
      <div style={{
        background: `linear-gradient(135deg, ${NAVY} 0%, #2D1B69 100%)`,
        borderRadius: 16, padding: '1.75rem 2rem', color: '#fff',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          background: 'rgba(139,92,246,0.3)', borderRadius: 20,
          padding: '0.3rem 0.85rem', fontSize: '0.78rem', fontWeight: 700,
          letterSpacing: '0.04em', textTransform: 'uppercase', color: '#C4B5FD',
          marginBottom: '0.9rem',
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
          Official Submission
        </div>

        <h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: 800, margin: '0 0 0.5rem', color: '#fff' }}>
          Ready to submit your badge?
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#C4B5FD', margin: '0 0 1.25rem', lineHeight: 1.6, maxWidth: '54ch', marginLeft: 'auto', marginRight: 'auto' }}>
          Make sure you have your badge link, badge screenshot, and course completion screenshot ready before opening the form.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href={AI_CAPABILITIES_SUBMISSION_FORM_URL}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: PURPLE, color: '#fff',
              padding: '0.7rem 1.5rem', borderRadius: 8, fontWeight: 700,
              fontSize: '0.9375rem', textDecoration: 'none',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
            Open Submission Form
          </a>
          <button
            onClick={handleCopySubmissionUrl}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(255,255,255,0.12)', color: '#E9D5FF',
              padding: '0.7rem 1.5rem', borderRadius: 8, fontWeight: 700,
              fontSize: '0.9375rem', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.20)',
            }}
          >
            {copiedSubmissionUrl ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                Copy Form Link
              </>
            )}
          </button>
          <a
            href="https://academy.claude.com/courses/ai-capabilities-and-limitations"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(255,255,255,0.12)', color: '#E9D5FF',
              padding: '0.7rem 1.5rem', borderRadius: 8, fontWeight: 700,
              fontSize: '0.9375rem', textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.20)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
            Open Course
          </a>
        </div>
      </div>

    </div>
  );
}

