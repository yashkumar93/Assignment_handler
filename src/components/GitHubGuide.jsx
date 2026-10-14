import React, { useState, useEffect } from 'react';
import { getGenAiProjectForStudent, GENAI_PROJECTS } from '../data/genAiProjects';
import { GENAI_SUBMISSION_FORM_URL } from '../data/classLinks';

const CATEGORY_COLORS = {
  'AI-Powered': { bg: 'rgba(139, 92, 246, 0.12)', border: 'rgba(139, 92, 246, 0.3)', text: '#A78BFA' },
  'Business & Commerce': { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.3)', text: '#34D399' },
  'Data & Dashboards': { bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.3)', text: '#60A5FA' },
  'Social & Community': { bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)', text: '#FBBF24' },
  'Student & Campus': { bg: 'rgba(236, 72, 153, 0.12)', border: 'rgba(236, 72, 153, 0.3)', text: '#F472B6' },
  'Creative & Interactive': { bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.3)', text: '#C084FC' },
};

export default function GitHubGuide({
  onBackToAssignment,
  studentName,
  initialTrack = 'assignment',
}) {
  const [activeTrack, setActiveTrack] = useState(() => (initialTrack === 'genai' ? 'genai' : 'assignment'));
  const [activeTab, setActiveTab] = useState('web'); // 'web' | 'cli'
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [copiedFormUrl, setCopiedFormUrl] = useState(false);
  const [showRosterPicker, setShowRosterPicker] = useState(false);
  const [rosterQuery, setRosterQuery] = useState('');
  const [selectedStudentOverride, setSelectedStudentOverride] = useState(null);

  useEffect(() => {
    if (initialTrack) {
      setActiveTrack(initialTrack === 'genai' ? 'genai' : 'assignment');
    }
  }, [initialTrack]);

  const isGenAi = activeTrack === 'genai';

  // Resolve Gen AI project
  const currentLookupName = selectedStudentOverride || studentName;
  const matchedProject = getGenAiProjectForStudent(currentLookupName);

  // Fallback project if student has not entered a matched name
  const fallbackProject = {
    sno: 1,
    studentName: studentName?.trim() || 'Student',
    projectNo: 26,
    title: 'Real estate listing site',
    category: 'Business & Commerce',
    difficulty: 'Standard',
    description: 'A property listing site with price and area filters, saved favourites, and an inquiry form.',
    learningOutcomesList: [
      'Build filter and search logic',
      'Save user favourites in localStorage',
      'Handle inquiry form submissions & validation',
    ],
    mustHavesList: [
      'Property listings grid & detail preview',
      'Interactive filters (price, area, property type)',
      'Saved favourites / bookmarking',
      'Interactive inquiry form',
    ],
  };

  const project = isGenAi ? (matchedProject || fallbackProject) : null;

  const displayName = (isGenAi ? project?.studentName : studentName)?.trim() || 'Student';

  const portfolioSlug = studentName
    ? studentName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : 'riya-sharma';

  const genAiProjectSlug = project
    ? (project.title || 'genai-project')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    : 'genai-project';

  const currentSlug = isGenAi ? genAiProjectSlug : portfolioSlug;
  const repoName = isGenAi ? genAiProjectSlug : 'portfolio';

  const categoryStyle = project && CATEGORY_COLORS[project.category]
    ? CATEGORY_COLORS[project.category]
    : { bg: 'rgba(139, 92, 246, 0.12)', border: 'rgba(139, 92, 246, 0.3)', text: '#A78BFA' };

  // Checklist configuration per track
  const storageKey = isGenAi ? 'niat_genai_github_checklist' : 'niat_github_checklist';

  const getInitialChecklist = (forGenAi) => {
    const key = forGenAi ? 'niat_genai_github_checklist' : 'niat_github_checklist';
    try {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    return forGenAi
      ? {
          public: false,
          rootFiles: false,
          mustHaves: false,
          liveUrl: false,
          readme: false,
          commits: false,
          copiedLink: false,
        }
      : {
          public: false,
          indexTop: false,
          folders: false,
          readme: false,
          commits: false,
          resume: false,
          copiedLink: false,
        };
  };

  const [checklist, setChecklist] = useState(() => getInitialChecklist(isGenAi));

  // Sync checklist when track switches
  useEffect(() => {
    setChecklist(getInitialChecklist(isGenAi));
  }, [isGenAi]);

  const toggleCheck = (key) => {
    setChecklist((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (e) { }
      return updated;
    });
  };

  const handleResetChecklist = () => {
    const empty = isGenAi
      ? {
          public: false,
          rootFiles: false,
          mustHaves: false,
          liveUrl: false,
          readme: false,
          commits: false,
          copiedLink: false,
        }
      : {
          public: false,
          indexTop: false,
          folders: false,
          readme: false,
          commits: false,
          resume: false,
          copiedLink: false,
        };
    setChecklist(empty);
    try {
      localStorage.removeItem(storageKey);
    } catch (e) { }
  };

  const totalChecked = Object.values(checklist).filter(Boolean).length;
  const progressPercent = Math.round((totalChecked / 7) * 100);

  // Dynamic README templates
  const genAiReadme = `# ${project?.title || 'Generative AI Project'}

> Built by **${displayName}** for the Generative AI Assessment Track (${project?.category || 'Web Application'}).

**Live Demo:** https://${genAiProjectSlug}.vercel.app *(or your live deployment URL)*  
**GitHub Repository:** https://github.com/YOUR-USERNAME/${genAiProjectSlug}  
**Submission Form:** ${GENAI_SUBMISSION_FORM_URL}

---
 
## Project Overview
${project?.description || 'A modern generative AI web application.'}

## Implemented Must-Haves
${(project?.mustHavesList || []).map((m) => `- [x] ${m}`).join('\n')}

## Key Learning Outcomes
${(project?.learningOutcomesList || []).map((l) => `- ${l}`).join('\n')}

## Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript (or React / Vite / Next.js)
- **AI & Logic:** Generative AI prompt engineering, external APIs, state management
- **Deployment:** Vercel / Netlify / GitHub Pages (Deploy anywhere with zero restrictions!)

## How to Run Locally
1. Clone this repository:
   \`\`\`bash
   git clone https://github.com/YOUR-USERNAME/${genAiProjectSlug}.git
   \`\`\`
2. Navigate into the project directory:
   \`\`\`bash
   cd ${genAiProjectSlug}
   \`\`\`
3. Open \`index.html\` directly in your browser, or run your local dev server:
   \`\`\`bash
   # If using npm / Vite:
   npm install
   npm run dev
   \`\`\`

## Demo Preview Screenshot
![Project Preview Screenshot](assets/screenshot.png)

## Author
- **${displayName}**
- Student #${project?.sno || 1} · Project #${project?.projectNo || 1}`;

  const portfolioReadme = `# ${studentName ? `${displayName}'s Portfolio` : 'My Portfolio'}

A single-page portfolio website built with HTML, CSS and JavaScript by ${displayName}.

**Live site:** https://${portfolioSlug || 'your-link-here'}.niat.tech
**Resume:** link or file name

## What's inside
- About, skills, education and projects sections
- Dark mode toggle
- Responsive on mobile and desktop

## Run it locally
1. Download or clone this repo
2. Open index.html in your browser

## Screenshot
![Portfolio screenshot](images/screenshot.png)

## What I learned
Write 2 or 3 lines in your own words.`;

  const activeReadme = isGenAi ? genAiReadme : portfolioReadme;

  const copyReadme = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(activeReadme);
      setCopiedTemplate(true);
      setTimeout(() => setCopiedTemplate(false), 2000);
    }
  };

  const copyFormLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(GENAI_SUBMISSION_FORM_URL);
      setCopiedFormUrl(true);
      setTimeout(() => setCopiedFormUrl(false), 2000);
    }
  };

  // Checklist items definitions
  const genAiChecklistItems = [
    {
      id: 'public',
      label: 'Repository is set to Public (open your link in an incognito window to verify anyone can view it)',
    },
    {
      id: 'rootFiles',
      label: 'Project files (index.html, package.json, or src/) are at root level (not trapped in a nested folder)',
    },
    {
      id: 'mustHaves',
      label: `All ${project?.mustHavesList?.length || 4} assigned Must-Haves (${(project?.mustHavesList || []).slice(0, 2).join(', ')}...) are implemented`,
    },
    {
      id: 'liveUrl',
      label: 'Project is deployed live (Vercel, Netlify, Render, or GitHub Pages) and the URL is clickable & functional',
    },
    {
      id: 'readme',
      label: 'README.md is filled with project overview, must-haves checklist, and live deployment link',
    },
    {
      id: 'commits',
      label: 'At least 5 meaningful commits showing progressive development across multiple milestones',
    },
    {
      id: 'copiedLink',
      label: 'Copied public GitHub repo link and submitted in the official Gen AI Assessment Google Form',
    },
  ];

  const portfolioChecklistItems = [
    { id: 'public', label: 'The repo is Public (open the link in an incognito/private window to check)' },
    { id: 'indexTop', label: 'index.html is at the top level of the repo (not nested in a subfolder)' },
    { id: 'folders', label: 'Folders css, js and images are present and organized' },
    { id: 'readme', label: 'README has a description, a screenshot and the live deployment link' },
    { id: 'commits', label: 'At least 5 commits with clear messages, made across several days' },
    { id: 'resume', label: 'Resume PDF is in the repo or linked from the website' },
    { id: 'copiedLink', label: 'I copied the public repository link for submission' },
  ];

  const activeChecklistItems = isGenAi ? genAiChecklistItems : portfolioChecklistItems;

  const filteredRoster = GENAI_PROJECTS.filter((p) => {
    const q = rosterQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.studentName.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="github-guide-page">
      <div className="wrap" style={{ paddingBlock: '2.5rem 5rem' }}>
        {/* Track Switcher Bar */}
        <div className="guide-track-switcher-wrap" style={{ marginBottom: '2rem' }}>
          <div className="guide-track-switcher">
            <button
              type="button"
              className={`guide-track-switcher-btn ${isGenAi ? 'active' : ''}`}
              onClick={() => setActiveTrack('genai')}
            >
              <span>Generative AI Project</span>
              {project && (
                <span className="guide-track-badge-mini">
                  #{project.projectNo}
                </span>
              )}
            </button>
            <button
              type="button"
              className={`guide-track-switcher-btn ${!isGenAi ? 'active' : ''}`}
              onClick={() => setActiveTrack('assignment')}
            >
              <span>HTML & CSS Portfolio</span>
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="guide-hero" style={{ marginBottom: '2rem' }}>
          <div className="pill" style={{ marginBottom: '1rem', borderColor: isGenAi ? 'var(--color-accent-border)' : undefined }}>
            <span>{isGenAi ? 'Generative AI · GitHub Repository Guide' : 'Portfolio · GitHub Guide'}</span>
          </div>

          <h1 className="hero-title" style={{ marginBottom: '1rem' }}>
            {isGenAi ? (
              <>
                Put your <span style={{ color: 'var(--color-accent-text)' }}>{project?.title}</span> on GitHub.
              </>
            ) : (
              'Put your portfolio on GitHub.'
            )}
          </h1>

          <p className="hero-desc" style={{ maxWidth: '68ch', marginBottom: '2rem' }}>
            {isGenAi
              ? `Follow this step-by-step guide to push your allocated Generative AI project to GitHub. Build a public repository with clean code, your live deployment link, and a comprehensive README for evaluation.`
              : 'Follow the steps in order. Pick the path that suits you. Both end with a public repository you can submit.'}
          </p>

          {/* Personalized Gen AI Project Banner Card */}
          {isGenAi && project && (
            <div className="genai-guide-project-badge-card" style={{ marginBottom: '2rem' }}>
              <div className="genai-guide-badge-top">
                <span
                  className="genai-category-badge"
                  style={{
                    backgroundColor: categoryStyle.bg,
                    borderColor: categoryStyle.border,
                    color: categoryStyle.text,
                  }}
                >
                  <span className="category-icon">{categoryStyle.icon}</span>
                  <span>{project.category}</span>
                </span>
                <span className="genai-project-id-pill">
                  Project #{project.projectNo}
                </span>
                <span className="genai-roll-pill">
                  Student #{project.sno} of 48
                </span>

                <button
                  type="button"
                  className="genai-guide-roster-btn"
                  onClick={() => setShowRosterPicker(true)}
                  title="Switch to another student project"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <span>Switch Project ({displayName})</span>
                </button>
              </div>

              <div className="genai-guide-badge-body">
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                  Allocated to <strong style={{ color: 'var(--color-text-primary)' }}>{project.studentName}</strong>
                </div>
                <h3 className="genai-guide-assigned-title">{project.title}</h3>
                <p className="genai-guide-assigned-desc">{project.description}</p>

                <div className="genai-guide-meta-grid">
                  <div className="genai-guide-meta-item">
                    <span className="genai-guide-meta-label">Must-Haves:</span>
                    <strong className="genai-guide-meta-value">{project.mustHavesList.length} Core Features</strong>
                  </div>
                  <div className="genai-guide-meta-item">
                    <span className="genai-guide-meta-label">Recommended Repo Name:</span>
                    <code className="code-pill" style={{ fontWeight: 700 }}>{genAiProjectSlug}</code>
                  </div>
                  <div className="genai-guide-meta-item">
                    <span className="genai-guide-meta-label">Live Deployment:</span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Deploy anywhere (Vercel, Netlify, Render...)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 0: Before you start */}
        <section className="guide-card" style={{ marginBottom: '2.5rem' }}>
          <div className="before-start-split">
            <div>
              <div className="guide-card-header">
                <span className="card-num" style={{ fontSize: '0.75rem', width: '24px', height: '24px' }}>0</span>
                <h3>Before you start</h3>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
                {isGenAi ? (
                  <>
                    Make sure your project folder matches the standard structure. Your main entry point (<code className="code-pill">index.html</code>) or build files must be at the root of the repository, not trapped inside an extra outer folder.
                  </>
                ) : (
                  <>
                    Check that your project folder matches the required structure. <code className="code-pill">index.html</code> must be at the top level, not inside another subfolder.
                  </>
                )}
              </p>

              <div className="before-start-checks">
                {isGenAi ? (
                  <>
                    <div className="before-start-check-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span><code>index.html</code> directly at root (no wrapper folder)</span>
                    </div>
                    <div className="before-start-check-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Modular code structure: <code>src/</code> or <code>js/</code> &amp; <code>css/</code></span>
                    </div>
                    <div className="before-start-check-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>All {project?.mustHavesList.length || 4} assigned Must-Haves implemented &amp; working</span>
                    </div>
                    <div className="before-start-check-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span><code>README.md</code> with project description and live deployment URL</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="before-start-check-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span><code>index.html</code> located directly at root</span>
                    </div>
                    <div className="before-start-check-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Dedicated <code>css/</code> and <code>js/</code> subfolders</span>
                    </div>
                    <div className="before-start-check-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Case-sensitive image names (e.g. <code>photo.jpg</code>)</span>
                    </div>
                    <div className="before-start-check-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span><code>resume.pdf</code> placed in root or linked</span>
                    </div>
                  </>
                )}
              </div>

              {/* Security Warning for Gen AI */}
              {isGenAi ? (
                <div className="tip-callout" style={{ marginBlockStart: '1.25rem', borderColor: 'rgba(239, 68, 68, 0.4)', background: 'color-mix(in srgb, #EF4444 8%, transparent)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <span style={{ fontSize: '0.85rem' }}>
                    <strong style={{ color: '#EF4444' }}>Security Rule:</strong> Never commit private API keys (e.g. OpenAI / Gemini secret keys) into a public GitHub repository. Use environment variables, client mocks, or backend proxies.
                  </span>
                </div>
              ) : (
                <div className="tip-callout" style={{ marginBlockStart: '1.25rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} aria-hidden="true">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>
                    <strong>Golden rule:</strong> When uploading to GitHub, drag the <em>contents</em> inside your portfolio folder, not the parent folder itself.
                  </span>
                </div>
              )}
            </div>

            <div className="folder-tree-box" style={{ marginBlockStart: 0 }}>
              <div className="folder-tree-header">
                <span className="folder-dot" style={{ backgroundColor: '#EF4444' }}></span>
                <span className="folder-dot" style={{ backgroundColor: '#F59E0B' }}></span>
                <span className="folder-dot" style={{ backgroundColor: '#10B981' }}></span>
                <span style={{ marginInlineStart: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                  {isGenAi ? `Repository Structure: ${genAiProjectSlug}/` : 'Required Project Structure'}
                </span>
              </div>
              <pre className="folder-tree-content">
                {isGenAi ? `${genAiProjectSlug}/
  ├── index.html            (Main entry point at root level)
  ├── package.json          (Dependencies & build scripts, if used)
  ├── src/                  (or js/ & css/ folders)
  │   ├── app.js            (Interactive UI & feature logic)
  │   ├── ai-service.js     (Generative AI prompts & API handler)
  │   └── styles.css        (Modern, responsive styling)
  ├── assets/
  │   └── screenshot.png    (Project preview / full-page demo)
  └── README.md             (Required documentation & live link)`
                : `portfolio/
  ├── index.html        (Must be at root level)
  ├── css/
  │   └── style.css
  ├── js/
  │   └── script.js
  ├── images/
  │   └── screenshot.png
  └── resume.pdf`}
              </pre>
            </div>
          </div>
        </section>

        {/* Section 1: Choose your path */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Choose your path</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Not sure? Start with the website path. You can switch to Git CLI later.
            </p>
          </div>

          {/* Path Toggle Tabs */}
          <div className="path-tab-group" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'web'}
              className={`path-tab-btn ${activeTab === 'web' ? 'active' : ''}`}
              onClick={() => setActiveTab('web')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                <span>Path 1: Web Interface (Beginner-Friendly)</span>
              </div>
              <span className="pill" style={{ fontSize: '0.6875rem' }}>No Terminal Needed</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'cli'}
              className={`path-tab-btn ${activeTab === 'cli' ? 'active' : ''}`}
              onClick={() => setActiveTab('cli')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 17 10 11 4 5"></polyline>
                  <line x1="12" y1="19" x2="20" y2="19"></line>
                </svg>
                <span>Path 2: Git CLI / Terminal (Developer Path)</span>
              </div>
              <span className="pill" style={{ fontSize: '0.6875rem' }}>Fast &amp; Professional</span>
            </button>
          </div>

          {/* Path Content */}
          {activeTab === 'web' ? (
            <div className="path-steps-list">
              {/* Step 1 */}
              <div className="step-card">
                <div className="step-badge">1</div>
                <div className="step-body">
                  <h3>Create a GitHub account</h3>
                  <p>
                    Go to{' '}
                    <a href="https://github.com/signup" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent-text)', textDecoration: 'underline' }}>
                      github.com/signup
                    </a>{' '}
                    and sign up with your email. Choose a simple, professional username like <code className="code-pill">{portfolioSlug || 'student-dev'}</code>.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="step-card">
                <div className="step-badge">2</div>
                <div className="step-body">
                  <h3>Create a new repository</h3>
                  <p>
                    Click the <strong>+</strong> icon at the top right of GitHub, then select <strong>New repository</strong>. Fill it in like this:
                  </p>
                  <ul className="guide-specs-list" style={{ marginTop: '0.75rem' }}>
                    <li>
                      <strong>Repository name:</strong> <code className="code-pill">{repoName}</code>
                    </li>
                    <li>
                      <strong>Visibility:</strong> <strong>Public</strong>{' '}
                      <span style={{ color: 'var(--color-accent-text)', fontSize: '0.8125rem' }}>
                        (Crucial! Private repositories cannot be inspected or graded by evaluators.)
                      </span>
                    </li>
                    <li><strong>README:</strong> Tick <strong>Add a README file</strong></li>
                  </ul>
                  <p style={{ marginTop: '0.75rem' }}>
                    Then click the green <strong>Create repository</strong> button.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="step-card">
                <div className="step-badge">3</div>
                <div className="step-body">
                  <h3>Upload your project files</h3>
                  <p>
                    {isGenAi ? (
                      <>
                        Inside your new <code className="code-pill">{repoName}</code> repo, click <strong>Add file</strong>, then choose <strong>Upload files</strong>. Drag your <code className="code-pill">index.html</code>, <code className="code-pill">src/</code>, <code className="code-pill">assets/</code>, and any config files into the upload box.
                      </>
                    ) : (
                      <>
                        Inside your new repo, click <strong>Add file</strong>, then choose <strong>Upload files</strong>. Drag your <code className="code-pill">index.html</code>, <code className="code-pill">css</code>, <code className="code-pill">js</code>, and <code className="code-pill">images</code> folders into the upload box.
                      </>
                    )}
                  </p>
                  <div className="tip-callout">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>
                      <strong>Important:</strong> Drag the <em>contents</em> of your {repoName} folder, not the parent folder itself. Otherwise your files end up nested one level too deep!
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="step-card">
                <div className="step-badge">4</div>
                <div className="step-body">
                  <h3>Commit the upload</h3>
                  <p>
                    Scroll down to the <strong>Commit changes</strong> box. Write a clear message about the work you added, such as{' '}
                    <code className="code-pill">
                      {isGenAi
                        ? `feat: initial implementation of ${project?.mustHavesList[0] || 'core project features'}`
                        : 'Add navbar and hero section'}
                    </code>
                    . Click the green <strong>Commit changes</strong> button.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="step-card">
                <div className="step-badge">5</div>
                <div className="step-body">
                  <h3>Write your README</h3>
                  <p>
                    Click <code className="code-pill">README.md</code> in your repo, then click the pencil icon to edit. Paste the tailored template further down this page, replace with your live deployment URL, and click <strong>Commit changes</strong>.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="path-steps-list">
              {/* Step 1 CLI */}
              <div className="step-card">
                <div className="step-badge">1</div>
                <div className="step-body">
                  <h3>Install Git</h3>
                  <p>
                    Download it from{' '}
                    <a href="https://git-scm.com/downloads" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent-text)', textDecoration: 'underline' }}>
                      git-scm.com/downloads
                    </a>{' '}
                    and install with default options. Then open a terminal (Git Bash or PowerShell) and verify:
                  </p>
                  <div className="code-block-wrapper">
                    <code>git --version</code>
                  </div>
                </div>
              </div>

              {/* Step 2 CLI */}
              <div className="step-card">
                <div className="step-badge">2</div>
                <div className="step-body">
                  <h3>Tell Git who you are</h3>
                  <p>
                    Use the same email address as your GitHub account. You only need to do this once.
                  </p>
                  <div className="code-block-wrapper">
                    <code>git config --global user.name "{displayName}"{"\n"}git config --global user.email "you@example.com"</code>
                  </div>
                </div>
              </div>

              {/* Step 3 CLI */}
              <div className="step-card">
                <div className="step-badge">3</div>
                <div className="step-body">
                  <h3>Create an empty repository on GitHub</h3>
                  <p>
                    Sign in to GitHub, click <strong>+</strong> at the top right, then <strong>New repository</strong>. Name it <code className="code-pill">{repoName}</code>, choose <strong>Public</strong>, and leave the README box <strong>unticked</strong>. Click <strong>Create repository</strong> and copy the repo URL.
                  </p>
                </div>
              </div>

              {/* Step 4 CLI */}
              <div className="step-card">
                <div className="step-badge">4</div>
                <div className="step-body">
                  <h3>Open your project folder in the terminal</h3>
                  <p>
                    Navigate into the folder that contains your project files. In VS Code, open <strong>Terminal → New Terminal</strong>:
                  </p>
                  <div className="code-block-wrapper">
                    <code>cd path/to/{repoName}</code>
                  </div>
                </div>
              </div>

              {/* Step 5 CLI */}
              <div className="step-card">
                <div className="step-badge">5</div>
                <div className="step-body">
                  <h3>Make your first commit</h3>
                  <div className="code-block-wrapper">
                    <code>git init{"\n"}git add .{"\n"}git commit -m "feat: initial commit with project structure and UI"</code>
                  </div>
                </div>
              </div>

              {/* Step 6 CLI */}
              <div className="step-card">
                <div className="step-badge">6</div>
                <div className="step-body">
                  <h3>Connect to GitHub and push</h3>
                  <p>Replace the URL with your own copied GitHub repository URL:</p>
                  <div className="code-block-wrapper">
                    <code>git branch -M main{"\n"}git remote add origin https://github.com/YOUR-USERNAME/{repoName}.git{"\n"}git push -u origin main</code>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                    A browser window will open asking you to sign in to GitHub. Allow it. GitHub authenticates securely via browser token.
                  </p>
                </div>
              </div>

              {/* Step 7 CLI */}
              <div className="step-card">
                <div className="step-badge">7</div>
                <div className="step-body">
                  <h3>Repeat this loop after each milestone</h3>
                  <p>
                    Commit after each must-have feature you implement. Different days, distinct commits!
                  </p>
                  <div className="code-block-wrapper">
                    <code>git add .{"\n"}git commit -m "feat: implement {isGenAi ? (project?.mustHavesList[1] || 'interactive filters') : 'skills section'}"{"\n"}git push</code>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Section 2: Commit Messages */}
        <section className="guide-card" style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Write commit messages that mean something</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            A commit message explains what changed in a few precise words. Evaluators look at your commit log to see your real thought process.
          </p>

          <div className="commit-comparison-grid">
            <div className="commit-col good">
              <div className="commit-col-header">
                <strong>Recommended Commit Messages ({isGenAi ? 'Gen AI Project' : 'Portfolio'})</strong>
              </div>
              <ul className="commit-list">
                {isGenAi ? (
                  <>
                    <li><code>feat: implement {project?.mustHavesList[0] || 'property listings display'}</code></li>
                    <li><code>feat: add {project?.mustHavesList[1] || 'filter and search logic'}</code></li>
                    <li><code>ai: integrate prompt generation service</code></li>
                    <li><code>fix: mobile responsive grid and inquiry form validation</code></li>
                    <li><code>docs: update README with live Vercel URL and must-haves</code></li>
                  </>
                ) : (
                  <>
                    <li><code>Add dark mode toggle</code></li>
                    <li><code>Fix navbar on mobile</code></li>
                    <li><code>Write education section</code></li>
                    <li><code>Add project live links and tags</code></li>
                  </>
                )}
              </ul>
            </div>

            <div className="commit-col bad">
              <div className="commit-col-header">
                <strong>Avoid Meaningless Messages</strong>
              </div>
              <ul className="commit-list">
                <li><code>update</code></li>
                <li><code>final</code></li>
                <li><code>code added</code></li>
                <li><code>final final 2</code></li>
                <li><code>asdfgh</code></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: README Template */}
        <section className="guide-card" style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                {isGenAi ? `README template for ${project?.title}` : 'README template'}
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
                {isGenAi
                  ? 'Personalized with your allocated project deliverables, learning outcomes, and setup steps.'
                  : 'Paste this into README.md and fill in your details.'}
              </p>
            </div>
            <button
              type="button"
              onClick={copyReadme}
              className="btn btn-primary btn-sm"
            >
              {copiedTemplate ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  <span>Copy README Template</span>
                </>
              )}
            </button>
          </div>

          <div className="readme-preview-box">
            <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', color: 'var(--color-text-primary)' }}>
              {activeReadme}
            </pre>
          </div>
        </section>

        {/* Section 4: Final Checklist */}
        <section className="guide-card" style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                {isGenAi ? 'Gen AI Final Submission Checklist' : 'Final checklist'}
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
                Tick these off before submitting. Your progress is saved automatically.
              </p>
            </div>
            <div className={`pill ${totalChecked === 7 ? 'complete' : ''}`} style={{ fontWeight: 700, borderColor: totalChecked === 7 ? '#10B981' : undefined, color: totalChecked === 7 ? '#10B981' : undefined }}>
              {totalChecked === 7 ? '7 / 7 Complete' : `${totalChecked} / 7 Completed`}
            </div>
          </div>

          {/* Progress Bar & Reset Option */}
          <div className="checklist-progress-wrapper">
            <div className="checklist-progress-header">
              <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                Pre-Submission Readiness: {progressPercent}%
              </span>
              {totalChecked > 0 && (
                <button
                  type="button"
                  onClick={handleResetChecklist}
                  className="checklist-reset-btn"
                  aria-label="Reset checklist"
                >
                  Reset Checklist
                </button>
              )}
            </div>
            <div className="checklist-progress-track">
              <div
                className={`checklist-progress-bar ${totalChecked === 7 ? 'complete' : ''}`}
                style={{ width: `${progressPercent}%` }}
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
          </div>

          {/* Celebration Banner */}
          {totalChecked === 7 && (
            <div className="checklist-celebration-banner">
              <div>
                <strong>All 7 requirements met</strong>
                <span>
                  {isGenAi
                    ? `Your ${project?.title} repository is verified and ready for official Gen AI assessment grading.`
                    : 'Your portfolio repository is verified and ready for official grading submission.'}
                </span>
              </div>
            </div>
          )}

          <div className="checklist-container">
            {activeChecklistItems.map((item) => (
              <label key={item.id} className={`checklist-item ${checklist[item.id] ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  checked={checklist[item.id] || false}
                  onChange={() => toggleCheck(item.id)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--color-accent-text)', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.9375rem', color: checklist[item.id] ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', fontWeight: checklist[item.id] ? 600 : 400 }}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>

          {/* Gen AI Submission Link Quick Action */}
          {isGenAi && (
            <div className="genai-guide-submit-box" style={{ marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>Submit Your Project Response</strong>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                    Paste your public GitHub repository URL and live deployed link into the official Google Form.
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={copyFormLink}
                    className="btn btn-secondary btn-sm"
                  >
                    {copiedFormUrl ? 'Link Copied' : 'Copy Form URL'}
                  </button>
                  <a
                    href={GENAI_SUBMISSION_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    <span>Open Submission Form</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Section 5: Troubleshooting / FAQ */}
        <section className="guide-card" style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>If something goes wrong</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            Quick solutions to the most common problems encountered during project submissions.
          </p>

          <div className="faq-grid">
            <div className="faq-card">
              <h4>My site's files are inside another folder on GitHub</h4>
              <p>
                You dragged the parent folder instead of its contents. Delete the repository files or move them up to the root level. Evaluators should see <code className="code-pill">index.html</code> immediately.
              </p>
            </div>

            {isGenAi ? (
              <>
                <div className="faq-card">
                  <h4>Where should I deploy my project?</h4>
                  <p>
                    <strong>Zero limitations!</strong> You can deploy anywhere you prefer: Vercel, Netlify, GitHub Pages, Render, or Railway. Just provide a working live link so evaluators can test your app.
                  </p>
                </div>

                <div className="faq-card">
                  <h4>How do I handle Gen AI API keys safely?</h4>
                  <p>
                    Never push live OpenAI or Gemini production secret keys to a public repository! Use a <code className="code-pill">.env.example</code> file, set environment variables in your deployment dashboard, or provide simulated mock AI responses.
                  </p>
                </div>

                <div className="faq-card">
                  <h4>"Authentication failed" when pushing with Git CLI</h4>
                  <p>
                    Sign in to GitHub in the browser window that pops up. If none appears, make sure Git Credential Manager is active or generate a Personal Access Token on GitHub (Settings → Developer Settings).
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="faq-card">
                  <h4>"Authentication failed" when I push</h4>
                  <p>
                    Sign in to GitHub in the browser window that pops up. If none appears, install the latest Git from git-scm.com and try the push again.
                  </p>
                </div>

                <div className="faq-card">
                  <h4>"Repository not found" or "remote origin already exists"</h4>
                  <p>
                    Check your username in the URL. To fix the remote link, run: <br />
                    <code className="code-pill">git remote set-url origin YOUR-URL</code>
                  </p>
                </div>

                <div className="faq-card">
                  <h4>My images don't load</h4>
                  <p>
                    Image paths are case-sensitive on GitHub. <code className="code-pill">Photo.JPG</code> and <code className="code-pill">photo.jpg</code> are different files. Match the casing exactly in your HTML.
                  </p>
                </div>
              </>
            )}

            <div className="faq-card" style={{ gridColumn: '1 / -1' }}>
              <h4>I forgot to commit for several days</h4>
              <p>
                Don't fake or rewrite your history. Commit what you have right now, then continue committing incrementally as you test each must-have feature. Genuine progress is what matters.
              </p>
            </div>
          </div>

          <div className="instructor-callout" style={{ marginTop: '2rem' }}>
            <div>
              <strong>Questions or blockers?</strong> Ask your instructors in the course chat before the deadline.
            </div>
          </div>
        </section>

        {/* Back to Assignment Action */}
        {onBackToAssignment && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onBackToAssignment}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back to {isGenAi ? 'Gen AI Assignment Project' : 'Portfolio Assignment'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Roster Project Switcher Modal */}
      {showRosterPicker && (
        <div
          className="genai-roster-modal-overlay"
          onClick={() => setShowRosterPicker(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="roster-modal-title"
        >
          <div
            className="genai-roster-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '640px' }}
          >
            <div className="genai-roster-modal-header">
              <div>
                <h3 id="roster-modal-title" style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                  Preview Guide For Another Project
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Select any student to see how this GitHub guide customizes to their allocated project.
                </p>
              </div>
              <button
                type="button"
                className="genai-roster-close-btn"
                onClick={() => setShowRosterPicker(false)}
                aria-label="Close project picker"
              >
                Close
              </button>
            </div>

            <div className="genai-roster-search-bar" style={{ margin: '1rem 0' }}>
              <input
                type="text"
                placeholder="Search by student name, project title, or category..."
                value={rosterQuery}
                onChange={(e) => setRosterQuery(e.target.value)}
                className="genai-roster-search-input"
                autoFocus
              />
            </div>

            <div className="genai-roster-list" style={{ maxHeight: '380px', overflowY: 'auto' }}>
              {filteredRoster.map((item) => (
                <button
                  key={item.sno}
                  type="button"
                  className={`genai-roster-item ${displayName === item.studentName ? 'is-active' : ''}`}
                  onClick={() => {
                    setSelectedStudentOverride(item.studentName);
                    setShowRosterPicker(false);
                    setRosterQuery('');
                  }}
                >
                  <div className="genai-roster-avatar">
                    {item.studentName.charAt(0).toUpperCase()}
                  </div>
                  <div className="genai-roster-details" style={{ textAlign: 'start' }}>
                    <span className="genai-roster-name">{item.studentName}</span>
                    <span className="genai-roster-title">
                      Project #{item.projectNo}: {item.title}
                    </span>
                  </div>
                  <span className="genai-roster-cat-pill">
                    {item.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
