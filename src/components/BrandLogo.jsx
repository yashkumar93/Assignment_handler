import React from 'react';

/**
 * Geometric contrast emblem logo
 * Renders the circular black-and-white motif with crisp vector paths
 */
export default function BrandLogo({ size = 26, className = '' }) {
  return (
    <span
      className={`brand-logo ${className}`}
      aria-hidden="true"
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
    >
      <svg
        viewBox="0 0 240 240"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        {/* Contrast white base circle */}
        <circle cx="120" cy="120" r="114" fill="#ffffff" />
        
        {/* Right inner semicircle (filled black) */}
        <path
          d="M120 67.5C149.25 67.5 172.5 90.75 172.5 120C172.5 149.25 149.25 172.5 120 172.5Z"
          fill="#000000"
        />
        
        {/* Left inner semicircle outline (black stroke on white) */}
        <path
          d="M120 67.5C90.75 67.5 67.5 90.75 67.5 120C67.5 149.25 90.75 172.5 120 172.5"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="8"
        />
        
        {/* Outer geometric shape (black) */}
        <path
          d="M120 3.75C55.5 3.75 3.75 55.5 3.75 120C3.75 184.5 55.5 236.25 120 236.25C184.5 236.25 236.25 184.5 236.25 120C236.25 55.5 184.5 3.75 120 3.75ZM120 214.5V172.5C90.75 172.5 67.5 149.25 67.5 120C67.5 90.75 90.75 67.5 120 67.5V25.5C172.5 25.5 214.5 67.5 214.5 120C214.5 172.5 172.5 214.5 120 214.5Z"
          fill="#000000"
        />
      </svg>
    </span>
  );
}
