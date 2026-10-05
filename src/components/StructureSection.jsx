import React from 'react';
import { ProgressiveBlur } from './ui/skiper-ui/skiper41';

export default function StructureSection({ studentName }) {
  const displayName = studentName?.trim() || '';
  const sections = [
    {
      num: '1',
      id: 'navbar-spec',
      title: 'Navigation Bar',
      badge: 'Required',
      description: 'The navigation bar should contain:',
      items: [
        displayName ? `Student's name (${displayName})` : "Student's name",
        'Skills',
        'Projects',
        'Dark Mode / Light Mode toggle',
      ],
      note: 'The navigation links should scroll to sections within the same page.',
    },
    {
      num: '2',
      id: 'about',
      title: 'About / Bio',
      badge: 'Required',
      description: 'Include:',
      items: [
        displayName ? `Full name (${displayName})` : 'Full name',
        'Short personal bio',
        'Introduction',
        'Academic/career interests',
        'Profile picture (optional)',
      ],
    },
    {
      num: '3',
      id: 'skills',
      title: 'Skills',
      badge: 'Required',
      description: 'Include relevant:',
      items: [
        'Programming languages',
        'Technical skills',
        'Tools',
        'Technologies',
      ],
      note: 'Students should not list skills they cannot explain.',
    },
    {
      num: '4',
      id: 'education',
      title: 'Education',
      badge: 'Required',
      description: 'Include:',
      items: [
        'College/institution',
        'Course/program',
        'Semester/year',
        'Relevant academic information',
      ],
    },
    {
      num: '5',
      id: 'projects',
      title: 'Projects',
      badge: 'Optional',
      description:
        "Students should include projects they have built. Include only if you have real projects. If you don't, skip the section (or leave a short \"coming soon\" note).",
      subheading: 'Each project should preferably contain:',
      items: [
        'Project title',
        'Description',
        'Technologies used',
        'GitHub link',
        'Live demo, if available',
      ],
    },
    {
      num: '6',
      id: 'footer-spec',
      title: 'Footer',
      badge: 'Required',
      description:
        'The footer should contain relevant information such as (correct links should be there):',
      items: [
        displayName ? `Student name (${displayName})` : 'Student name',
        'Copyright/year',
        'GitHub',
        'LinkedIn',
        'Contact information',
        'Dark Mode toggle',
      ],
      note: 'It should be visible in the navigation bar. For example, clicking the toggle should change the website between: Light Mode ↔ Dark Mode.',
    },
  ];

  return (
    <section id="structure" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Progressive Blur Overlays */}
      <ProgressiveBlur position="top" height="70px" blurAmount="8px" />
      <ProgressiveBlur position="bottom" height="70px" blurAmount="8px" />

      <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-header">
          <h2>Required Website Structure</h2>
          <p>Required structure (in this order). The portfolio must be a single-page website.</p>
        </div>

        <div className="structure-grid">
          {sections.map((sec) => {
            const isOpt = sec.badge === 'Optional';
            return (
              <div key={sec.id} className={`structure-card ${isOpt ? 'is-optional' : ''}`} id={sec.id}>
                <div className="card-top">
                  <span className="card-num">{sec.num}</span>
                  <span className={`pill ${isOpt ? 'pill-optional' : ''}`}>{sec.badge}</span>
                </div>
                <div className="card-body-group">
                  <h3>{sec.title}</h3>
                  <p>{sec.description}</p>
                  {sec.subheading && (
                    <p style={{ marginBlockStart: '0.5rem', fontWeight: 600, fontSize: '0.8125rem' }}>
                      {sec.subheading}
                    </p>
                  )}
                </div>
                <ul className="item-list">
                  {sec.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
                {sec.note && (
                  <p className="card-note" style={{ marginBlockStart: 'auto', fontSize: '0.8125rem', color: 'var(--color-text-tertiary)' }}>
                    {sec.note}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
