import React, { useState, useRef, useEffect } from 'react';

/* ------------------------------------------------------------------
   CoverPageBuilder — High-Quality HTML-based cover page
   Uses html2canvas at 3× DPI for print-quality output.
   Fonts: Poppins (loaded via FontFace API from Google Fonts).
   ------------------------------------------------------------------ */

const CURRENT_YEAR = new Date().getFullYear();

const SEMESTERS = [
  '1st Semester', '2nd Semester', '3rd Semester', '4th Semester',
  '5th Semester', '6th Semester', '7th Semester', '8th Semester',
];

const defaultFields = {
  studentName: '',
  rollNumber: '',
  course: 'Btech CSE AI',
  subject: '',
  assignmentTitle: '',
  semester: '1st Semester',
  facultyName: 'Yash Kumar',
  submissionDate: new Date().toISOString().split('T')[0],
  department: 'School of Computer Science and Engineering',
  totalMarks: '15',
  assessmentNumber: 1,
};

const getDefaultSubject = (track) => {
  return track === 'genai'
    ? 'Introduction to Generative AI, Principles of Artificial Intelligence'
    : 'Web Application Development';
};

/* Preload Poppins font weights into the document so html2canvas can use them */
let fontsLoaded = false;
async function ensureFonts() {
  if (fontsLoaded) return;
  const variants = [
    { weight: '400', style: 'normal', url: 'https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrFJDUc1NECPY.woff2' },
    { weight: '500', style: 'normal', url: 'https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1JlFc-K.woff2' },
    { weight: '600', style: 'normal', url: 'https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1JlFc-K.woff2' },
    { weight: '700', style: 'normal', url: 'https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1JlFc-K.woff2' },
    { weight: '800', style: 'normal', url: 'https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLDD4Z1JlFc-K.woff2' },
  ];
  await Promise.allSettled(
    variants.map(async ({ weight, style, url }) => {
      const face = new FontFace('Poppins', `url(${url})`, { weight, style });
      const loaded = await face.load();
      document.fonts.add(loaded);
    }),
  );
  await document.fonts.ready;
  fontsLoaded = true;
}

/* Format date string nicely */
function fmtDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  } catch {
    return iso;
  }
}

/* Merge cover PDF bytes with uploaded PDF bytes using pdf-lib */
async function mergePdfs(coverBytes, uploadedBytes) {
  const { PDFDocument } = await import('pdf-lib');
  const coverDoc = await PDFDocument.load(coverBytes);
  const uploadedDoc = await PDFDocument.load(uploadedBytes);
  const mergedDoc = await PDFDocument.create();
  const [coverPage] = await mergedDoc.copyPages(coverDoc, [0]);
  mergedDoc.addPage(coverPage);
  const count = uploadedDoc.getPageCount();
  const pages = await mergedDoc.copyPages(uploadedDoc, Array.from({ length: count }, (_, i) => i));
  pages.forEach((p) => mergedDoc.addPage(p));
  return mergedDoc.save();
}

/* Trigger file download */
function downloadBytes(bytes, filename) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 6000);
}

/* ================================================================
   CoverPageTemplate — exact replica of the Geeta University design
   ================================================================ */
function CoverPageTemplate({ fields }) {
  const tableRows = [
    { label: 'Subject Name', value: fields.subject, placeholder: 'Enter subject name' },
    { label: 'Student Name', value: fields.studentName, placeholder: 'Enter your full name' },
    { label: 'Roll Number', value: fields.rollNumber, placeholder: 'Enter your roll number' },
    { label: 'Course / Program', value: fields.course, placeholder: 'e.g. B.Tech CSE' },
    { label: 'Semester', value: fields.semester, placeholder: 'e.g. 1st Semester' },
    { label: 'Faculty Name', value: fields.facultyName, placeholder: 'Enter faculty name' },
    { label: 'Date of Submission', value: fmtDate(fields.submissionDate), placeholder: 'DD / MM / YYYY' },
  ];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#FFFFFF',
      fontFamily: "'Poppins', 'Inter', 'Segoe UI', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}>

      {/* ── TOP ORANGE BAR ────────────────────────── */}
      <div style={{ width: '100%', height: '12px', background: '#E8461E', flexShrink: 0 }} />

      {/* ── LOGO HEADER ──────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 52px 14px',
        flexShrink: 0,
      }}>
        <img
          src="/geeta-university-logo.png"
          alt="Geeta University"
          crossOrigin="anonymous"
          style={{
            width: '360px',
            maxWidth: '85%',
            height: 'auto',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>

      {/* ── SCHOOL NAME (between two orange lines) ── */}
      <div style={{
        borderTop: '2px solid #E8461E',
        borderBottom: '2px solid #E8461E',
        padding: '8px 52px',
        textAlign: 'center',
        flexShrink: 0,
        marginBottom: '16px',
      }}>
        <span style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '0.18em',
          color: '#1B2A4A',
          textTransform: 'uppercase',
          display: 'block',
        }}>
          {fields.department || 'School of Computer Science and Engineering'}
        </span>
      </div>

      {/* ── ASSIGNMENT SUBMISSION BADGE DIVIDER ───── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        margin: '0 52px 18px',
        flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '1.5px',
          background: '#CBD5E1',
          zIndex: 0,
        }} />
        <span style={{
          position: 'relative',
          zIndex: 1,
          background: '#FFFFFF',
          fontFamily: "'Poppins', sans-serif",
          fontSize: '8.5px',
          fontWeight: '700',
          letterSpacing: '0.22em',
          color: '#1B2A4A',
          border: '1.5px solid #1B2A4A',
          padding: '4px 18px',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          lineHeight: 1.4,
        }}>
          ASSIGNMENT SUBMISSION
        </span>
      </div>

      {/* ── ASSESSMENT heading ─────────────────── */}
      <div style={{
        textAlign: 'center',
        fontFamily: "'Poppins', sans-serif",
        fontSize: '38px',
        fontWeight: '800',
        letterSpacing: '0.35em',
        color: '#1B2A4A',
        lineHeight: 1.25,
        margin: '0 0 14px 0',
        padding: '0',
        flexShrink: 0,
      }}>
        ASSESSMENT&nbsp;&nbsp;{fields.assessmentNumber || 1}
      </div>

      {/* ── TOTAL MARKS badge ───────────────────── */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        margin: '0 0 20px 0',
        flexShrink: 0,
      }}>
        <div style={{
          background: '#E8461E',
          color: '#FFFFFF',
          fontFamily: "'Poppins', sans-serif",
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '0.14em',
          padding: '6px 24px',
          lineHeight: 1.3,
        }}>
          TOTAL MARKS :&nbsp;&nbsp;{fields.totalMarks || '15'}
        </div>
      </div>

      {/* ── ASSIGNMENT TITLE block ──────────────── */}
      <div style={{ marginInline: '48px', marginBottom: '10px', flexShrink: 0 }}>
        {/* Navy label header */}
        <div style={{
          background: '#1B2A4A',
          padding: '6px 14px',
        }}>
          <span style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: '8px',
            fontWeight: '700',
            letterSpacing: '0.22em',
            color: '#E8461E',
            textTransform: 'uppercase',
          }}>
            ASSIGNMENT TITLE
          </span>
        </div>
        {/* Input area */}
        <div style={{
          border: '1.5px solid #CBD5E1',
          borderTop: 'none',
          padding: '14px 14px',
          background: '#F8FAFC',
          minHeight: '46px',
        }}>
          <span style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: '15px',
            fontWeight: fields.assignmentTitle ? '600' : '400',
            color: fields.assignmentTitle ? '#1B2A4A' : '#94A3B8',
          }}>
            {fields.assignmentTitle || 'Enter assignment title'}
          </span>
        </div>
      </div>

      {/* ── DETAILS TABLE ───────────────────────── */}
      <div style={{
        marginInline: '48px',
        border: '1.5px solid #CBD5E1',
        flexShrink: 0,
      }}>
        {tableRows.map((row, i) => (
          <div key={i} style={{
            display: 'flex',
            borderBottom: i < tableRows.length - 1 ? '1px solid #E2E8F0' : 'none',
            minHeight: '38px',
          }}>
            {/* Label column */}
            <div style={{
              width: '168px',
              flexShrink: 0,
              background: '#1B2A4A',
              padding: '9px 14px',
              display: 'flex',
              alignItems: 'center',
              borderRight: '1px solid rgba(255,255,255,0.1)',
            }}>
              <span style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '8.5px',
                fontWeight: '700',
                letterSpacing: '0.07em',
                color: '#FFFFFF',
                textTransform: 'uppercase',
                lineHeight: 1.3,
              }}>
                {row.label}
              </span>
            </div>
            {/* Value column */}
            <div style={{
              flex: 1,
              background: i % 2 === 0 ? '#FFFFFF' : '#F8FAFC',
              padding: '9px 14px',
              display: 'flex',
              alignItems: 'center',
            }}>
              <span style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '11.5px',
                fontWeight: row.value ? '500' : '400',
                color: row.value ? '#1E293B' : '#94A3B8',
              }}>
                {row.value || row.placeholder}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── SPACER ─────────────────────────────── */}
      <div style={{ flex: 1, minHeight: '12px' }} />

      {/* ── FOOTER ─────────────────────────────── */}
      <div style={{ flexShrink: 0 }}>
        <div style={{
          background: '#1B2A4A',
          padding: '9px 52px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: '8.5px',
            fontWeight: '500',
            color: '#94A3B8',
            letterSpacing: '0.04em',
          }}>
            Geeta University · Panipat, Delhi NCR, India
          </span>
          <span style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: '8.5px',
            fontWeight: '600',
            color: '#CBD5E1',
            background: '#263754',
            padding: '2px 8px',
            borderRadius: '3px',
          }}>
            Page 1/1
          </span>
        </div>
        <div style={{ width: '100%', height: '10px', background: '#E8461E' }} />
      </div>
    </div>
  );
}

/* ================================================================
   Main Component
   ================================================================ */
export default function CoverPageBuilder({ studentName, track = 'html-css', assessmentNumber = 1 }) {
  const [step, setStep] = useState(1);
  const [fields, setFields] = useState(() => ({
    ...defaultFields,
    studentName: studentName || '',
    subject: getDefaultSubject(track),
    assessmentNumber: assessmentNumber || 1,
  }));
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [fontsReady, setFontsReady] = useState(false);
  const [showZoomModal, setShowZoomModal] = useState(false);

  const hiddenRef = useRef(null); // hidden high-res DOM node for capture
  const fileInputRef = useRef(null);
  const previewWrapRef = useRef(null);
  const previewInnerRef = useRef(null);

  // Dynamically scale the preview inner to fit the wrap container without double scaling
  useEffect(() => {
    const applyScale = () => {
      const wrap = previewWrapRef.current;
      const inner = previewInnerRef.current;
      if (!wrap || !inner) return;
      const width = wrap.clientWidth;
      if (!width) return;
      const scaleX = width / 794;
      inner.style.transform = `scale(${scaleX})`;
      inner.style.transformOrigin = 'top left';
      wrap.style.height = `${Math.round(scaleX * 1123)}px`;
    };

    const frameId = requestAnimationFrame(applyScale);
    const ro = new ResizeObserver(applyScale);
    if (previewWrapRef.current) ro.observe(previewWrapRef.current);
    window.addEventListener('resize', applyScale);

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      window.removeEventListener('resize', applyScale);
    };
  }, [step]);

  // Handle Escape key to close zoom modal
  useEffect(() => {
    if (!showZoomModal) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setShowZoomModal(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showZoomModal]);

  const isGenAi = track === 'genai';
  const accentColor = isGenAi ? '#8B5CF6' : '#2563EB';
  const accentSubtle = isGenAi ? 'rgba(139,92,246,0.10)' : 'rgba(37,99,235,0.08)';
  const accentBorder = isGenAi ? 'rgba(139,92,246,0.25)' : 'rgba(37,99,235,0.20)';

  // Preload fonts on mount
  useEffect(() => {
    ensureFonts().then(() => setFontsReady(true)).catch(() => setFontsReady(true));
  }, []);

  // Sync prop changes (track, assessmentNumber, studentName)
  useEffect(() => {
    setFields((prev) => ({
      ...prev,
      studentName: prev.studentName || studentName || '',
      assessmentNumber: assessmentNumber || 1,
      subject: (!prev.subject || prev.subject === 'Web Application Development' || prev.subject === 'Introduction to Generative AI, Principles of Artificial Intelligence')
        ? getDefaultSubject(track)
        : prev.subject,
    }));
  }, [track, assessmentNumber, studentName]);

  const handleFieldChange = (key, val) => setFields((p) => ({ ...p, [key]: val }));

  const handleFileChange = (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') { setError('Please upload a PDF file only.'); return; }
    if (file.size > 50 * 1024 * 1024) { setError('File too large. Max 50 MB.'); return; }
    setError('');
    setUploadedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileChange(e.dataTransfer.files?.[0]);
  };

  const handleGenerate = async () => {
    if (!uploadedFile) { setError('Please upload your assignment PDF first.'); return; }
    setError('');
    setGenerating(true);
    try {
      // Load fonts if not yet ready
      if (!fontsReady) await ensureFonts();

      // Dynamically import html2canvas + jsPDF
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      const el = hiddenRef.current;
      if (!el) throw new Error('Cover page element not found');

      // Capture at 3× for print quality
      const canvas = await html2canvas(el, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#FFFFFF',
        logging: false,
        imageTimeout: 8000,
        onclone: (doc) => {
          // Ensure cloned doc has Poppins available
          const style = doc.createElement('style');
          style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');`;
          doc.head.appendChild(style);
        },
      });

      // Convert canvas → PDF
      const imgData = canvas.toDataURL('image/jpeg', 0.96);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, pdfH);
      const coverBytes = pdf.output('arraybuffer');

      // Merge with uploaded PDF
      const uploadedBytes = await uploadedFile.arrayBuffer();
      const mergedBytes = await mergePdfs(coverBytes, uploadedBytes);

      // Download
      const slug = (fields.studentName || 'student').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      downloadBytes(mergedBytes, `${slug}_assignment_with_cover.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      setError('Something went wrong generating the PDF. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const requiredFilled =
    fields.studentName && fields.rollNumber && fields.course &&
    fields.subject && fields.assignmentTitle && fields.facultyName;

  return (
    <section className="cpb-wrapper" id="cover-page-builder">

      {/* Hidden high-res element used for html2canvas capture */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '794px',
          height: '1123px',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: -999,
        }}
      >
        <div ref={hiddenRef} style={{ width: '794px', height: '1123px' }}>
          <CoverPageTemplate fields={fields} />
        </div>
      </div>

      {/* ── SECTION HEADER ─────────────────────────────── */}
      <div className="cpb-section-header">
        <div className="pill" style={{ width: 'fit-content', background: accentSubtle, borderColor: accentBorder, color: accentColor }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span>Cover Page Builder</span>
        </div>
        <h2 className="cpb-section-title">Assignment Cover Page Builder</h2>
        <p className="cpb-section-desc">
          Customize your Geeta University cover page, upload your assignment PDF, and download the complete merged document — all in one click. Processed entirely in your browser.
        </p>

        {/* Step indicator */}
        <div className="cpb-steps">
          {[{ n: 1, label: 'Customize' }, { n: 2, label: 'Preview & Upload' }, { n: 3, label: 'Download' }].map((s, idx, arr) => (
            <React.Fragment key={s.n}>
              <div className={`cpb-step ${step >= s.n ? 'is-done' : ''} ${step === s.n ? 'is-active' : ''}`}>
                <span className="cpb-step-num" style={step >= s.n ? { background: accentColor, color: '#fff', borderColor: accentColor } : {}}>
                  {step > s.n ? (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : s.n}
                </span>
                <span className="cpb-step-label" style={step >= s.n ? { color: accentColor, fontWeight: 700 } : {}}>{s.label}</span>
              </div>
              {idx < arr.length - 1 && (
                <div className="cpb-step-line" style={step > s.n ? { background: accentColor } : {}} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── STEP 1: FORM ───────────────────────────────── */}
      {step === 1 && (
        <div className="cpb-card cpb-form-card">
          <div className="cpb-form-grid">
            <div className="cpb-field cpb-field-full">
              <label className="cpb-label">Assignment Title <span className="cpb-required">*</span></label>
              <input type="text" className="cpb-input" placeholder="e.g. Personal Portfolio Website" value={fields.assignmentTitle} onChange={(e) => handleFieldChange('assignmentTitle', e.target.value)} />
            </div>
            <div className="cpb-field">
              <label className="cpb-label">Subject / Course Name <span className="cpb-required">*</span></label>
              <input type="text" className="cpb-input" placeholder="e.g. Web Development" value={fields.subject} onChange={(e) => handleFieldChange('subject', e.target.value)} />
            </div>
            <div className="cpb-field">
              <label className="cpb-label">Course / Program <span className="cpb-required">*</span></label>
              <input type="text" className="cpb-input" placeholder="e.g. B.Tech CSE / BCA" value={fields.course} onChange={(e) => handleFieldChange('course', e.target.value)} />
            </div>
            <div className="cpb-field">
              <label className="cpb-label">Student Name <span className="cpb-required">*</span></label>
              <input type="text" className="cpb-input" placeholder="Your full name" value={fields.studentName} onChange={(e) => handleFieldChange('studentName', e.target.value)} />
            </div>
            <div className="cpb-field">
              <label className="cpb-label">Roll Number <span className="cpb-required">*</span></label>
              <input type="text" className="cpb-input" placeholder="e.g. 22BCA001" value={fields.rollNumber} onChange={(e) => handleFieldChange('rollNumber', e.target.value)} />
            </div>
            <div className="cpb-field">
              <label className="cpb-label">Semester</label>
              <select className="cpb-input cpb-select" value={fields.semester} onChange={(e) => handleFieldChange('semester', e.target.value)}>
                {SEMESTERS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="cpb-field">
              <label className="cpb-label">Faculty / Submitted To <span className="cpb-required">*</span></label>
              <input type="text" className="cpb-input" placeholder="e.g. Dr. Yash Kumar" value={fields.facultyName} onChange={(e) => handleFieldChange('facultyName', e.target.value)} />
            </div>
            <div className="cpb-field">
              <label className="cpb-label">Date of Submission</label>
              <input type="date" className="cpb-input" value={fields.submissionDate} onChange={(e) => handleFieldChange('submissionDate', e.target.value)} />
            </div>
            <div className="cpb-field cpb-field-full">
              <label className="cpb-label">School / Department</label>
              <input type="text" className="cpb-input" placeholder="School of Computer Science and Engineering" value={fields.department} onChange={(e) => handleFieldChange('department', e.target.value)} />
            </div>
            <div className="cpb-field">
              <label className="cpb-label">Total Marks</label>
              <input type="number" className="cpb-input" placeholder="15" min="1" max="999" value={fields.totalMarks} onChange={(e) => handleFieldChange('totalMarks', e.target.value)} />
            </div>
            <div className="cpb-field">
              <label className="cpb-label">Assessment Number</label>
              <input type="number" className="cpb-input" placeholder="1" min="1" max="20" value={fields.assessmentNumber || 1} onChange={(e) => handleFieldChange('assessmentNumber', e.target.value)} />
            </div>
          </div>

          {!requiredFilled && (
            <p className="cpb-hint" style={{ marginTop: '0.75rem' }}>
              <span style={{ color: '#EF4444' }}>*</span> Fill in all required fields to continue.
            </p>
          )}

          <div className="cpb-form-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setStep(2)}
              disabled={!requiredFilled}
              style={{
                opacity: requiredFilled ? 1 : 0.45,
                cursor: requiredFilled ? 'pointer' : 'not-allowed',
                background: requiredFilled ? accentColor : undefined,
                borderColor: requiredFilled ? accentColor : undefined,
                minHeight: '44px',
                paddingInline: '24px',
                fontSize: '0.9375rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
              </svg>
              Preview Cover Page
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: PREVIEW + UPLOAD ────────────────────── */}
      {step === 2 && (
        <div className="cpb-step2-layout">

          {/* Left: Live preview */}
          <div className="cpb-preview-panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div className="cpb-preview-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                </svg>
                <span>Live Cover Page Preview</span>
              </div>
              <button
                type="button"
                onClick={() => setShowZoomModal(true)}
                title="Click to view full size"
                style={{
                  background: 'none',
                  border: 'none',
                  color: accentColor,
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '2px 4px',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
                <span>Click to Expand</span>
              </button>
            </div>

            {/* Scaled live preview */}
            <div
              className="cpb-preview-scale-wrap"
              ref={previewWrapRef}
              onClick={() => setShowZoomModal(true)}
              title="Click preview to view full size"
              style={{ cursor: 'zoom-in' }}
            >
              <div className="cpb-preview-inner" ref={previewInnerRef}>
                <CoverPageTemplate fields={fields} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button type="button" className="cpb-edit-btn" onClick={() => setStep(1)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Details
              </button>

              <button
                type="button"
                className="cpb-edit-btn"
                onClick={() => setShowZoomModal(true)}
                style={{ color: accentColor, borderColor: accentBorder }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <polyline points="9 21 3 21 3 15"></polyline>
                  <line x1="21" y1="3" x2="14" y2="10"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
                Full Size View
              </button>
            </div>
          </div>

          {/* Right: Upload + Generate */}
          <div className="cpb-upload-panel">
            <h3 className="cpb-upload-title">Upload Your Assignment PDF</h3>
            <p className="cpb-upload-desc">
              Your cover page will be prepended as <strong>Page 1</strong>. Your assignment pages follow from Page 2 onwards.
            </p>

            {/* Drop zone */}
            <div
              className={`cpb-dropzone ${dragOver ? 'is-drag-over' : ''} ${uploadedFile ? 'has-file' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
              style={uploadedFile ? { borderColor: '#10B981', background: 'rgba(16,185,129,0.04)' } : {}}
            >
              <input ref={fileInputRef} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={(e) => handleFileChange(e.target.files?.[0])} />

              {uploadedFile ? (
                <div className="cpb-file-info">
                  <div className="cpb-file-icon" style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="cpb-file-name">{uploadedFile.name}</div>
                    <div className="cpb-file-size">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB · Click to change</div>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              ) : (
                <div className="cpb-dropzone-idle">
                  <div className="cpb-dropzone-icon">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <span className="cpb-dropzone-text">Drag & drop your PDF here</span>
                  <span className="cpb-dropzone-sub">or click to browse · Max 50 MB</span>
                </div>
              )}
            </div>

            {/* How it works */}
            <div className="cpb-how-it-works">
              <div className="cpb-hw-title">How it works</div>
              {[
                'Cover page (this preview) becomes Page 1',
                'Your uploaded PDF pages follow from Page 2 onwards',
                'Download the complete merged PDF instantly',
              ].map((text, i) => (
                <div className="cpb-hw-row" key={i}>
                  <span className="cpb-hw-num" style={{ background: accentSubtle, color: accentColor, borderColor: accentBorder }}>{i + 1}</span>
                  <span dangerouslySetInnerHTML={{ __html: text.replace(/Page \d+/g, (m) => `<strong>${m}</strong>`) }} />
                </div>
              ))}
            </div>

            {error && (
              <div className="cpb-error-msg">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleGenerate}
              disabled={!uploadedFile || generating}
              style={{
                opacity: (!uploadedFile || generating) ? 0.5 : 1,
                cursor: (!uploadedFile || generating) ? 'not-allowed' : 'pointer',
                background: accentColor,
                color: '#fff',
                width: '100%',
                minHeight: '48px',
                fontSize: '1rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.625rem',
                marginTop: '1.25rem',
                border: 'none',
                borderRadius: '8px',
                fontFamily: 'inherit',
              }}
            >
              {generating ? (
                <>
                  <svg className="cpb-spinner" style={{ width: 18, height: 18 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" /><path d="M12 2a10 10 0 0 1 10 10" />
                  </svg>
                  Generating PDF…
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Generate &amp; Download PDF
                </>
              )}
            </button>

            <p className="cpb-privacy-note">
              🔒 Processed entirely in your browser. No files are uploaded to any server.
            </p>
          </div>
        </div>
      )}

      {/* ── FULL SIZE ZOOM MODAL ───────────────────────── */}
      {showZoomModal && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setShowZoomModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.82)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            overflow: 'auto',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '840px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              margin: 'auto',
            }}
          >
            {/* Modal header bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: '0.875rem',
              color: '#FFFFFF',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem', fontWeight: 600 }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="11" y1="8" x2="11" y2="14"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </span>
                <span>Cover Page Preview · Native Resolution</span>
              </div>
              <button
                type="button"
                onClick={() => setShowZoomModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  cursor: 'pointer',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Close (ESC)
              </button>
            </div>

            {/* Modal preview body */}
            <div style={{
              width: '100%',
              maxHeight: 'calc(90vh - 60px)',
              overflowY: 'auto',
              borderRadius: '10px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
              background: '#FFFFFF',
              display: 'flex',
              justifyContent: 'center',
            }}>
              <div style={{ width: '794px', minHeight: '1123px', flexShrink: 0 }}>
                <CoverPageTemplate fields={fields} />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
