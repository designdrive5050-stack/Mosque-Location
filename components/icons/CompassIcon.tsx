
import React from 'react';

export const CompassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="100" cy="100" r="98" fill="none" stroke="#4a5568" strokeWidth="2" />

    {/* Major tick marks */}
    <line x1="100" y1="5" x2="100" y2="20" stroke="#a0aec0" strokeWidth="2" />
    <line x1="100" y1="195" x2="100" y2="180" stroke="#a0aec0" strokeWidth="2" />
    <line x1="5" y1="100" x2="20" y2="100" stroke="#a0aec0" strokeWidth="2" />
    <line x1="195" y1="100" x2="180" y2="100" stroke="#a0aec0" strokeWidth="2" />
    
    {/* Direction letters */}
    <text x="95" y="18" fontSize="16" fill="#cbd5e0" fontFamily="sans-serif">N</text>
    <text x="95" y="195" fontSize="16" fill="#cbd5e0" fontFamily="sans-serif">S</text>
    <text x="8" y="105" fontSize="16" fill="#cbd5e0" fontFamily="sans-serif">W</text>
    <text x="182" y="105" fontSize="16" fill="#cbd5e0" fontFamily="sans-serif">E</text>
    
    {/* Kaaba icon instead of North pointer */}
    <g transform="translate(92, 22) scale(0.08)">
        <path fill="#2dd4bf" d="M100 0 L0 50 L100 100 L200 50 Z M20 60 L100 100 L180 60 L100 20 Z" />
    </g>
  </svg>
);
