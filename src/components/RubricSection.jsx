import React from 'react';

export default function RubricSection() {
  const rubricData = [
    { criteria: 'Required Content & Single-Page Structure', marks: 4 },
    { criteria: 'HTML/CSS/JS Implementation', marks: 3 },
    { criteria: 'UI/UX & Visual Design', marks: 3 },
    { criteria: 'Creativity & Uniqueness', marks: 2 },
    { criteria: 'GitHub Repository Submission', marks: 1 },
    { criteria: 'Niat.tech Deployment', marks: 1 },
    { criteria: 'Authenticity / Appropriate AI Use', marks: 1 },
  ];

  const totalMarks = rubricData.reduce((sum, item) => sum + item.marks, 0);

  return (
    <section id="rubric">
      <div className="wrap">
        <div className="section-header">
          <h2>Final 15-Mark Rubric</h2>
          <p>Criteria and marks breakdown for evaluation.</p>
        </div>

        <div className="rubric-panel">
          <table className="rubric-table" aria-label="15-Mark Rubric Table">
            <thead>
              <tr>
                <th scope="col">Criteria</th>
                <th scope="col" style={{ textAlign: 'end' }}>Marks</th>
              </tr>
            </thead>
            <tbody>
              {rubricData.map((row) => (
                <tr key={row.criteria}>
                  <td className="rubric-crit-name">{row.criteria}</td>
                  <td className="rubric-marks-val">{row.marks}</td>
                </tr>
              ))}
              <tr className="rubric-total-row">
                <td className="rubric-crit-name">Total</td>
                <td className="rubric-marks-val">{totalMarks}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
