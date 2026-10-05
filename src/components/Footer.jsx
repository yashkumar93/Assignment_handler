import React from 'react';

export default function Footer({ onBackToHome, studentName }) {
  const displayName = studentName?.trim() || 'Student Name';
  const slug = studentName
    ? studentName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : 'student';

  return (
    <footer className="footer" id="contact">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <h4>{displayName}</h4>
            <p>
              Portfolio Assignment website for first-semester NIAT students. Built with HTML5, CSS3, and JavaScript.
            </p>
          </div>

          <div className="footer-links-col">
            <div className="footer-col-title">Footer Links</div>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-link-btn">
              <span>GitHub</span>

            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-link-btn">
              <span>LinkedIn</span>

            </a>
            <a href={`mailto:yash.kumar@nxtwave.co.in`} className="footer-link-btn">
              <span>Contact Information</span>

            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>Copyright &copy; 2026 Yash Kumar / NIAT. All rights reserved.</span>
          <a href="#top" className="footer-back-top" aria-label="Back to top of page">
            <span>Back to top</span>

          </a>
        </div>
      </div>
    </footer>
  );
}
