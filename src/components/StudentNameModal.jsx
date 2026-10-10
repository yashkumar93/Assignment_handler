import React, { useState, useEffect, useRef } from 'react';
import { GENAI_PROJECTS } from '../data/genAiProjects';

export default function StudentNameModal({
  isOpen,
  onSubmit,
}) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setError('');
      setShowDropdown(false);
      setSelectedIndex(-1);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 80);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter students based on current input
  const query = name.trim().toLowerCase();
  const suggestions = query
    ? GENAI_PROJECTS.filter((p) =>
        p.studentName.toLowerCase().includes(query) ||
        p.title.toLowerCase().includes(query)
      ).slice(0, 6)
    : [];

  const handleSelectStudent = (studentName) => {
    setName(studentName);
    setError('');
    setShowDropdown(false);
    onSubmit(studentName);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        e.preventDefault();
        handleSelectStudent(suggestions[selectedIndex].studentName);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter or select your name to continue.');
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
          <span>✨ Welcome to the Assignment Portal</span>
        </div>

        <h2 id="name-modal-title" className="name-modal-title">
          What's your name?
        </h2>

        <p className="name-modal-desc">
          Enter or select your name to access your portfolio tasks and your assigned Generative AI project.
        </p>

        <form onSubmit={handleSubmit} className="name-modal-form">
          <div className="name-field-group" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="student-name-input" className="name-field-label">
                Your Full Name <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                48 students registered
              </span>
            </div>

            <div style={{ position: 'relative' }}>
              <input
                id="student-name-input"
                ref={inputRef}
                type="text"
                className={`name-input ${error ? 'has-error' : ''}`}
                placeholder="Type your name (e.g. Vicky Gupta, Tanish...)"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setShowDropdown(true);
                  setSelectedIndex(-1);
                  if (error) setError('');
                }}
                onFocus={() => {
                  if (name.trim()) setShowDropdown(true);
                }}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                maxLength={60}
                required
              />

              {/* Clear button if typed */}
              {name && (
                <button
                  type="button"
                  onClick={() => {
                    setName('');
                    setShowDropdown(false);
                    if (inputRef.current) inputRef.current.focus();
                  }}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-tertiary)',
                    cursor: 'pointer',
                    padding: '4px',
                    fontSize: '14px',
                    lineHeight: 1,
                  }}
                  aria-label="Clear name input"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown List */}
            {showDropdown && suggestions.length > 0 && (
              <ul
                ref={dropdownRef}
                className="name-autocomplete-dropdown"
                role="listbox"
                id="student-suggestions-list"
              >
                {suggestions.map((student, idx) => (
                  <li
                    key={student.sno}
                    role="option"
                    aria-selected={idx === selectedIndex}
                    className={`name-autocomplete-item ${idx === selectedIndex ? 'is-highlighted' : ''}`}
                    onClick={() => handleSelectStudent(student.studentName)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <div className="name-autocomplete-avatar">
                      {student.studentName.charAt(0).toUpperCase()}
                    </div>
                    <div className="name-autocomplete-info">
                      <div className="name-autocomplete-name">
                        {student.studentName}
                      </div>
                      <div className="name-autocomplete-project">
                        Project #{student.projectNo}: {student.title}
                      </div>
                    </div>
                    <span className="name-autocomplete-badge">
                      {student.category}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {error ? (
              <span className="name-field-error" role="alert">{error}</span>
            ) : (
              <span className="name-field-hint">
                💡 Start typing to pick your name directly from the class list.
              </span>
            )}
          </div>

          <div className="name-modal-actions">
            <button
              type="submit"
              className="btn btn-primary name-submit-btn"
              disabled={!name.trim()}
            >
              <span>Continue & Open Portal →</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
