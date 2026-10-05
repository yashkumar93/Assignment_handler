import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StructureSection from './components/StructureSection';
import RequirementsSection from './components/RequirementsSection';
import RubricSection from './components/RubricSection';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import Skiper8 from './components/ui/skiper-ui/skiper8';
import GitHubGuide from './components/GitHubGuide';
import ScreenshotGuide from './components/ScreenshotGuide';
import StudentNameModal from './components/StudentNameModal';

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

  const [showPreloader, setShowPreloader] = useState(() => {
    if (typeof window !== 'undefined') {
      // Returning user with name already in cache sees preloader immediately
      return Boolean(localStorage.getItem('niat_student_name'));
    }
    return false;
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('niat_react_theme');
    if (saved) return saved;
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash.includes('github-guide')) return 'github-guide';
      if (window.location.hash.includes('pdf-guide')) return 'pdf-guide';
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
      } else if (window.location.hash.includes('html-css')) {
        setCurrentView('assignment');
      } else if (!window.location.hash) {
        setCurrentView('landing');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem('niat_react_theme', theme);
    } catch (e) {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSaveStudentName = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setStudentName(trimmed);
    try {
      localStorage.setItem('niat_student_name', trimmed);
    } catch (e) {}

    setShowNameModal(false);
    setShowPreloader(true);
  };

  const handleSelectTrack = (track) => {
    if (track === 'assignment' || track === 'html-css') {
      setCurrentView('assignment');
      window.location.hash = 'html-css';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenGithubGuide = () => {
    setCurrentView('github-guide');
    window.location.hash = 'github-guide';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPdfGuide = () => {
    setCurrentView('pdf-guide');
    window.location.hash = 'pdf-guide';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToAssignment = () => {
    setCurrentView('assignment');
    window.location.hash = 'html-css';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Personalized words for the Skiper8 loading animation
  const preloaderWords = studentName
    ? ['Hello', 'Welcome', studentName, 'Portfolio Assignment']
    : ['Hello', 'Welcome', 'Portfolio Assignment'];

  return (
    <div className="app-container">
      {/* First-time entry Name Onboarding Modal (No skip, required input) */}
      <StudentNameModal
        isOpen={showNameModal}
        onSubmit={handleSaveStudentName}
      />

      {/* Loading Animation with Personalized Student Name */}
      <AnimatePresence mode="wait">
        {showPreloader && (
          <Skiper8
            words={preloaderWords}
            onComplete={() => setShowPreloader(false)}
          />
        )}
      </AnimatePresence>

      {currentView === 'landing' ? (
        <LandingPage
          onSelectTrack={handleSelectTrack}
          studentName={studentName}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      ) : currentView === 'github-guide' ? (
        <>
          <Navbar
            onBackToHome={handleBackToLanding}
            onBackToAssignment={handleBackToAssignment}
            view="github-guide"
            studentName={studentName}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
          <main id="top">
            <GitHubGuide
              onBackToAssignment={handleBackToAssignment}
              studentName={studentName}
            />
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
            studentName={studentName}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
          <main id="top">
            <ScreenshotGuide
              onBackToAssignment={handleBackToAssignment}
              studentName={studentName}
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
            studentName={studentName}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
          <main id="top">
            <Hero
              onBackToHome={handleBackToLanding}
              studentName={studentName}
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
                      <span>Open Google Form</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-tertiary)' }}>
                      Opens Google Form in a new tab
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
    </div>
  );
}
