# Implementation Plan: Standardize Return Navigation and Terminal CTA on GitHub Guide

## Metadata
- **Plan ID:** `DP-001`
- **Target Surface:** Portfolio 101 GitHub Submission Guide (`src/components/GitHubGuide.jsx`, `src/components/Navbar.jsx`)
- **Target Commit:** `180ef82fe1a9904c6c4bd287ade5821294564411`
- **Author:** Antigravity UI Audit Subsystem
- **Status:** Ready for Execution
- **Scope:** Visual & Navigation Copy Consistency (Zero behavioral or API breakages)

---

## 1. Problem Statement & Verified Evidence

### Contract
The design system and application view model specify two primary workflow states:
1. `assignment`: The HTML & CSS Assignment Specifications page (anchored at `#html-css` / `#top`), displaying the project structure, technology restrictions, rubric, and submission embed.
2. `github-guide`: The Portfolio 101 GitHub Submission Guide (anchored at `#github-guide`), providing step-by-step repository instructions.

In [src/components/Navbar.jsx:45-53](file:///c:/Users/Asus/OneDrive/Desktop/portfolio-assignment/src/components/Navbar.jsx#L45-L53) and [src/components/GitHubGuide.jsx:58-68](file:///c:/Users/Asus/OneDrive/Desktop/portfolio-assignment/src/components/GitHubGuide.jsx#L58-L68), the return action is consistently labeled:
- **Navbar:** `Assignment` (with `aria-label="Back to Assignment Specs"`)
- **Guide Header:** `Back to Assignment Specs` (invoking `onBackToAssignment()`)

### Runtime Path
When a user clicks any return action, the handler `handleBackToAssignment()` in [src/App.jsx:78-82](file:///c:/Users/Asus/OneDrive/Desktop/portfolio-assignment/src/App.jsx#L78-L82) executes:
```javascript
const handleBackToAssignment = () => {
  setCurrentView('assignment');
  window.location.hash = 'html-css';
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
```
This transitions the viewport directly to `#top` of the Assignment Specifications.

### Defect
1. **Missing Terminal Action:** At the conclusion of the guide ([src/components/GitHubGuide.jsx:514-517](file:///c:/Users/Asus/OneDrive/Desktop/portfolio-assignment/src/components/GitHubGuide.jsx#L514-L517)), after reading all FAQs and completing the checklist, the student reaches a dead end with no bottom return action, forcing them to scroll 5,000+ pixels back to the top of the page.
2. **Copy Discrepancy:** Previous draft iterations labeled this terminal button `Back to Assignment Submission Form`, which misled students by implying it navigated directly to the Formfacade embed at `#submission-form`, when it actually scrolls to the specifications header.

---

## 2. Proposed Changes

### File: `src/components/GitHubGuide.jsx`

#### Change 1: Add Standardized Terminal Return CTA
At the end of the content wrapper (before closing `</div>` around line 515), insert an aligned terminal action matching the design system's tokenized button scale and copy contract:

```jsx
<<<<
          <div className="instructor-callout" style={{ marginTop: '2rem' }}>
            <span style={{ fontSize: '1.25rem' }}>💬</span>
            <div>
              <strong>Stuck?</strong> Ask your instructor before the deadline, not after.
            </div>
          </div>
        </section>


      </div>
    </div>
====
          <div className="instructor-callout" style={{ marginTop: '2rem' }}>
            <span style={{ fontSize: '1.25rem' }}>💬</span>
            <div>
              <strong>Stuck?</strong> Ask your instructor before the deadline, not after.
            </div>
          </div>
        </section>

        {/* Terminal Return Action */}
        <div style={{ textAlign: 'center', marginBlockStart: '3.5rem' }}>
          <button
            type="button"
            onClick={onBackToAssignment}
            className="btn btn-primary"
            style={{ minHeight: '44px', paddingInline: '24px' }}
            aria-label="Back to Portfolio Assignment Specifications"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back to Assignment Specs</span>
          </button>
        </div>
      </div>
    </div>
>>>>
```

---

## 3. Design System Conformance
- **Typography:** Uses `--font-sans` with `font-weight: 600`.
- **Button Primitives:** Leverages canonical `.btn.btn-primary` defined in `src/index.css:168-197`.
- **Iconography:** Uses the unified SVG chevron/arrow (`strokeWidth="2.5"` and `aria-hidden="true"`) identical to the top bar icon.
- **Copy Consistency:** Exactly mirrors `Back to Assignment Specs` from line 67.
- **Touch Target:** Guaranteed `minHeight: 44px` for mobile touch accessibility.

---

## 4. Verification & Testing Checklist
- [ ] **Navigation Verification:** Clicking the terminal button from `#github-guide` smoothly scrolls to the top of `#html-css`.
- [ ] **Visual Hierarchy:** The button is centered with `marginBlockStart: 3.5rem` and does not collide with the instructor callout.
- [ ] **Accessibility:** Has explicit `type="button"`, descriptive `aria-label`, and `aria-hidden="true"` on the icon.
- [ ] **Build Check:** Run `npm run build` to verify zero compile or bundle warnings.

---

## 5. Execution Boundaries
- **Permitted File:** `src/components/GitHubGuide.jsx`
- **Forbidden Files:** Do not modify `App.jsx`, `Navbar.jsx`, `RequirementsSection.jsx`, or `src/index.css`.
