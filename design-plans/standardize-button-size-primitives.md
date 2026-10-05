# Implementation Plan: Formalize `.btn-sm` Variant and Eliminate Inline Button Overrides

## Metadata
- **Plan ID:** `DP-003`
- **Target Surface:** Button Hierarchy across Portfolio Assignment Components (`src/index.css`, `src/components/GitHubGuide.jsx`, `src/components/RequirementsSection.jsx`)
- **Target Commit:** `180ef82fe1a9904c6c4bd287ade5821294564411`
- **Author:** Antigravity UI Audit Subsystem
- **Status:** Ready for Execution
- **Scope:** Component Variant Formalization & Tokenized Button Scale

---

## 1. Problem Statement & Verified Evidence

### Contract
The design system defines the base button primitive `.btn` in [src/index.css:168-183](file:///c:/Users/Asus/OneDrive/Desktop/portfolio-assignment/src/index.css#L168-L183):
```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding-block: 10px;
  padding-inline: 18px;
  min-height: 40px;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: var(--radius);
  border: 1px solid transparent;
  cursor: pointer;
  white-space: normal;
  text-align: center;
  transition: all var(--dur) var(--ease);
}
```

### Runtime Path
Across `src/components/GitHubGuide.jsx` and `src/components/RequirementsSection.jsx`, smaller compact action buttons are needed within cards and header bars.

### Defect
Because no `.btn-sm` modifier class is defined in the design system, multiple consumers invent isolated inline styles:
1. `src/components/GitHubGuide.jsx:60`:
   `style={{ fontSize: '0.8125rem', padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}`
2. `src/components/GitHubGuide.jsx:411`:
   `style={{ fontSize: '0.8125rem', padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}`
3. `src/components/RequirementsSection.jsx:78`:
   `style={{ fontSize: '0.75rem', padding: '6px 12px', ... }}`
4. `src/components/RequirementsSection.jsx:162`:
   `style={{ fontSize: '0.75rem', padding: '6px 14px', ... }}`

These divergent inlined sizes fragment visual density, bypass `--radius-sm`, and create maintenance overhead.

---

## 2. Proposed Changes

### File 1: `src/index.css`
Add the official `.btn-sm` tokenized variant right below `.btn` (around line 185):

```css
<<<<
/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding-block: 10px;
  padding-inline: 18px;
  min-height: 40px;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: var(--radius);
  border: 1px solid transparent;
  cursor: pointer;
  white-space: normal;
  text-align: center;
  transition: all var(--dur) var(--ease);
}

.btn-primary {
====
/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding-block: 10px;
  padding-inline: 18px;
  min-height: 40px;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: var(--radius);
  border: 1px solid transparent;
  cursor: pointer;
  white-space: normal;
  text-align: center;
  transition: all var(--dur) var(--ease);
}

.btn-sm {
  padding-block: 6px;
  padding-inline: 14px;
  font-size: 0.8125rem;
  min-height: 34px;
  border-radius: var(--radius-sm);
}

.btn-primary {
>>>>
```

### File 2: `src/components/GitHubGuide.jsx`
Replace inline dimensions with `btn-sm`:
- Line 59: `className="btn btn-outline btn-sm"` (remove inline `fontSize`, `padding`, `display`, `gap`).
- Line 410: `className="btn btn-primary btn-sm"` (remove inline `fontSize`, `padding`, `display`, `gap`).

### File 3: `src/components/RequirementsSection.jsx`
Replace inline dimensions with `btn-sm`:
- Line 76: `className="btn btn-outline btn-sm"`
- Line 160: `className="btn btn-primary btn-sm"`

---

## 3. Design System Conformance
- Reuses design token `--radius-sm: 6px` instead of arbitrary radii.
- Reuses font scale `0.8125rem` (13px) for secondary and tertiary action hierarchy.
- Maintains touch target padding with minimum touch bounds.

---

## 4. Verification & Testing Checklist
- [ ] **Visual Parity:** All compact buttons ("Back to Assignment Specs", "Copy README Template", "View Reference", "Open Guide") render with uniform height (`34px`), padding, and corner radius.
- [ ] **Hover/Focus States:** Verify `:hover` and `:focus-visible` states function identically without layout shift.
- [ ] **Build Check:** Run `npm run build` to verify zero compile or bundle warnings.

---

## 5. Execution Boundaries
- **Permitted Files:** `src/index.css`, `src/components/GitHubGuide.jsx`, `src/components/RequirementsSection.jsx`.
- **Forbidden Files:** Do not modify any other file.
