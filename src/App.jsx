import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StructureSection from './components/StructureSection';
import RequirementsSection from './components/RequirementsSection';
import RubricSection from './components/RubricSection';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import GenAiSection from './components/GenAiSection';
import GenAiAssessment2 from './components/GenAiAssessment2';
import GenAiAssessment3 from './components/GenAiAssessment3';
import Skiper8 from './components/ui/skiper-ui/skiper8';
import StudentNameModal from './components/StudentNameModal';
import OnlineClipboardModal from './components/OnlineClipboardModal';
import TrackAssessmentPage from './components/TrackAssessmentPage';
import CoverPageBuilder from './components/CoverPageBuilder';

// Code-split heavy reference guides (downloaded on-demand only when student navigates to them)
const GitHubGuide = lazy(() => import('./components/GitHubGuide'));
const ScreenshotGuide = lazy(() => import('./components/ScreenshotGuide'));

const GuideLoadingFallback = () => (
  <div className="wrap" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-tertiary)', fontSize: '0.9375rem' }}>
    Loading guide...
  </div>
);

export default function App() {
  const [studentName, setStudentName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('niat_student_name') || '';
    }
    return '';
  });

  const [showNameModal, setShowNameModal] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('niat_student_name');
    }
    return false;
  });

  const [showPreloader, setShowPreloader] = useState(false);

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('niat_react_theme');
    if (saved) return saved;
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // selectedTrack: 'html-css' | 'genai' — remembered when on track-select view
  const [selectedAssessment, setSelectedAssessment] = useState(1);

  const [selectedTrack, setSelectedTrack] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash.includes('genai')) return 'genai';
    }
    return 'html-css';
  });

  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash.includes('github-guide')) return 'github-guide';
      if (window.location.hash.includes('pdf-guide')) return 'pdf-guide';
      if (window.location.hash.includes('genai-assessment-select')) return 'genai-track-select';
      if (window.location.hash.includes('html-css-assessment-select')) return 'html-css-track-select';
      if (window.location.hash.includes('genai-assessment-3')) return 'genai-assessment-3';
      if (window.location.hash.includes('genai-assessment-2')) return 'genai-assessment-2';
      if (window.location.hash.includes('genai')) return 'genai';
      if (window.location.hash.includes('html-css')) return 'assignment';
    }
    return 'landing';
  });

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash.includes('github-guide')) {
        setCurrentView('github-guide');
      } else if (window.location.hash.includes('pdf-guide')) {
        setCurrentView('pdf-guide');
      } else if (window.location.hash.includes('genai-assessment-select')) {
        setSelectedTrack('genai');
        setCurrentView('genai-track-select');
      } else if (window.location.hash.includes('html-css-assessment-select')) {
        setSelectedTrack('html-css');
        setCurrentView('html-css-track-select');
      } else if (window.location.hash.includes('genai-assessment-3')) {
        setSelectedTrack('genai');
        setSelectedAssessment(3);
        setCurrentView('genai-assessment-3');
      } else if (window.location.hash.includes('genai-assessment-2')) {
        setSelectedTrack('genai');
        setCurrentView('genai-assessment-2');
      } else if (window.location.hash.includes('genai')) {
        setSelectedTrack('genai');
        setCurrentView('genai');
      } else if (window.location.hash.includes('html-css')) {
        setSelectedTrack('html-css');
        setCurrentView('assignment');
      } else {
        setCurrentView('landing');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    const activeTheme = currentView === 'landing' ? 'light' : theme;
    document.documentElement.setAttribute('data-theme', activeTheme);
    document.documentElement.classList.toggle('dark', activeTheme === 'dark');
    try {
      localStorage.setItem('niat_react_theme', theme);
    } catch (e) { }
  }, [theme, currentView]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSaveStudentName = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setStudentName(trimmed);
    try {
      localStorage.setItem('niat_student_name', trimmed);
    } catch (e) { }

    setShowNameModal(false);
    setShowPreloader(true);
  };

  const handleUpdateStudentName = (name) => {
    const trimmed = (name || '').trim();
    if (!trimmed) return;
    setStudentName(trimmed);
    try {
      localStorage.setItem('niat_student_name', trimmed);
    } catch (e) { }
  };

  const handleSelectTrack = (track) => {
    if (track === 'assignment' || track === 'html-css') {
      setSelectedTrack('html-css');
      setCurrentView('html-css-track-select');
      window.location.hash = 'html-css-assessment-select';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (track === 'genai') {
      setSelectedTrack('genai');
      setCurrentView('genai-track-select');
      window.location.hash = 'genai-assessment-select';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Called from TrackAssessmentPage when a specific assessment card is clicked
  const handleSelectAssessment = (track, assessmentNumber) => {
    setSelectedAssessment(assessmentNumber);
    if (track === 'html-css') {
      if (assessmentNumber !== 1) return; // Only assessment 1 active for html-css
      setCurrentView('assignment');
      window.location.hash = 'html-css';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (track === 'genai') {
      if (assessmentNumber === 1) {
        setCurrentView('genai');
        window.location.hash = 'genai';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (assessmentNumber === 2) {
        setCurrentView('genai-assessment-2');
        window.location.hash = 'genai-assessment-2';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (assessmentNumber === 3) {
        setCurrentView('genai-assessment-3');
        window.location.hash = 'genai-assessment-3';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Back from assessment page → track selection page
  const handleBackToTrackSelect = () => {
    if (selectedTrack === 'genai') {
      setCurrentView('genai-track-select');
      window.location.hash = 'genai-assessment-select';
    } else {
      setCurrentView('html-css-track-select');
      window.location.hash = 'html-css-assessment-select';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [guideReturnTrack, setGuideReturnTrack] = useState('assignment');
  const [showClipboardModal, setShowClipboardModal] = useState(false);

  const handleOpenGithubGuide = (origin = 'assignment') => {
    setGuideReturnTrack(origin);
    setCurrentView('github-guide');
    window.location.hash = 'github-guide';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPdfGuide = (origin = 'assignment') => {
    setGuideReturnTrack(origin);
    setCurrentView('pdf-guide');
    window.location.hash = 'pdf-guide';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToAssignment = () => {
    if (guideReturnTrack === 'genai') {
      setCurrentView('genai');
      window.location.hash = 'genai';
    } else {
      setCurrentView('assignment');
      window.location.hash = 'html-css';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    if (window.location.hash) {
      window.location.hash = '';
      history.replaceState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Personalized words for the Skiper8 loading animation
  const preloaderWords = studentName
    ? ['Hello', 'नमस्ते', 'Hola!', 'Bonjour', 'Ciao', 'Konnichiwa', 'Hallo', 'Olá', 'Welcome', studentName, 'Assignment Portal']
    : ['Hello', 'Welcome', 'Assignment Portal'];

  return (
    <div className="app-container">
      {/* First-time entry Name Onboarding Modal */}
      <StudentNameModal
        isOpen={showNameModal}
        onSubmit={handleSaveStudentName}
        onClose={() => setShowNameModal(false)}
      />

      {/* Loading Animation with Personalized Student Name */}
      <AnimatePresence mode="wait">
        {showPreloader && (
          <Skiper8
            words={preloaderWords}
            studentName={studentName}
            onComplete={() => setShowPreloader(false)}
          />
        )}
      </AnimatePresence>

      {currentView === 'landing' ? (
        <LandingPage
          onSelectTrack={handleSelectTrack}
          studentName={studentName}
          onOpenNameModal={() => setShowNameModal(true)}
          onOpenClipboard={() => setShowClipboardModal(true)}
        />
      ) : currentView === 'html-css-track-select' ? (
        <TrackAssessmentPage
          track="html-css"
          studentName={studentName}
          onSelectAssessment={(num) => handleSelectAssessment('html-css', num)}
          onBackToLanding={handleBackToLanding}
        />
      ) : currentView === 'genai-track-select' ? (
        <TrackAssessmentPage
          track="genai"
          studentName={studentName}
          onSelectAssessment={(num) => handleSelectAssessment('genai', num)}
          onBackToLanding={handleBackToLanding}
        />
      ) : currentView === 'github-guide' ? (
        <>
          <Navbar
            onBackToHome={handleBackToLanding}
            onBackToAssignment={handleBackToAssignment}
            view="github-guide"
            track={guideReturnTrack}
            studentName={studentName}
            theme={theme}
            onToggleTheme={toggleTheme}
            onOpenClipboard={() => setShowClipboardModal(true)}
          />
          <main id="top">
            <Suspense fallback={<GuideLoadingFallback />}>
              <GitHubGuide
                onBackToAssignment={handleBackToAssignment}
                studentName={studentName}
                initialTrack={guideReturnTrack}
              />
            </Suspense>
          </main>
          <Footer
            onBackToHome={handleBackToLanding}
            studentName={studentName}
          />
        </>
      ) : currentView === 'pdf-guide' ? (
        <>
          <Navbar
            onBackToHome={handleBackToLanding}
            onBackToAssignment={handleBackToAssignment}
            view="pdf-guide"
            track={guideReturnTrack}
            studentName={studentName}
            theme={theme}
            onToggleTheme={toggleTheme}
            onOpenClipboard={() => setShowClipboardModal(true)}
          />
          <main id="top">
            <Suspense fallback={<GuideLoadingFallback />}>
              <ScreenshotGuide
                onBackToAssignment={handleBackToAssignment}
                studentName={studentName}
                track={guideReturnTrack}
              />
            </Suspense>
          </main>
          <Footer
            onBackToHome={handleBackToLanding}
            studentName={studentName}
          />
        </>
      ) : currentView === 'genai-assessment-2' ? (
        <>
          <Navbar
            onBackToHome={handleBackToLanding}
            onBackToAssessments={handleBackToTrackSelect}
            studentName={studentName}
            theme={theme}
            onToggleTheme={toggleTheme}
            view="genai"
            onOpenClipboard={() => setShowClipboardModal(true)}
          />
          <main id="top">
            <GenAiAssessment2
              studentName={studentName}
              onBackToAssessments={handleBackToTrackSelect}
            />
          </main>
          <Footer
            onBackToHome={handleBackToLanding}
            studentName={studentName}
          />
        </>
      ) : currentView === 'genai-assessment-3' ? (
        <>
          <Navbar
            onBackToHome={handleBackToLanding}
            onBackToAssessments={handleBackToTrackSelect}
            studentName={studentName}
            theme={theme}
            onToggleTheme={toggleTheme}
            view="genai"
            onOpenClipboard={() => setShowClipboardModal(true)}
          />
          <main id="top">
            <GenAiAssessment3
              studentName={studentName}
              onBackToAssessments={handleBackToTrackSelect}
            />
          </main>
          <Footer
            onBackToHome={handleBackToLanding}
            studentName={studentName}
          />
        </>
      ) : currentView === 'genai' ? (
        <>
          <Navbar
            onBackToHome={handleBackToLanding}
            onBackToAssessments={handleBackToTrackSelect}
            studentName={studentName}
            theme={theme}
            onToggleTheme={toggleTheme}
            view="genai"
            onOpenClipboard={() => setShowClipboardModal(true)}
          />
          <main id="top">
            <GenAiSection
              studentName={studentName}
              onBackToHome={handleBackToLanding}
              onBackToAssessments={handleBackToTrackSelect}
              onUpdateStudentName={handleUpdateStudentName}
              onOpenGithubGuide={() => handleOpenGithubGuide('genai')}
              onOpenPdfGuide={() => handleOpenPdfGuide('genai')}
              assessmentNumber={selectedAssessment}
            />
          </main>
          <Footer
            onBackToHome={handleBackToLanding}
            studentName={studentName}
          />
        </>
      ) : (
        <>
          <Navbar
            onBackToHome={handleBackToLanding}
            onBackToAssessments={handleBackToTrackSelect}
            studentName={studentName}
            theme={theme}
            onToggleTheme={toggleTheme}
            view="assignment"
            onOpenClipboard={() => setShowClipboardModal(true)}
          />
          <main id="top">
            <Hero
              onBackToHome={handleBackToLanding}
              onBackToAssessments={handleBackToTrackSelect}
              studentName={studentName}
              assessmentNumber={selectedAssessment}
            />
            <StructureSection
              studentName={studentName}
            />
            <RequirementsSection
              onOpenGithubGuide={handleOpenGithubGuide}
              onOpenPdfGuide={handleOpenPdfGuide}
              studentName={studentName}
            />
            <RubricSection />

            {/* Cover Page Builder */}
            <section style={{ scrollMarginTop: '6rem' }} id="cover-page-builder-section">
              <div className="wrap">
                <CoverPageBuilder studentName={studentName} track="html-css" assessmentNumber={selectedAssessment} />
              </div>
            </section>

            {/* Official Google Form Submission Action */}
            <section id="submission-form" style={{ scrollMarginTop: '6rem' }}>
              <div className="wrap">
                <div className="submission-card">
                  <div className="pill" style={{ marginBottom: '1rem', width: 'fit-content' }}>
                    <span>Final Step · Official Submission</span>
                  </div>
                  <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', marginBottom: '0.75rem', fontWeight: 700 }}>
                    Ready to submit your portfolio?
                  </h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '64ch', marginBottom: '2rem' }}>
                    Make sure you have completed all 3 requirements before opening the submission form: your live deployed portfolio URL, your public GitHub repository link, and your exported full-page screenshot PDF.
                  </p>

                  <div className="submission-checklist-preview">
                    <div className="sub-check-pill">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>1. Live Deployment URL</span>
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
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBlockStart: '2rem' }}>
                    <a
                      href="https://forms.gle/1wHqKKibLkC69xBJ7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      id="btn-open-google-form"
                      style={{
                        minHeight: '48px',
                        paddingInline: '28px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.625rem',
                        textDecoration: 'none',
                      }}
                    >
                      <span style={{ color: 'inherit', fontWeight: 600 }}>Open Google Form</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: 'inherit' }}>
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-tertiary)' }}>
                      Opens Google Form in a new tab
                    </span>
                  </div>

                  <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <button
                      type="button"
                      onClick={handleBackToTrackSelect}
                      className="btn-icon"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '8px 16px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--color-text-secondary)',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border-default)',
                        background: 'var(--color-bg-surface)',
                        cursor: 'pointer'
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                      </svg>
                      <span>Choose Another Assessment</span>
                    </button>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-tertiary)' }}>
                      Want to switch tasks? Return to the assessment dashboard.
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </main>
          <Footer
            onBackToHome={handleBackToLanding}
            studentName={studentName}
          />
        </>
      )}

      {/* Global Realtime Online Clipboard Modal */}
      <OnlineClipboardModal
        isOpen={showClipboardModal}
        onClose={() => setShowClipboardModal(false)}
        studentName={studentName}
      />
    </div>
  );
}
