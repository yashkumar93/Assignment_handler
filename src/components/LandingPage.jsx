import React, { useState, useEffect } from 'react';
import SkipperCanvas from './SkipperCanvas';
import BrandLogo from './BrandLogo';
import OnlineClipboardModal from './OnlineClipboardModal';
import { isSupabaseConfigured, fetchDbLinks, subscribeToClassLinks, subscribeToClipboardBroadcast } from '../lib/supabase';

export default function LandingPage({ onSelectTrack, studentName, onOpenNameModal, onOpenClipboard }) {
  const [showClipboard, setShowClipboard] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [hasNewDrop, setHasNewDrop] = useState(false);

  const handleOpenClipboard = () => {
    setHasNewDrop(false);
    if (onOpenClipboard) {
      onOpenClipboard();
    } else {
      setShowClipboard(true);
    }
  };

  // Sync count of clipboard items in real-time
  useEffect(() => {
    let isMounted = true;

    async function loadCount() {
      if (isSupabaseConfigured) {
        const { data } = await fetchDbLinks();
        if (isMounted && data) {
          setItemCount(data.length);
        }
      }
    }
    loadCount();

    const unsubscribeDb = subscribeToClassLinks((payload) => {
      if (!isMounted) return;
      if (payload.eventType === 'INSERT') {
        setItemCount((prev) => prev + 1);
        setHasNewDrop(true);
        setTimeout(() => setHasNewDrop(false), 4000);
      } else if (payload.eventType === 'DELETE') {
        setItemCount((prev) => Math.max(0, prev - 1));
      }
    });

    const unsubscribeBroadcast = subscribeToClipboardBroadcast(() => {
      if (!isMounted) return;
      setItemCount((prev) => prev + 1);
      setHasNewDrop(true);
      setTimeout(() => setHasNewDrop(false), 4000);
    });

    return () => {
      isMounted = false;
      unsubscribeDb();
      unsubscribeBroadcast();
    };
  }, []);

  return (
    <div className="landing-wrapper">
      {/* Skipper Animated Walking Crowd Canvas Background */}
      <SkipperCanvas className="skipper-canvas" />

      {/* Ambient background glow */}
      <div className="landing-glow" aria-hidden="true" />

      {/* Top Header Navbar */}
      <header className="landing-header">
        <div className="nav-brand">
          <BrandLogo size={26} />
          <span>Assignment Portal</span>
          {studentName ? (
            <button
              type="button"
              className="pill"
              onClick={onOpenNameModal}
              title="Click to switch student"
              style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                marginInlineStart: '0.5rem',
                cursor: onOpenNameModal ? 'pointer' : 'default',
                background: 'transparent',
                border: '1px solid var(--color-border-subtle)',
                color: 'inherit'
              }}
            >
              {studentName}
            </button>
          ) : (
            onOpenNameModal && (
              <button
                type="button"
                className="pill"
                onClick={onOpenNameModal}
                title="Personalize with your name"
                style={{
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  marginInlineStart: '0.5rem',
                  cursor: 'pointer',
                  background: 'rgba(59, 130, 246, 0.08)',
                  borderColor: 'rgba(59, 130, 246, 0.25)',
                  color: '#2563EB'
                }}
              >
                Set Name
              </button>
            )
          )}
        </div>

        {/* Upper Right Navbar Action: Online Clipboard */}
        <div className="landing-header-actions">
          <button
            type="button"
            className={`landing-clipboard-nav-btn ${hasNewDrop ? 'has-new-drop' : ''}`}
            onClick={handleOpenClipboard}
            title="Open Live Online Clipboard"
            aria-label="Open Online Clipboard"
            id="btn-online-clipboard"
          >
            <span className="landing-clipboard-nav-label">Live Clipboard</span>

            {itemCount > 0 && (
              <span className="landing-clipboard-nav-badge">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Track Selection */}
      <main className="landing-buttons-wrapper">
        <div className="landing-buttons-group">
          {/* Button 1: HTML & CSS */}
          <button
            type="button"
            className="landing-track-btn landing-track-btn-primary"
            onClick={() => onSelectTrack('assignment')}
            id="btn-html-css-track"
          >
            <span className="track-btn-text">HTML & CSS</span>
          </button>

          {/* Button 2: Generative AI */}
          <button
            type="button"
            className="landing-track-btn landing-track-btn-secondary"
            onClick={() => onSelectTrack('genai')}
            id="btn-genai-track"
          >
            <span className="track-btn-text">Generative AI</span>
            <span className="track-btn-badge" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6', borderColor: 'rgba(139, 92, 246, 0.3)' }}>Active</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="landing-footer">

      </footer>

      {/* Realtime Online Clipboard Modal (Fallback if not handled globally) */}
      {!onOpenClipboard && (
        <OnlineClipboardModal
          isOpen={showClipboard}
          onClose={() => setShowClipboard(false)}
          studentName={studentName}
        />
      )}
    </div>
  );
}
