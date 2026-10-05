# Implementation Plan: Eliminate Inline Code Style Duplication by Reusing `.code-pill` Primitive

## Metadata
- **Plan ID:** `DP-002`
- **Target Surface:** Portfolio 101 GitHub Submission Guide (`src/components/GitHubGuide.jsx`)
- **Target Commit:** `180ef82fe1a9904c6c4bd287ade5821294564411`
- **Author:** Antigravity UI Audit Subsystem
- **Status:** Ready for Execution
- **Scope:** CSS Primitive Conformance & Token Hygiene (Zero visual regression)

---

## 1. Problem Statement & Verified Evidence

### Contract
The design system defines the `.code-pill` class in [src/index.css:1134-1142](file:///c:/Users/Asus/OneDrive/Desktop/portfolio-assignment/src/index.css#L1134-L1142) as the canonical tokenized element for technical identifiers, filenames, and CLI snippets:
```css
.code-pill {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  background: var(--color-accent-subtle);
  color: var(--color-accent-text);
  border: 1px solid var(--color-accent-border);
  padding: 2px 6px;
  border-radius: 4px;
}
```

### Runtime Path
Across `src/components/GitHubGuide.jsx`, the `.code-pill` class is used at lines 182, 196, 212, 258, 303, 314, 405, 489, 496, and 511.

### Defect
In [src/components/GitHubGuide.jsx:98](file:///c:/Users/Asus/OneDrive/Desktop/portfolio-assignment/src/components/GitHubGuide.jsx#L98), the `index.html` mention in the "Before you start" section manually inlines the exact properties of `.code-pill`:
```jsx
<code style={{ color: 'var(--color-accent-text)', background: 'var(--color-accent-subtle)', padding: '2px 6px', borderRadius: '4px' }}>index.html</code>
```
This violates DRY design system usage, misses `--font-mono` and `border: 1px solid var(--color-accent-border)` defined on `.code-pill`, creating micro-visual drift.

---

## 2. Proposed Changes

### File: `src/components/GitHubGuide.jsx`

#### Change 1: Replace Manual Inline Styles with `.code-pill`
In `src/components/GitHubGuide.jsx` around line 98:

```jsx
<<<<
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
            Check your project folder looks like this. <code style={{ color: 'var(--color-accent-text)', background: 'var(--color-accent-subtle)', padding: '2px 6px', borderRadius: '4px' }}>index.html</code> must be at the top level, not inside another folder.
          </p>
====
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
            Check your project folder looks like this. <code className="code-pill">index.html</code> must be at the top level, not inside another folder.
          </p>
>>>>
```

---

## 3. Design System Conformance
- Fully conforms to the existing `.code-pill` token contract in `src/index.css`.
- Ensures JetBrains Mono font rendering (`--font-mono`), subtle background (`--color-accent-subtle`), and consistent 1px accent border across both light and dark themes.

---

## 4. Verification & Testing Checklist
- [ ] **Visual Parity:** `index.html` in section "0: Before you start" has the identical border, background, and typography as code pills in steps 1 through 7.
- [ ] **Dark Mode Check:** Toggle between light and dark modes; verify background and text colors invert gracefully via `--color-accent-subtle` and `--color-accent-text`.
- [ ] **Build Check:** Run `npm run build` to confirm zero syntax errors.

---

## 5. Execution Boundaries
- **Permitted File:** `src/components/GitHubGuide.jsx`
- **Forbidden Files:** Do not modify any other file.
