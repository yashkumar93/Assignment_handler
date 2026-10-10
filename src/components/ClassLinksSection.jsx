import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  Plus,
  Trash2,
  Search,
  Sparkles,
  Link2,
  FolderGit2,
  FileText,
  Globe,
  Video,
  BookOpen,
  Code2,
  X,
  RotateCcw,
  Pin,
  ClipboardCopy,
  Layers,
  ArrowRight,
  Share2,
  Send,
  Lock,
  Unlock,
  ShieldCheck,
  KeyRound,
  Cloud,
  CloudOff,
  RefreshCw
} from 'lucide-react';
import {
  initialClassLinks,
  NIAT_CLASS_LINKS_STORAGE_KEY,
  DEFAULT_ADMIN_CODE,
  ADMIN_AUTH_KEY,
  ADMIN_PASSCODE_KEY,
  verifyAdminCode,
  detectLinkCategory,
  deriveTitleFromUrl,
  normalizeLink,
  parseBulkPastedText,
} from '../data/classLinks';
import {
  isSupabaseConfigured,
  fetchDbLinks,
  insertDbLink,
  insertDbLinksBulk,
  updateDbLink,
  deleteDbLink,
  clearAllDbLinks,
  subscribeToClassLinks,
  mapRowToLink,
} from '../lib/supabase';

export default function ClassLinksSection({ studentName }) {
  // Load initial links from localStorage or fall back to initialClassLinks
  const [links, setLinks] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const dummyIds = ['link-starter-repo', 'link-figma-spec', 'link-mdn-guide', 'link-assets-drive'];
        const saved = localStorage.getItem(NIAT_CLASS_LINKS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const filtered = parsed.filter((item) => !dummyIds.includes(item.id));
            if (filtered.length > 0) {
              return filtered.map((item, idx) => normalizeLink(item, idx));
            }
          }
        }
      } catch (err) {
        console.error('Failed to parse saved class links:', err);
      }
    }
    return (initialClassLinks || []).map((item, idx) => normalizeLink(item, idx));
  });

  const [isLoadingDb, setIsLoadingDb] = useState(isSupabaseConfigured);

  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    }
    return false;
  });

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminCodeInput, setAdminCodeInput] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isChangingPasscode, setIsChangingPasscode] = useState(false);
  const [newPasscodeInput, setNewPasscodeInput] = useState('');

  const [copiedId, setCopiedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('bulk'); // 'bulk' | 'single'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  
  // Fast Inline Drop Input state
  const [inlineInput, setInlineInput] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [shareFeedback, setShareFeedback] = useState(false);

  // Bulk paste form state
  const [bulkText, setBulkText] = useState('');
  const [pasteMode, setPasteMode] = useState('append'); // 'append' | 'replace'
  const [exportNotice, setExportNotice] = useState(false);

  // Single link form state
  const [singleForm, setSingleForm] = useState({
    title: '',
    url: '',
    description: '',
    tag: 'Live Resource',
    pinned: false,
  });

  // Save to localStorage and state
  const saveLinks = (updatedLinks) => {
    setLinks(updatedLinks);
    try {
      localStorage.setItem(NIAT_CLASS_LINKS_STORAGE_KEY, JSON.stringify(updatedLinks));
      window.dispatchEvent(new Event('class_links_updated'));
    } catch (e) {
      console.warn('Could not save class links to localStorage:', e);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Sync from Supabase database & listen for live changes across all devices
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isMounted = true;
    setIsLoadingDb(true);

    // Initial fetch from cloud database
    fetchDbLinks().then(({ data, error }) => {
      if (!isMounted) return;
      setIsLoadingDb(false);
      if (!error && Array.isArray(data)) {
        if (data.length > 0) {
          setLinks(data);
          try {
            localStorage.setItem(NIAT_CLASS_LINKS_STORAGE_KEY, JSON.stringify(data));
          } catch {}
        } else if (initialClassLinks && initialClassLinks.length > 0) {
          // If Supabase table is fresh, seed default links
          const seeds = initialClassLinks.map((item, idx) => normalizeLink(item, idx));
          setLinks(seeds);
          insertDbLinksBulk(seeds).catch(() => {});
        }
      }
    });

    // Realtime postgres changes subscription
    const unsubscribe = subscribeToClassLinks((payload) => {
      if (!isMounted) return;

      if (payload.eventType === 'INSERT') {
        const newLink = mapRowToLink(payload.new);
        if (newLink) {
          setLinks((prev) => {
            if (prev.some((item) => item.id === newLink.id)) return prev;
            const updated = [newLink, ...prev];
            try {
              localStorage.setItem(NIAT_CLASS_LINKS_STORAGE_KEY, JSON.stringify(updated));
            } catch {}
            return updated;
          });
          showToast(`⚡ Live Drop: "${newLink.title}"`);
        }
      } else if (payload.eventType === 'UPDATE') {
        const updatedLink = mapRowToLink(payload.new);
        if (updatedLink) {
          setLinks((prev) => {
            const updated = prev.map((item) => (item.id === updatedLink.id ? updatedLink : item));
            try {
              localStorage.setItem(NIAT_CLASS_LINKS_STORAGE_KEY, JSON.stringify(updated));
            } catch {}
            return updated;
          });
        }
      } else if (payload.eventType === 'DELETE') {
        const deletedId = payload.old ? String(payload.old.id) : null;
        if (deletedId) {
          setLinks((prev) => {
            const updated = prev.filter((item) => item.id !== deletedId);
            try {
              localStorage.setItem(NIAT_CLASS_LINKS_STORAGE_KEY, JSON.stringify(updated));
            } catch {}
            return updated;
          });
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Sync from URL parameter on load (if instructor shared a link with students)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const shared = params.get('classLinks');
      if (shared) {
        const parsed = JSON.parse(decodeURIComponent(shared));
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = parsed.map((item, idx) => normalizeLink(item, idx));
          saveLinks(normalized);
          showToast('Updated with live links from your instructor!');
          const urlWithoutQuery = window.location.pathname + window.location.hash;
          window.history.replaceState(null, '', urlWithoutQuery);
        }
      }
    } catch (err) {
      console.warn('Could not load class links from URL:', err);
    }
  }, []);

  // Sync across tabs locally
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === NIAT_CLASS_LINKS_STORAGE_KEY || e.type === 'class_links_updated') {
        try {
          const saved = localStorage.getItem(NIAT_CLASS_LINKS_STORAGE_KEY);
          if (saved) {
            setLinks(JSON.parse(saved));
          }
        } catch { }
      }
      if (e.key === ADMIN_AUTH_KEY) {
        setIsAdmin(localStorage.getItem(ADMIN_AUTH_KEY) === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('class_links_updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('class_links_updated', handleStorageChange);
    };
  }, []);

  // Admin Code verification handler
  const handleAdminLogin = (e) => {
    if (e) e.preventDefault();
    if (verifyAdminCode(adminCodeInput)) {
      setIsAdmin(true);
      try {
        localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      } catch {}
      setAdminError('');
      setAdminCodeInput('');
      setIsAdminModalOpen(false);
      showToast('Admin Mode Unlocked 🔓');
    } else {
      setAdminError('Incorrect admin code. Please check and try again.');
    }
  };

  // Admin Lock / Logout handler
  const handleAdminLogout = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem(ADMIN_AUTH_KEY);
    } catch {}
    showToast('Admin Mode Locked 🔒');
  };

  // Change Admin Passcode handler
  const handleChangePasscode = (e) => {
    e.preventDefault();
    const trimmed = newPasscodeInput.trim();
    if (!trimmed || trimmed.length < 4) {
      setAdminError('New code must be at least 4 characters.');
      return;
    }
    try {
      localStorage.setItem(ADMIN_PASSCODE_KEY, trimmed);
    } catch {}
    setNewPasscodeInput('');
    setIsChangingPasscode(false);
    setAdminError('');
    showToast('Admin passcode updated successfully! ✓');
  };

  // Quick Inline Link Drop (Primary Fast Method for Class)
  const handleInlineDrop = async (e) => {
    if (e) e.preventDefault();
    if (!isAdmin) {
      setIsAdminModalOpen(true);
      return;
    }

    const text = inlineInput.trim();
    if (!text) return;

    const parsed = parseBulkPastedText(text);
    const toAdd = parsed.length > 0 ? parsed : [normalizeLink(text)];

    saveLinks([...toAdd, ...links]);
    setInlineInput('');
    showToast(
      toAdd.length === 1
        ? `Dropped: "${toAdd[0].title}"`
        : `Dropped ${toAdd.length} links to student view!`
    );

    if (isSupabaseConfigured) {
      try {
        if (toAdd.length === 1) {
          await insertDbLink(toAdd[0]);
        } else {
          await insertDbLinksBulk(toAdd);
        }
      } catch (err) {
        console.warn('Failed to sync link to Supabase:', err);
      }
    }
  };

  // Handle single copy action
  const handleCopyLink = async (linkItem) => {
    try {
      await navigator.clipboard.writeText(linkItem.url);
      setCopiedId(linkItem.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = linkItem.url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedId(linkItem.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Handle share link bundle with students (so other devices get the same links)
  const handleShareBundle = async () => {
    try {
      const minimal = links.map((l) => ({
        title: l.title,
        url: l.url,
        tag: l.tag,
        description: l.description,
        pinned: l.pinned,
      }));
      const encoded = encodeURIComponent(JSON.stringify(minimal));
      const shareUrl = `${window.location.origin}${window.location.pathname}?classLinks=${encoded}#class-links`;
      await navigator.clipboard.writeText(shareUrl);
      setShareFeedback(true);
      showToast('Copied student link bundle! Paste in Zoom/Meet chat.');
      setTimeout(() => setShareFeedback(false), 3000);
    } catch (e) {
      console.warn('Share copy failed:', e);
    }
  };

  // Handle delete link (admin only)
  const handleDeleteLink = async (id) => {
    if (!isAdmin) {
      setIsAdminModalOpen(true);
      return;
    }
    const next = links.filter((item) => item.id !== id);
    saveLinks(next);
    showToast('Link removed');

    if (isSupabaseConfigured) {
      try {
        await deleteDbLink(id);
      } catch (err) {
        console.warn('Failed to delete from Supabase:', err);
      }
    }
  };

  // Handle toggle pin (admin only)
  const handleTogglePin = async (id) => {
    if (!isAdmin) {
      setIsAdminModalOpen(true);
      return;
    }
    const target = links.find((item) => item.id === id);
    const nextPinned = target ? !target.pinned : false;
    const next = links.map((item) => (item.id === id ? { ...item, pinned: nextPinned } : item));
    saveLinks(next);

    if (isSupabaseConfigured) {
      try {
        await updateDbLink(id, { pinned: nextPinned });
      } catch (err) {
        console.warn('Failed to update pin in Supabase:', err);
      }
    }
  };

  // Handle Bulk Paste submit
  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      setIsAdminModalOpen(true);
      return;
    }

    const parsed = parseBulkPastedText(bulkText);
    if (parsed.length === 0) return;

    if (pasteMode === 'replace') {
      saveLinks(parsed);
      if (isSupabaseConfigured) {
        try {
          await clearAllDbLinks();
          await insertDbLinksBulk(parsed);
        } catch (err) {
          console.warn('Bulk replace in Supabase failed:', err);
        }
      }
    } else {
      saveLinks([...parsed, ...links]);
      if (isSupabaseConfigured) {
        try {
          await insertDbLinksBulk(parsed);
        } catch (err) {
          console.warn('Bulk append in Supabase failed:', err);
        }
      }
    }

    setBulkText('');
    setIsModalOpen(false);
    showToast(`Published ${parsed.length} links to students!`);
  };

  // Handle Single Link submit
  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      setIsAdminModalOpen(true);
      return;
    }
    if (!singleForm.url.trim()) return;

    const newLink = normalizeLink(
      {
        ...singleForm,
        id: `link-${Date.now()}`,
        addedAt: 'Just Now',
      },
      links.length
    );

    saveLinks([newLink, ...links]);
    setSingleForm({
      title: '',
      url: '',
      description: '',
      tag: 'Live Resource',
      pinned: false,
    });
    setIsModalOpen(false);
    showToast(`Published "${newLink.title}"!`);

    if (isSupabaseConfigured) {
      try {
        await insertDbLink(newLink);
      } catch (err) {
        console.warn('Single link insert to Supabase failed:', err);
      }
    }
  };

  // Handle Clear All Links (Admin only)
  const handleClearAllLinks = async () => {
    if (!isAdmin) {
      setIsAdminModalOpen(true);
      return;
    }
    if (window.confirm('Are you sure you want to remove all class links?')) {
      saveLinks([]);
      setIsModalOpen(false);
      showToast('All links cleared.');

      if (isSupabaseConfigured) {
        try {
          await clearAllDbLinks();
        } catch (err) {
          console.warn('Clear all in Supabase failed:', err);
        }
      }
    }
  };

  // Copy code snippet ready to paste into classLinks.js
  const handleCopyConfigCode = async () => {
    const codeSnippet = `export const initialClassLinks = ${JSON.stringify(links, null, 2)};`;
    try {
      await navigator.clipboard.writeText(codeSnippet);
      setExportNotice(true);
      setTimeout(() => setExportNotice(false), 2500);
    } catch (e) {
      console.warn('Failed to copy config code:', e);
    }
  };

  // Derived filter tags
  const allTags = useMemo(() => {
    const tags = new Set(['All']);
    links.forEach((l) => {
      if (l.tag) tags.add(l.tag);
    });
    return Array.from(tags);
  }, [links]);

  // Filtered and sorted links (pinned first, then rest)
  const filteredLinks = useMemo(() => {
    return links
      .filter((item) => {
        const matchesTag = selectedTag === 'All' || item.tag === selectedTag;
        const matchesSearch =
          !searchQuery.trim() ||
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          item.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.tag && item.tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesTag && matchesSearch;
      })
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return 0;
      });
  }, [links, selectedTag, searchQuery]);

  // Helper for category icon styling
  const renderCategoryIcon = (category) => {
    switch (category) {
      case 'github':
        return <FolderGit2 className="class-link-icon-svg" style={{ color: '#2563EB' }} />;
      case 'figma':
        return <Layers className="class-link-icon-svg" style={{ color: '#8B5CF6' }} />;
      case 'google':
      case 'drive':
        return <FileText className="class-link-icon-svg" style={{ color: '#059669' }} />;
      case 'video':
        return <Video className="class-link-icon-svg" style={{ color: '#E11D48' }} />;
      case 'docs':
        return <BookOpen className="class-link-icon-svg" style={{ color: '#0284C7' }} />;
      case 'code':
        return <Code2 className="class-link-icon-svg" style={{ color: '#D97706' }} />;
      default:
        return <Globe className="class-link-icon-svg" style={{ color: '#3B82F6' }} />;
    }
  };

  // Bulk parsed preview count
  const detectedPreview = useMemo(() => {
    return parseBulkPastedText(bulkText);
  }, [bulkText]);

  return (
    <section className="class-links-section" id="class-links">
      <div className="class-links-container">
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="class-links-toast" role="status" aria-live="polite">
            <Check size={14} className="toast-check" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Section Header */}
        <div className="class-links-header">
          <div className="class-links-title-wrap">
            <div className="class-links-badge-group">
              <div className="class-links-badge">
                <span className="live-pulse-dot" aria-hidden="true" />
                <span>Live Class Resources</span>
                <span className="class-links-count-pill">{links.length} Links</span>
              </div>

              {/* Cloud Sync Status */}
              {isSupabaseConfigured ? (
                <div
                  className="admin-status-badge unlocked"
                  title="Supabase Real-time Cloud Sync Active. Links sync automatically across student devices."
                  style={{
                    background: 'rgba(16, 185, 129, 0.12)',
                    color: '#10B981',
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  {isLoadingDb ? (
                    <RefreshCw size={12} className="spin-animate" />
                  ) : (
                    <Cloud size={13} />
                  )}
                  <span>{isLoadingDb ? 'Syncing...' : 'Cloud Sync Live'}</span>
                </div>
              ) : (
                <div
                  className="admin-status-badge locked"
                  title="Local mode. Put VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY into .env.local to enable live syncing across student devices."
                  style={{ opacity: 0.85, display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  <CloudOff size={12} />
                  <span>Local Mode</span>
                </div>
              )}

              {/* Admin Mode Badge */}
              {isAdmin ? (
                <div className="admin-status-badge unlocked" title="Instructor Mode is active. You can paste and delete links.">
                  <ShieldCheck size={13} className="admin-status-icon" />
                  <span>Admin Mode Active</span>
                  <button
                    type="button"
                    onClick={handleAdminLogout}
                    className="admin-badge-lock-btn"
                    title="Lock admin controls"
                  >
                    Lock 🔒
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="admin-status-badge locked"
                  onClick={() => setIsAdminModalOpen(true)}
                  title="Click to enter admin code and paste links"
                >
                  <Lock size={12} />
                  <span>Instructor Unlock</span>
                </button>
              )}
            </div>

            <h2 className="class-links-heading">
              Classroom Links & Live Drops
            </h2>
            <p className="class-links-subheading">
              {studentName
                ? `Instructor-shared links for ${studentName} during today's live lecture & lab.`
                : 'Click to open or copy links dropped directly by your instructor during class.'}
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="class-links-actions">
            {links.length > 0 && (
              <button
                type="button"
                className="btn-share-bundle"
                onClick={handleShareBundle}
                title="Copy a single link containing all current resources to share with students"
              >
                <Share2 size={15} />
                <span>{shareFeedback ? 'Copied Student URL! ✓' : 'Share Links URL'}</span>
              </button>
            )}

            {isAdmin ? (
              <>
                <button
                  type="button"
                  className="btn-quick-paste"
                  onClick={() => setIsModalOpen(true)}
                  id="btn-open-quick-paste-modal"
                  title="Open Bulk Paste dialog to paste many links at once"
                >
                  <Sparkles size={16} className="btn-icon-sparkle" />
                  <span>Bulk Paste</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn-admin-unlock-primary"
                onClick={() => setIsAdminModalOpen(true)}
                title="Only instructors with unique code can paste links"
              >
                <KeyRound size={15} />
                <span>Admin Login to Paste</span>
              </button>
            )}
          </div>
        </div>

        {/* INLINE QUICK-DROP BAR (Visible only to Admin with unique code) */}
        {isAdmin ? (
          <div className="class-quick-drop-wrapper">
            <form onSubmit={handleInlineDrop} className="class-quick-drop-form">
              <div className="quick-drop-field">
                <Link2 size={18} className="quick-drop-input-icon" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Paste link here to drop for students (e.g. https://... or Title - https://...)"
                  value={inlineInput}
                  onChange={(e) => setInlineInput(e.target.value)}
                  className="quick-drop-input"
                  id="input-inline-class-link"
                  aria-label="Directly paste a link for students"
                />
                {inlineInput && (
                  <button
                    type="button"
                    className="quick-drop-clear-btn"
                    onClick={() => setInlineInput('')}
                    aria-label="Clear link input"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="btn-drop-now"
                disabled={!inlineInput.trim()}
                title="Publish link to students immediately"
              >
                <Send size={15} />
                <span>Drop Link</span>
              </button>
            </form>
            <div className="quick-drop-hint">
              <span>🛡️ <strong>Admin Active:</strong> Paste any URL and press Enter. Only you can drop links.</span>
              <button
                type="button"
                className="btn-hint-change-code"
                onClick={() => {
                  setIsChangingPasscode(true);
                  setIsAdminModalOpen(true);
                }}
              >
                Change Admin Code
              </button>
            </div>
          </div>
        ) : null}

        {/* Filter and Search Bar (shown when links exist) */}
        {links.length > 0 && (
          <div className="class-links-toolbar">
            {/* Search Input */}
            <div className="class-links-search-box">
              <Search size={16} className="search-icon" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search links, tags, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="class-links-search-input"
                aria-label="Search shared class links"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category Tags */}
            <div className="class-links-tags-scroll">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`class-tag-pill ${selectedTag === tag ? 'active' : ''}`}
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Links Grid */}
        {filteredLinks.length > 0 ? (
          <div className="class-links-grid">
            {filteredLinks.map((item) => {
              const isCopied = copiedId === item.id;
              let displayHost = '';
              try {
                displayHost = new URL(item.url).hostname.replace(/^www\./, '');
              } catch {
                displayHost = item.url;
              }

              return (
                <article
                  key={item.id}
                  className={`class-link-card ${item.pinned ? 'is-pinned' : ''}`}
                >
                  <div className="class-link-card-inner">
                    {/* Icon Column */}
                    <div className={`class-link-icon-container category-${item.category || 'web'}`}>
                      {renderCategoryIcon(item.category || 'web')}
                    </div>

                    {/* Content Column */}
                    <div className="class-link-body">
                      <div className="class-link-meta-row">
                        {item.tag && (
                          <span className="class-link-tag">{item.tag}</span>
                        )}
                        {item.pinned && (
                          <button
                            type="button"
                            className={`class-link-pinned-badge ${isAdmin ? 'interactive' : ''}`}
                            onClick={() => isAdmin && handleTogglePin(item.id)}
                            title={isAdmin ? 'Click to unpin' : 'Pinned by instructor'}
                          >
                            <Pin size={11} />
                            Pinned
                          </button>
                        )}
                        {item.addedAt && (
                          <span className="class-link-time">{item.addedAt}</span>
                        )}
                      </div>

                      <h3 className="class-link-title" title={item.title}>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="class-link-title-anchor"
                        >
                          {item.title}
                        </a>
                      </h3>

                      {item.description && (
                        <p className="class-link-desc">{item.description}</p>
                      )}

                      <div className="class-link-url-preview">
                        <Link2 size={13} className="url-preview-icon" />
                        <span className="url-preview-text" title={item.url}>
                          {displayHost}
                        </span>
                      </div>
                    </div>

                    {/* Actions Column */}
                    <div className="class-link-actions-col">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-card-action btn-card-open"
                        aria-label={`Open link: ${item.title}`}
                        title="Open link in new tab"
                      >
                        <span>Open</span>
                        <ExternalLink size={14} />
                      </a>

                      <button
                        type="button"
                        className={`btn-card-action btn-card-copy ${isCopied ? 'copied' : ''}`}
                        onClick={() => handleCopyLink(item)}
                        aria-label={`Copy link for ${item.title}`}
                        title="Copy URL to clipboard"
                      >
                        {isCopied ? (
                          <>
                            <Check size={14} className="copied-icon" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      {/* Instructor Delete Option (Admin Only) */}
                      {isAdmin && (
                        <button
                          type="button"
                          className="btn-card-delete"
                          onClick={() => handleDeleteLink(item.id)}
                          aria-label={`Delete link ${item.title}`}
                          title="Delete link"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Clean Empty State */
          <div className="class-links-empty">
            <div className="empty-icon-circle">
              <Link2 size={24} />
            </div>
            <h3>
              {searchQuery || selectedTag !== 'All'
                ? 'No matching class links found'
                : 'No links shared yet'}
            </h3>
            <p>
              {searchQuery || selectedTag !== 'All'
                ? 'Try clearing the search query or tag filter above.'
                : isAdmin
                ? 'Ready to drop links for students! Paste any URL into the box above and press Enter.'
                : 'As soon as your instructor drops links during class, they will appear right here.'}
            </p>
            {searchQuery || selectedTag !== 'All' ? (
              <button
                type="button"
                className="btn-empty-reset"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTag('All');
                }}
              >
                Clear Filters
              </button>
            ) : !isAdmin ? (
              <button
                type="button"
                className="btn-empty-reset"
                onClick={() => setIsAdminModalOpen(true)}
              >
                <KeyRound size={15} style={{ marginRight: '6px' }} />
                <span>Instructor Login to Paste</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn-empty-reset"
                onClick={() => {
                  const input = document.getElementById('input-inline-class-link');
                  if (input) input.focus();
                }}
              >
                Paste First Link
              </button>
            )}
          </div>
        )}
      </div>

      {/* ADMIN PASSCODE MODAL */}
      {isAdminModalOpen && (
        <div className="class-modal-backdrop" onClick={() => setIsAdminModalOpen(false)}>
          <div
            className="class-modal-card admin-auth-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-modal-title"
          >
            <div className="class-modal-header">
              <div className="modal-header-text">
                <div className="class-modal-chip">Admin Security</div>
                <h3 id="admin-modal-title">
                  {isChangingPasscode ? 'Update Admin Code' : 'Instructor Admin Verification'}
                </h3>
                <p>
                  {isChangingPasscode
                    ? 'Set a custom unique code to protect link management.'
                    : 'Enter the unique admin code to unlock link dropping & management.'}
                </p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => {
                  setIsAdminModalOpen(false);
                  setIsChangingPasscode(false);
                  setAdminError('');
                }}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {!isChangingPasscode ? (
              <form onSubmit={handleAdminLogin} className="modal-form">
                <div className="form-group">
                  <label htmlFor="admin-passcode-input" className="form-label">
                    <span>Admin Passcode:</span>
                    <span className="form-hint">Authorized access only</span>
                  </label>
                  <input
                    id="admin-passcode-input"
                    type="password"
                    autoFocus
                    placeholder="Enter admin passcode"
                    value={adminCodeInput}
                    onChange={(e) => {
                      setAdminCodeInput(e.target.value);
                      if (adminError) setAdminError('');
                    }}
                    className={`modal-input ${adminError ? 'has-error' : ''}`}
                  />
                  {adminError && <div className="admin-error-text">{adminError}</div>}
                </div>

                <div className="modal-footer" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                    Protected for instructors only
                  </span>
                  <button type="submit" className="btn-modal-primary">
                    <Unlock size={16} />
                    <span>Unlock Admin Mode</span>
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleChangePasscode} className="modal-form">
                <div className="form-group">
                  <label htmlFor="new-admin-code-input" className="form-label">
                    <span>New Admin Passcode:</span>
                    <span className="form-hint">Minimum 4 characters</span>
                  </label>
                  <input
                    id="new-admin-code-input"
                    type="text"
                    autoFocus
                    placeholder="Enter new custom code"
                    value={newPasscodeInput}
                    onChange={(e) => setNewPasscodeInput(e.target.value)}
                    className="modal-input"
                  />
                  {adminError && <div className="admin-error-text">{adminError}</div>}
                </div>

                <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
                  <button
                    type="button"
                    className="btn-util"
                    onClick={() => {
                      setIsChangingPasscode(false);
                      setAdminError('');
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-modal-primary" disabled={newPasscodeInput.trim().length < 4}>
                    <span>Save New Code</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* QUICK PASTE / TEACHER BULK MODAL (Admin Only) */}
      {isModalOpen && isAdmin && (
        <div className="class-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="class-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Modal Header */}
            <div className="class-modal-header">
              <div className="modal-header-text">
                <div className="class-modal-chip">Instructor Link Hub</div>
                <h3 id="modal-title">Bulk Paste & Manage Links</h3>
                <p>Paste multiple URLs directly from your clipboard, Zoom, or Slack chat.</p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="class-modal-tabs">
              <button
                type="button"
                className={`modal-tab-btn ${modalTab === 'bulk' ? 'active' : ''}`}
                onClick={() => setModalTab('bulk')}
              >
                <Sparkles size={15} />
                <span>Bulk Fast Paste</span>
              </button>
              <button
                type="button"
                className={`modal-tab-btn ${modalTab === 'single' ? 'active' : ''}`}
                onClick={() => setModalTab('single')}
              >
                <Plus size={15} />
                <span>Add Single Link</span>
              </button>
            </div>

            {/* Tab 1: Bulk Paste Form */}
            {modalTab === 'bulk' && (
              <form onSubmit={handleBulkSubmit} className="modal-form">
                <div className="form-group">
                  <label htmlFor="bulk-paste-input" className="form-label">
                    <span>Paste raw URLs or links below:</span>
                    <span className="form-hint">
                      Supports plain URLs, <code>Title - https://...</code>, or chat snippets
                    </span>
                  </label>
                  <textarea
                    id="bulk-paste-input"
                    rows={6}
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder={`https://github.com/my-course/starter\nFigma Spec - https://figma.com/design/...\nMDN Guide - https://developer.mozilla.org/...`}
                    className="bulk-textarea"
                    autoFocus
                  />
                </div>

                {/* Live parsed detection indicator */}
                <div className="detected-links-status">
                  <div className="detected-badge">
                    <span className="dot" />
                    <strong>{detectedPreview.length}</strong> links detected ready to add
                  </div>
                  {detectedPreview.length > 0 && (
                    <div className="detected-preview-list">
                      {detectedPreview.slice(0, 3).map((item, i) => (
                        <div key={i} className="detected-preview-item">
                          <span className="preview-title">{item.title}</span>
                          <span className="preview-url">{item.url}</span>
                        </div>
                      ))}
                      {detectedPreview.length > 3 && (
                        <div className="detected-more">
                          +{detectedPreview.length - 3} more links
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Append vs Replace Radio */}
                <div className="paste-mode-options">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="pasteMode"
                      value="append"
                      checked={pasteMode === 'append'}
                      onChange={() => setPasteMode('append')}
                    />
                    <span>Add to top of current links</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="pasteMode"
                      value="replace"
                      checked={pasteMode === 'replace'}
                      onChange={() => setPasteMode('replace')}
                    />
                    <span>Replace all existing links</span>
                  </label>
                </div>

                <div className="modal-footer">
                  <button
                    type="submit"
                    className="btn-modal-primary"
                    disabled={detectedPreview.length === 0}
                  >
                    <span>Publish {detectedPreview.length || ''} Links to Students</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            )}

            {/* Tab 2: Single Link Form */}
            {modalTab === 'single' && (
              <form onSubmit={handleSingleSubmit} className="modal-form">
                <div className="form-group">
                  <label htmlFor="single-url" className="form-label">
                    Link URL <span style={{ color: '#E11D48' }}>*</span>
                  </label>
                  <input
                    id="single-url"
                    type="text"
                    required
                    placeholder="https://github.com/..."
                    value={singleForm.url}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSingleForm((prev) => ({
                        ...prev,
                        url: val,
                        title: prev.title || deriveTitleFromUrl(val),
                      }));
                    }}
                    className="modal-input"
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="single-title" className="form-label">
                    Display Title
                  </label>
                  <input
                    id="single-title"
                    type="text"
                    placeholder="e.g. Figma Design Specification"
                    value={singleForm.title}
                    onChange={(e) => setSingleForm({ ...singleForm, title: e.target.value })}
                    className="modal-input"
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="single-tag" className="form-label">
                      Category Tag
                    </label>
                    <select
                      id="single-tag"
                      value={singleForm.tag}
                      onChange={(e) => setSingleForm({ ...singleForm, tag: e.target.value })}
                      className="modal-select"
                    >
                      <option value="Live Resource">Live Resource</option>
                      <option value="Starter Code">Starter Code</option>
                      <option value="Design Specs">Design Specs</option>
                      <option value="Reference">Reference</option>
                      <option value="Assets">Assets</option>
                      <option value="Submission">Submission</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '1.75rem' }}>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={singleForm.pinned}
                        onChange={(e) => setSingleForm({ ...singleForm, pinned: e.target.checked })}
                      />
                      <span>Pin to top of list</span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="single-desc" className="form-label">
                    Short Description (Optional)
                  </label>
                  <input
                    id="single-desc"
                    type="text"
                    placeholder="e.g. Use this repo for today's assignment exercises"
                    value={singleForm.description}
                    onChange={(e) => setSingleForm({ ...singleForm, description: e.target.value })}
                    className="modal-input"
                  />
                </div>

                <div className="modal-footer">
                  <button type="submit" className="btn-modal-primary" disabled={!singleForm.url.trim()}>
                    <span>Add Link</span>
                    <Plus size={16} />
                  </button>
                </div>
              </form>
            )}

            {/* Instructor Power Tools Footer */}
            <div className="instructor-utilities-bar">
              <span className="utility-label">Instructor Tools:</span>
              <div className="utility-buttons">
                <button
                  type="button"
                  className="btn-util"
                  onClick={handleCopyConfigCode}
                  title="Copy ready-to-paste code for classLinks.js"
                >
                  <ClipboardCopy size={13} />
                  <span>{exportNotice ? 'Copied to Clipboard! ✓' : 'Copy JS for classLinks.js'}</span>
                </button>
                <button
                  type="button"
                  className="btn-util danger"
                  onClick={handleClearAllLinks}
                  title="Remove all links"
                >
                  <Trash2 size={13} />
                  <span>Clear All Links</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
