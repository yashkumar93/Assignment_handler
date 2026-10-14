import React, { useState, useEffect, useRef } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  Trash2,
  Search,
  Sparkles,
  Link2,
  FileText,
  Pin,
  X,
  Lock,
  Unlock,
  Radio,
  Send,
  RefreshCw,
  Zap,
  Terminal,
  MessageSquare,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  Code2,
} from 'lucide-react';
import {
  isSupabaseConfigured,
  fetchDbLinks,
  insertDbLink,
  updateDbLink,
  deleteDbLink,
  clearAllDbLinks,
  subscribeToClassLinks,
  subscribeToClipboardBroadcast,
  broadcastClipboardDrop,
  fetchRemotePasscode,
} from '../lib/supabase';
import {
  detectLinkCategory,
  deriveTitleFromUrl,
  DEFAULT_ADMIN_CODE,
  ADMIN_AUTH_KEY,
  verifyAdminCode,
} from '../data/classLinks';

export default function OnlineClipboardModal({ isOpen, onClose, studentName }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRealtimeActive, setIsRealtimeActive] = useState(isSupabaseConfigured);
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminPinError, setAdminPinError] = useState('');
  const [remotePasscode, setRemotePasscode] = useState(null);

  // Search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'code' | 'link' | 'prompt' | 'text'
  const [copiedId, setCopiedId] = useState(null);

  // Admin paste form state
  const [dropContent, setDropContent] = useState('');
  const [dropTitle, setDropTitle] = useState('');
  const [dropType, setDropType] = useState('auto'); // 'auto' | 'code' | 'link' | 'prompt' | 'text'
  const [dropPinned, setDropPinned] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  const textareaRef = useRef(null);

  // Fetch initial links and sync with remote passcode
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      if (isSupabaseConfigured) {
        const { data } = await fetchDbLinks();
        if (isMounted && data) {
          setItems(data);
        }
        const remoteCode = await fetchRemotePasscode();
        if (isMounted && remoteCode) {
          setRemotePasscode(remoteCode);
        }
      }
      if (isMounted) setIsLoading(false);
    }

    loadData();

    // Subscribe to Supabase Postgres Changes
    const unsubscribeDb = subscribeToClassLinks((payload) => {
      if (!isMounted) return;
      setIsRealtimeActive(true);

      if (payload.eventType === 'INSERT' && payload.new) {
        const mapped = {
          id: String(payload.new.id),
          title: payload.new.title || 'Resource Link',
          url: payload.new.url,
          description: payload.new.description || '',
          tag: payload.new.tag || 'Live Resource',
          category: payload.new.category || 'web',
          pinned: Boolean(payload.new.pinned),
          addedAt: payload.new.added_at || 'Just now',
          createdAt: payload.new.created_at || null,
        };
        setItems((prev) => {
          if (prev.some((x) => x.id === mapped.id)) return prev;
          return [mapped, ...prev];
        });
      } else if (payload.eventType === 'UPDATE' && payload.new) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === String(payload.new.id)
              ? {
                  ...item,
                  title: payload.new.title,
                  url: payload.new.url,
                  description: payload.new.description,
                  tag: payload.new.tag,
                  category: payload.new.category,
                  pinned: Boolean(payload.new.pinned),
                }
              : item
          )
        );
      } else if (payload.eventType === 'DELETE' && payload.old) {
        setItems((prev) => prev.filter((x) => x.id !== String(payload.old.id)));
      }
    });

    // Subscribe to instant broadcast drops
    const unsubscribeBroadcast = subscribeToClipboardBroadcast((item) => {
      if (!isMounted || !item) return;
      setIsRealtimeActive(true);
      setItems((prev) => {
        if (prev.some((x) => x.id === item.id)) return prev;
        return [item, ...prev];
      });
    });

    return () => {
      isMounted = false;
      unsubscribeDb();
      unsubscribeBroadcast();
    };
  }, []);

  // Keyboard navigation: Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showAdminLogin) {
          setShowAdminLogin(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showAdminLogin, onClose]);

  // Focus textarea when admin mode is active
  useEffect(() => {
    if (isOpen && isAdmin && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen, isAdmin]);

  // Smart Auto-Detection
  const autoDetect = (content) => {
    const trimmed = (content || '').trim();
    if (!trimmed) {
      return { type: 'text', tag: 'Note', category: 'text', title: 'Clipboard Item' };
    }

    // 1. URL detection
    if (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}(\/.*)?$/i.test(trimmed.split('\n')[0].trim())
    ) {
      const url = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
      const cat = detectLinkCategory(url);
      const title = deriveTitleFromUrl(url);
      return { type: 'link', tag: 'Link', category: cat, title, url };
    }

    // 2. Code or terminal command detection
    const codeKeywords = [
      'const ', 'let ', 'var ', 'function ', 'import ', 'export ', 'class ',
      'git ', 'npm ', 'npx ', 'yarn ', 'pnpm ', 'docker ', 'curl ',
      '<div', '<html', '<script', 'SELECT ', 'INSERT ', 'UPDATE ',
      'def ', 'print(', 'console.log', '#!/bin/bash', 'sudo ', 'pip ', 'python ',
    ];
    const isCode =
      codeKeywords.some((kw) => trimmed.includes(kw)) ||
      (trimmed.includes('{') && trimmed.includes('}') && trimmed.includes('\n'));

    if (isCode) {
      const firstLine = trimmed.split('\n')[0].replace(/^[#//\s]+/, '').slice(0, 48);
      return {
        type: 'code',
        tag: 'Code',
        category: 'code',
        title: firstLine ? `Code: ${firstLine}` : 'Code Snippet',
        url: trimmed,
      };
    }

    // 3. Prompt detection
    const promptKeywords = ['prompt:', 'act as', 'system prompt', 'you are a', 'generate a', 'write a prompt'];
    const isPrompt = promptKeywords.some((kw) => trimmed.toLowerCase().includes(kw));
    if (isPrompt) {
      const firstLine = trimmed.split('\n')[0].replace(/^prompt:\s*/i, '').slice(0, 48);
      return {
        type: 'prompt',
        tag: 'Prompt',
        category: 'prompt',
        title: firstLine ? `Prompt: ${firstLine}...` : 'AI Prompt Template',
        url: trimmed,
      };
    }

    // 4. General Note / Text
    const firstLine = trimmed.split('\n')[0].slice(0, 48);
    return {
      type: 'text',
      tag: 'Note',
      category: 'text',
      title: firstLine || 'Clipboard Note',
      url: trimmed,
    };
  };

  // 1-Click Copy Handler
  const handleCopy = async (item) => {
    const textToCopy = item.url;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = textToCopy;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Admin Pin Authentication (No password in frontend strings or error messages)
  const handleVerifyAdminPin = (e) => {
    e.preventDefault();
    if (verifyAdminCode(adminPinInput, remotePasscode)) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPinInput('');
      setAdminPinError('');
      try {
        localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      } catch { }
    } else {
      setAdminPinError('Incorrect admin passcode. Access denied.');
    }
  };

  const handleLockAdmin = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem(ADMIN_AUTH_KEY);
    } catch { }
  };

  // Admin Drop Submission
  const handleDropItem = async (e) => {
    if (e) e.preventDefault();
    if (!dropContent.trim()) return;

    setIsPosting(true);
    const detection = autoDetect(dropContent);
    const finalType = dropType === 'auto' ? detection.type : dropType;
    const finalTag =
      dropType === 'auto'
        ? detection.tag
        : dropType === 'link'
        ? 'Link'
        : dropType === 'code'
        ? 'Code'
        : dropType === 'prompt'
        ? 'Prompt'
        : 'Note';

    const finalCategory = dropType === 'auto' ? detection.category : dropType;
    const finalTitle = dropTitle.trim() || detection.title;

    const newItem = {
      id: `clip_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      title: finalTitle,
      url: dropContent.trim(),
      description: finalType === 'code' ? 'Code / Terminal Command' : 'Shared live via Online Clipboard',
      tag: finalTag,
      category: finalCategory,
      pinned: dropPinned,
      addedAt: 'Just now',
    };

    // Optimistic update
    setItems((prev) => [newItem, ...prev.filter((x) => x.id !== newItem.id)]);

    // Save to Supabase and broadcast
    if (isSupabaseConfigured) {
      await insertDbLink(newItem);
      await broadcastClipboardDrop(newItem);
    }

    setDropContent('');
    setDropTitle('');
    setDropPinned(false);
    setIsPosting(false);
    setPostSuccess(true);
    setTimeout(() => setPostSuccess(false), 2200);
  };

  const handleDeleteItem = async (id, e) => {
    e.stopPropagation();
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (isSupabaseConfigured) {
      await deleteDbLink(id);
    }
  };

  const handleTogglePinItem = async (item, e) => {
    e.stopPropagation();
    const updated = !item.pinned;
    setItems((prev) =>
      prev.map((x) => (x.id === item.id ? { ...x, pinned: updated } : x))
    );
    if (isSupabaseConfigured) {
      await updateDbLink(item.id, { pinned: updated });
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all items from the live clipboard?')) {
      setItems([]);
      if (isSupabaseConfigured) {
        await clearAllDbLinks();
      }
    }
  };

  // Filtered and Sorted Items (Pinned first, then newest)
  const filteredItems = items
    .filter((item) => {
      // Type filter
      if (activeFilter === 'link') {
        const isUrl =
          item.category === 'link' ||
          item.category === 'web' ||
          item.category === 'github' ||
          item.category === 'figma' ||
          item.category === 'google' ||
          item.url.startsWith('http://') ||
          item.url.startsWith('https://');
        if (!isUrl) return false;
      }
      if (activeFilter === 'code' && item.category !== 'code' && !item.tag?.toLowerCase().includes('code')) return false;
      if (activeFilter === 'prompt' && item.category !== 'prompt' && !item.tag?.toLowerCase().includes('prompt')) return false;
      if (activeFilter === 'text' && item.category !== 'text' && item.category !== 'note' && item.tag?.toLowerCase().includes('code')) return false;

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title?.toLowerCase().includes(q) ||
        item.url?.toLowerCase().includes(q) ||
        item.tag?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });

  const liveDetection = dropContent ? autoDetect(dropContent) : null;

  if (!isOpen) return null;

  return (
    <div
      className="online-clipboard-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="clipboard-modal-title"
    >
      <div
        className="online-clipboard-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <header className="clipboard-panel-header">
          <div className="clipboard-title-group">
            <div>
              <div className="clipboard-heading-row">
                <h2 id="clipboard-modal-title" className="clipboard-modal-title">
                  Online Live Clipboard
                </h2>
                <div className={`clipboard-live-pill ${isRealtimeActive ? 'is-active' : ''}`}>
                  <span className="live-radio-dot" />
                  <span>{isRealtimeActive ? 'Realtime Connected' : 'Offline Mirror'}</span>
                </div>
                {items.length > 0 && (
                  <span className="clipboard-count-chip">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                )}
              </div>
              <p className="clipboard-subtitle">
                Instructor drops code snippets, URLs, commands, and prompts in real-time. Click <strong>Copy</strong> to copy any item.
              </p>
            </div>
          </div>

          <div className="clipboard-header-actions">
            {isAdmin ? (
              <button
                type="button"
                onClick={handleLockAdmin}
                className="clipboard-admin-badge-btn is-unlocked"
                title="Lock Admin Mode"
              >
                <span>Admin Active</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setShowAdminLogin(true);
                  setAdminPinError('');
                }}
                className="clipboard-admin-badge-btn"
                title="Unlock Admin to Drop Items"
              >
                <span>Instructor Unlock</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="clipboard-close-btn"
              aria-label="Close clipboard modal"
              title="Close (Esc)"
              style={{ width: 'auto', padding: '4px 10px', fontSize: '0.8125rem' }}
            >
              Close
            </button>
          </div>
        </header>

        {/* Admin Login Dropdown Card */}
        {showAdminLogin && !isAdmin && (
          <div className="clipboard-admin-login-box">
            <div className="clipboard-admin-login-header">
              <div className="clipboard-admin-login-title">
                <span>Instructor Authentication</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAdminLogin(false);
                  setAdminPinError('');
                }}
                className="clipboard-subclose-btn"
                aria-label="Close admin login"
                style={{ width: 'auto', padding: '2px 8px', fontSize: '0.75rem' }}
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleVerifyAdminPin} className="clipboard-admin-form">
              <input
                type="password"
                placeholder="Enter admin passcode"
                value={adminPinInput}
                onChange={(e) => {
                  setAdminPinInput(e.target.value);
                  setAdminPinError('');
                }}
                className="clipboard-input clipboard-pin-field"
                autoFocus
                maxLength={20}
              />
              <button type="submit" className="btn btn-primary btn-sm clipboard-unlock-btn">
                <span>Unlock Controls</span>
              </button>
            </form>

            {adminPinError ? (
              <div className="clipboard-pin-error-text" role="alert">
                {adminPinError}
              </div>
            ) : (
              <div className="clipboard-pin-hint-text">
                Protected teacher portal for posting live materials and student resources.
              </div>
            )}
          </div>
        )}

        {/* Admin Quick Paste Studio */}
        {isAdmin && (
          <section className="clipboard-admin-paste-card">
            <div className="clipboard-admin-card-header">
              <div className="clipboard-admin-card-label">
                <strong>Broadcast Drop to Live Clipboard</strong>
                {liveDetection && dropContent.trim() && (
                  <span className={`clipboard-detected-pill type-${liveDetection.type}`}>
                    Detected: {liveDetection.tag}
                  </span>
                )}
              </div>

              <div className="clipboard-admin-header-tools">
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="clipboard-danger-text-btn"
                    title="Remove all drops from the live clipboard"
                  >
                    Clear All Drops
                  </button>
                )}
                <span className="clipboard-shortcut-badge">
                  Ctrl + Enter to drop
                </span>
              </div>
            </div>

            <form onSubmit={handleDropItem} className="clipboard-drop-form">
              <div className="clipboard-textarea-wrapper">
                <textarea
                  ref={textareaRef}
                  value={dropContent}
                  onChange={(e) => setDropContent(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                      handleDropItem(e);
                    }
                  }}
                  placeholder="Paste anything here: URL, terminal command, prompt text, starter code, or class announcement..."
                  className="clipboard-textarea"
                  rows={3}
                  required
                />
              </div>

              <div className="clipboard-drop-controls">
                <div className="clipboard-drop-title-col">
                  <input
                    type="text"
                    placeholder="Item title (optional, auto-generated if left blank)"
                    value={dropTitle}
                    onChange={(e) => setDropTitle(e.target.value)}
                    className="clipboard-input clipboard-title-input"
                  />
                </div>

                <div className="clipboard-drop-type-group">
                  <select
                    value={dropType}
                    onChange={(e) => setDropType(e.target.value)}
                    className="clipboard-select"
                    aria-label="Category classification"
                  >
                    <option value="auto">Auto-Detect Category</option>
                    <option value="code">Code / Terminal Command</option>
                    <option value="link">URL / Web Link</option>
                    <option value="prompt">AI Prompt Template</option>
                    <option value="text">Note / Announcement</option>
                  </select>

                  <label className="clipboard-pin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={dropPinned}
                      onChange={(e) => setDropPinned(e.target.checked)}
                      style={{ accentColor: 'var(--color-accent-text)' }}
                    />
                    <span>Pin to top</span>
                  </label>

                  <button
                    type="submit"
                    disabled={isPosting || !dropContent.trim()}
                    className={`btn btn-primary btn-sm clipboard-submit-btn ${postSuccess ? 'is-success' : ''}`}
                  >
                    {isPosting ? (
                      <span>Broadcasting...</span>
                    ) : postSuccess ? (
                      <span>Dropped to All</span>
                    ) : (
                      <span>Drop to Portal</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </section>
        )}

        {/* Filter, Search & Tabs Toolbar */}
        <div className="clipboard-filter-bar">
          <div className="clipboard-search-wrap">
            <input
              type="text"
              placeholder="Search items, commands, prompts or URLs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="clipboard-search-input"
              style={{ paddingLeft: '14px' }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="clipboard-clear-search-btn"
                aria-label="Clear search"
                style={{ width: 'auto', padding: '2px 8px', fontSize: '0.75rem' }}
              >
                Clear
              </button>
            )}
          </div>

          <div className="clipboard-category-chips" role="tablist">
            {[
              { id: 'all', label: `All (${items.length})` },
              { id: 'code', label: 'Code' },
              { id: 'link', label: 'Links' },
              { id: 'prompt', label: 'Prompts' },
              { id: 'text', label: 'Notes' },
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                role="tab"
                aria-selected={activeFilter === chip.id}
                className={`clipboard-chip ${activeFilter === chip.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(chip.id)}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Feed Container */}
        <div className="clipboard-feed-container">
          {isLoading ? (
            <div className="clipboard-loading-state">
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                Connecting to Supabase Realtime clipboard...
              </p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="clipboard-empty-state">
              <h3 className="clipboard-empty-title">
                {searchQuery || activeFilter !== 'all'
                  ? 'No matching clipboard items found'
                  : 'Online Clipboard is ready for drops'}
              </h3>
              <p className="clipboard-empty-desc">
                {searchQuery || activeFilter !== 'all'
                  ? 'Try adjusting your search query or switching to the All filter tab.'
                  : 'When your instructor posts starter templates, commands, links, or prompts during class, they sync instantly here.'}
              </p>
              {!isAdmin && (
                <button
                  type="button"
                  onClick={() => setShowAdminLogin(true)}
                  className="btn btn-secondary btn-sm"
                >
                  <span>Instructor Unlock</span>
                </button>
              )}
            </div>
          ) : (
            <div className="clipboard-items-list">
              {filteredItems.map((item) => {
                const isUrl =
                  item.category === 'link' ||
                  item.category === 'web' ||
                  item.category === 'github' ||
                  item.category === 'figma' ||
                  item.category === 'google' ||
                  item.url.startsWith('http://') ||
                  item.url.startsWith('https://');

                const isCode = item.category === 'code' || item.tag?.toLowerCase().includes('code');
                const isPrompt = item.category === 'prompt' || item.tag?.toLowerCase().includes('prompt');
                const isCopied = copiedId === item.id;

                return (
                  <article
                    key={item.id}
                    className={`clipboard-card ${item.pinned ? 'is-pinned' : ''} ${isCopied ? 'is-just-copied' : ''}`}
                  >
                    {/* Card Header */}
                    <div className="clipboard-card-header">
                      <div className="clipboard-card-badges">
                        {item.pinned && (
                          <span className="clipboard-pinned-pill">
                            <span>PINNED</span>
                          </span>
                        )}

                        <span className={`clipboard-type-tag type-${item.category || 'text'}`}>
                          {isCode ? (
                            <span>Code / Command</span>
                          ) : isPrompt ? (
                            <span>AI Prompt</span>
                          ) : isUrl ? (
                            <span>Link</span>
                          ) : (
                            <span>Note</span>
                          )}
                        </span>

                        <span className="clipboard-timestamp">{item.addedAt || 'Live'}</span>
                      </div>

                      {/* Admin Controls */}
                      {isAdmin && (
                        <div className="clipboard-card-admin-actions">
                          <button
                            type="button"
                            onClick={(e) => handleTogglePinItem(item, e)}
                            className={`clipboard-icon-action-btn ${item.pinned ? 'active' : ''}`}
                            title={item.pinned ? 'Unpin item' : 'Pin item to top'}
                          >
                            <span>Pin</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteItem(item.id, e)}
                            className="clipboard-icon-action-btn danger"
                            title="Delete this item"
                          >
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Card Title */}
                    <h4 className="clipboard-card-title">{item.title}</h4>

                    {/* Content Section */}
                    <div className="clipboard-card-body">
                      {isCode ? (
                        <div className="clipboard-code-box">
                          <div className="clipboard-code-header">
                            <span className="terminal-shell-tag">Terminal</span>
                          </div>
                          <pre className="clipboard-code-content">
                            <code>{item.url}</code>
                          </pre>
                        </div>
                      ) : isPrompt ? (
                        <div className="clipboard-prompt-box">
                          <p className="clipboard-prompt-content">{item.url}</p>
                        </div>
                      ) : isUrl ? (
                        <div className="clipboard-url-box">
                          <a
                            href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="clipboard-url-link"
                          >
                            <span className="clipboard-url-text">{item.url}</span>
                          </a>
                        </div>
                      ) : (
                        <div className="clipboard-text-box">
                          <p className="clipboard-text-content">{item.url}</p>
                        </div>
                      )}

                      {item.description &&
                        item.description !== 'Shared by instructor during class' &&
                        item.description !== 'Code / Terminal Command' &&
                        item.description !== 'Shared live via Online Clipboard' &&
                        item.description !== item.url && (
                          <div className="clipboard-card-description">
                            {item.description}
                          </div>
                        )}
                    </div>

                    {/* Card Action Row: 1-Click Copy */}
                    <div className="clipboard-card-footer">
                      <button
                        type="button"
                        onClick={() => handleCopy(item)}
                        className={`clipboard-copy-btn ${isCopied ? 'copied' : ''}`}
                        aria-label={`Copy ${item.title}`}
                      >
                        {isCopied ? (
                          <span>Copied to Clipboard</span>
                        ) : (
                          <span>Copy {isCode ? 'Code' : isUrl ? 'Link' : isPrompt ? 'Prompt' : 'Content'}</span>
                        )}
                      </button>

                      {isUrl && (
                        <a
                          href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="clipboard-open-external-btn"
                          title="Open URL in new browser tab"
                        >
                          <span>Open</span>
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <footer className="clipboard-panel-footer">
          <div className="clipboard-footer-left">
            <span className="clipboard-footer-dot" />
            <span>Supabase Realtime Sync Active</span>
          </div>

          <div className="clipboard-footer-right">
            {studentName ? (
              <span>{studentName}</span>
            ) : (
              <span>Student Live Mode</span>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
