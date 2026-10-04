import React, { useState, useEffect } from 'react';
import FormfacadeEmbed from "@formfacade/embed-react";
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StructureSection from './components/StructureSection';
import RequirementsSection from './components/RequirementsSection';
import RubricSection from './components/RubricSection';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';

export default function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('niat_react_theme');
    if (saved) return saved;
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash.includes('html-css')) {
      return 'assignment';
    }
    return 'landing';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('niat_react_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSelectTrack = (track) => {
    if (track === 'assignment' || track === 'html-css') {
      setCurrentView('assignment');
      window.location.hash = 'html-css';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      {currentView === 'landing' ? (
        <LandingPage
          onSelectTrack={handleSelectTrack}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      ) : (
        <>
          <Navbar
            theme={theme}
            onToggleTheme={toggleTheme}
            onBackToHome={handleBackToLanding}
          />
          <main id="top">
            <Hero onBackToHome={handleBackToLanding} />
            <StructureSection theme={theme} onToggleTheme={toggleTheme} />
            <RequirementsSection />
            <RubricSection />

            {/* Formfacade Submission Form Embed */}
            <section id="submission-form">
              <div className="wrap">
                <div className="section-header">
                  <h2>Portfolio Submission Form</h2>
                  <p>Submit your live portfolio URL and public GitHub repository below.</p>
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
            theme={theme}
            onToggleTheme={toggleTheme}
            onBackToHome={handleBackToLanding}
          />
        </>
      )}
    </div>
  );
}
