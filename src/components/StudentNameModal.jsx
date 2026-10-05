import React, { useState, useEffect, useRef } from 'react';

export default function StudentNameModal({
  isOpen,
  onSubmit,
}) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setError('');
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 80);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter your name to continue.');
      return;
    }
    if (trimmed.length < 2) {
      setError('Name should be at least 2 characters long.');
      return;
    }
    setError('');
    onSubmit(trimmed);
  };

  return (
    <div
      className="name-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="name-modal-title"
    >
      <div className="name-modal-card">
        <div className="name-modal-badge">
          <span>👋 Welcome</span>
        </div>

        <h2 id="name-modal-title" className="name-modal-title">
          What's your name?
        </h2>

        <p className="name-modal-desc">
          Please enter your name to access your portfolio assignment requirements, GitHub guide, and submission links.
        </p>

        <form onSubmit={handleSubmit} className="name-modal-form">
          <div className="name-field-group">
            <label htmlFor="student-name-input" className="name-field-label">
              Your Full Name <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              id="student-name-input"
              ref={inputRef}
              type="text"
              className={`name-input ${error ? 'has-error' : ''}`}
              placeholder="e.g. Yash Kumar"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              autoComplete="name"
              maxLength={60}
              required
            />
            {error ? (
              <span className="name-field-error" role="alert">{error}</span>
            ) : (
              <span className="name-field-hint">
                Saved in your browser cache. You won't have to enter it again.
              </span>
            )}
          </div>

          <div className="name-modal-actions">
            <button
              type="submit"
              className="btn btn-primary name-submit-btn"
              disabled={!name.trim()}
            >
              <span>Continue & Get Started →</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
