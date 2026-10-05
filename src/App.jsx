import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import FormfacadeEmbed from "@formfacade/embed-react";
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
    localStorage.setItem('niat_react_theme', theme);
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

            {/* Formfacade Submission Form Embed */}
            <section id="submission-form">
              <div className="wrap">
                <div className="section-header">
                  <h2>Portfolio Submission Form</h2>
                  <p>Submit your live portfolio URL, public GitHub repository, and full-page PDF screenshot below.</p>
                </div>
                <div className="form-embed-wrapper">
                  <FormfacadeEmbed
                    formFacadeURL="https://formfacade.com/include/100827912670384202283/form/1FAIpQLScvoCaCB1FQX4m6qwJdmyY_4mNClmUXTmp8H9LW46C02iPiAg/classic.js/?div=ff-compose"
                    onSubmitForm={() => console.log('Form submitted')}
                  />
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
