import React, { useState } from 'react';

export default function GitHubGuide({ onBackToAssignment, studentName }) {
  const [activeTab, setActiveTab] = useState('web'); // 'web' | 'cli'
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem('niat_github_checklist');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback to initial
    }
    return {
      public: false,
      indexTop: false,
      folders: false,
      readme: false,
      commits: false,
      resume: false,
      copiedLink: false,
    };
  });

  const toggleCheck = (key) => {
    setChecklist((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem('niat_github_checklist', JSON.stringify(updated));
      } catch (e) { }
      return updated;
    });
  };

  const handleResetChecklist = () => {
    const empty = {
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
      localStorage.removeItem('niat_github_checklist');
    } catch (e) { }
  };

  const totalChecked = Object.values(checklist).filter(Boolean).length;
  const progressPercent = Math.round((totalChecked / 7) * 100);

  const displayName = studentName?.trim() || 'Student';
  const slug = studentName
    ? studentName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : 'riya-sharma';

  const readmeContent = `# ${studentName ? `${displayName}'s Portfolio` : 'My Portfolio'}

A single-page portfolio website built with HTML, CSS and JavaScript by ${displayName}.

**Live site:** https://${slug || 'your-link-here'}.niat.tech
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

  const copyReadme = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(readmeContent);
      setCopiedTemplate(true);
      setTimeout(() => setCopiedTemplate(false), 2000);
    }
  };

  return (
    <div className="github-guide-page">
      {/* Top Banner & Navigation */}


      <div className="wrap" style={{ paddingBlock: '3rem 5rem' }}>
        {/* Title Section */}
        <div className="guide-hero">
          <div className="pill" style={{ marginBottom: '1rem' }}>
            <span>Portfolio · GitHub Guide</span>
          </div>
          <h1 className="hero-title" style={{ marginBottom: '1rem' }}>
            Put your portfolio on GitHub.
          </h1>
          <p className="hero-desc" style={{ maxWidth: '68ch', marginBottom: '2.5rem' }}>
            Follow the steps in order. Pick the path that suits you. Both end with a public repository you can submit.
          </p>
        </div>

        {/* Section 1: Before you start */}
        <section className="guide-card" style={{ marginBottom: '2.5rem' }}>
          <div className="before-start-split">
            <div>
              <div className="guide-card-header">
                <span className="card-num" style={{ fontSize: '0.75rem', width: '24px', height: '24px' }}>0</span>
                <h3>Before you start</h3>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
                Check that your project folder matches the required structure. <code className="code-pill">index.html</code> must be at the top level, not inside another subfolder.
              </p>

              <div className="before-start-checks">
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
              </div>

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
            </div>

            <div className="folder-tree-box" style={{ marginBlockStart: 0 }}>
              <div className="folder-tree-header">
                <span className="folder-dot" style={{ backgroundColor: '#EF4444' }}></span>
                <span className="folder-dot" style={{ backgroundColor: '#F59E0B' }}></span>
                <span className="folder-dot" style={{ backgroundColor: '#10B981' }}></span>
                <span style={{ marginInlineStart: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                  Required Project Structure
                </span>
              </div>
              <pre className="folder-tree-content">
                {`portfolio/
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

        {/* Section 2: Choose your path */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Choose your path</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Not sure? Start with the website path. You can switch to Git later.
            </p>
          </div>

          {/* Path Toggle Tabs */}
          <div className="path-tab-group" role="tablist">
            <button
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
              <span className="pill" style={{ fontSize: '0.6875rem' }}>Fast & Professional</span>
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
                    and sign up with your email. Choose a simple, professional username like <code className="code-pill">{slug || 'riya-sharma'}</code>. Employers will see it.
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
                    <li><strong>Repository name:</strong> <code className="code-pill">portfolio</code></li>
                    <li><strong>Visibility:</strong> <strong>Public</strong> <span style={{ color: 'var(--color-accent-text)', fontSize: '0.8125rem' }}>(Public matters! We can't see a private repo, so it won't be graded.)</span></li>
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
                  <h3>Upload your files</h3>
                  <p>
                    Inside your new repo, click <strong>Add file</strong>, then choose <strong>Upload files</strong>. Drag your <code className="code-pill">index.html</code>, <code className="code-pill">css</code>, <code className="code-pill">js</code>, and <code className="code-pill">images</code> folders into the upload box. Wait for the upload to finish.
                  </p>
                  <div className="tip-callout">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>
                      <strong>Important:</strong> Drag the <em>contents</em> of your portfolio folder, not the parent folder itself. Otherwise your files end up one level too deep!
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
                    Scroll down to the <strong>Commit changes</strong> box. Write a short message about what you added, such as <code className="code-pill">Add navbar and hero section</code>. Click the green <strong>Commit changes</strong> button.
                  </p>
                </div>
              </div>



              {/* Step 6 */}
              <div className="step-card">
                <div className="step-badge">5</div>
                <div className="step-body">
                  <h3>Write your README</h3>
                  <p>
                    Click <code className="code-pill">README.md</code> in your repo, then click the pencil icon to edit. Paste the template further down this page, fill in your details, and click <strong>Commit changes</strong>.
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
                    and install with the default options. Then open a terminal (Git Bash on Windows) and verify:
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
                    <code>git config --global user.name "Your Name"{"\n"}git config --global user.email "you@example.com"</code>
                  </div>
                </div>
              </div>

              {/* Step 3 CLI */}
              <div className="step-card">
                <div className="step-badge">3</div>
                <div className="step-body">
                  <h3>Create an empty repository on GitHub</h3>
                  <p>
                    Sign in to GitHub, click <strong>+</strong> at the top right, then <strong>New repository</strong>. Name it <code className="code-pill">portfolio</code>, choose <strong>Public</strong>, and leave the README box <strong>unticked</strong>. Click <strong>Create repository</strong> and copy the repo URL from the page.
                  </p>
                </div>
              </div>

              {/* Step 4 CLI */}
              <div className="step-card">
                <div className="step-badge">4</div>
                <div className="step-body">
                  <h3>Open your project folder in the terminal</h3>
                  <p>
                    Move into the folder that contains your <code className="code-pill">index.html</code>. In VS Code, open <strong>Terminal → New Terminal</strong>—it opens in the right folder automatically.
                  </p>
                  <div className="code-block-wrapper">
                    <code>cd path/to/portfolio</code>
                  </div>
                </div>
              </div>

              {/* Step 5 CLI */}
              <div className="step-card">
                <div className="step-badge">5</div>
                <div className="step-body">
                  <h3>Make your first commit</h3>
                  <div className="code-block-wrapper">
                    <code>git init{"\n"}git add .{"\n"}git commit -m "Add navbar and hero section"</code>
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
                    <code>git branch -M main{"\n"}git remote add origin https://github.com/YOUR-USERNAME/portfolio.git{"\n"}git push -u origin main</code>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                    A browser window may open asking you to sign in to GitHub. Allow it. GitHub authenticates securely via browser token.
                  </p>
                </div>
              </div>

              {/* Step 7 CLI */}
              <div className="step-card">
                <div className="step-badge">7</div>
                <div className="step-body">
                  <h3>Repeat this loop after every change</h3>
                  <p>Do this each time you finish a small piece of work. Different days, different commits!</p>
                  <div className="code-block-wrapper">
                    <code>git add .{"\n"}git commit -m "Add skills section"{"\n"}git push</code>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Section 3: Commit Messages That Mean Something */}
        <section className="guide-card" style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Write commit messages that mean something</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            A commit message says what you changed, in a few clear words.
          </p>

          <div className="commit-comparison-grid">
            <div className="commit-col good">
              <div className="commit-col-header">
                <span className="commit-icon check">✓</span>
                <strong>Good Commit Messages</strong>
              </div>
              <ul className="commit-list">
                <li><code>Add dark mode toggle</code></li>
                <li><code>Fix navbar on mobile</code></li>
                <li><code>Write education section</code></li>
                <li><code>Add project live links and tags</code></li>
              </ul>
            </div>

            <div className="commit-col bad">
              <div className="commit-col-header">
                <span className="commit-icon cross">✕</span>
                <strong>Avoid Meaningless Messages</strong>
              </div>
              <ul className="commit-list">
                <li><code>update</code></li>
                <li><code>final</code></li>
                <li><code>asdfgh</code></li>
                <li><code>final final 2</code></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4: README Template */}
        <section className="guide-card" style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>README template</h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
                Paste this into <code className="code-pill">README.md</code> and fill in the gaps.
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
              {readmeContent}
            </pre>
          </div>
        </section>

        {/* Section 5: Final Checklist */}
        <section className="guide-card" style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Final checklist</h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
                Tick these off before you submit. Progress is saved automatically.
              </p>
            </div>
            <div className={`pill ${totalChecked === 7 ? 'complete' : ''}`} style={{ fontWeight: 700, borderColor: totalChecked === 7 ? '#10B981' : undefined, color: totalChecked === 7 ? '#10B981' : undefined }}>
              {totalChecked === 7 ? '✓ 7 / 7 Complete' : `${totalChecked} / 7 Completed`}
            </div>
          </div>

          {/* Animated Progress Bar & Reset Option */}
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
                  aria-label="Reset all checklist items"
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

          {/* Celebratory Banner on 100% Completion */}
          {totalChecked === 7 && (
            <div className="checklist-celebration-banner">
              <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>🎉</span>
              <div>
                <strong>All 7 requirements met!</strong>
                <span>Your portfolio repository is verified and ready for official grading submission.</span>
              </div>
            </div>
          )}

          <div className="checklist-container">
            {[
              { id: 'public', label: 'The repo is Public (open the link in an incognito/private window to check)' },
              { id: 'indexTop', label: 'index.html is at the top level of the repo (not nested in a subfolder)' },
              { id: 'folders', label: 'Folders css, js and images are present and organized' },
              { id: 'readme', label: 'README has a description, a screenshot and the live deployment link' },
              { id: 'commits', label: 'At least 5 commits with clear messages, made across several days' },
              { id: 'resume', label: 'Resume PDF is in the repo or linked from the website' },
              { id: 'copiedLink', label: 'I copied the public repository link for submission' },
            ].map((item) => (
              <label key={item.id} className={`checklist-item ${checklist[item.id] ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  checked={checklist[item.id]}
                  onChange={() => toggleCheck(item.id)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--color-accent-text)', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.9375rem', color: checklist[item.id] ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', fontWeight: checklist[item.id] ? 600 : 400 }}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* Section 6: If something goes wrong (FAQ / Troubleshooting) */}
        <section className="guide-card" style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>If something goes wrong</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            Quick solutions to the most common problems students encounter.
          </p>

          <div className="faq-grid">
            <div className="faq-card">
              <h4>My site's files are inside another folder</h4>
              <p>
                You uploaded the folder itself. Move the files to the top level, or delete the repo contents and upload only the files <em>inside</em> the folder instead.
              </p>
            </div>

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

            <div className="faq-card" style={{ gridColumn: '1 / -1' }}>
              <h4>I forgot to commit for days</h4>
              <p>
                Don't fake it. Commit what you have now, then keep committing as you work through each section. Your history should show real, authentic progress.
              </p>
            </div>
          </div>

          <div className="instructor-callout" style={{ marginTop: '2rem' }}>
            <span style={{ fontSize: '1.25rem' }}>💬</span>
            <div>
              <strong>Stuck?</strong> Ask your instructor before the deadline, not after.
            </div>
          </div>
        </section>

        {/* Terminal Return Action */}

      </div>
    </div>
  );
}
