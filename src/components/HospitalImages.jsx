import React from 'react';

// CareNova Medical Brand Shield Logo
export const CareNovaLogo = ({ className = "w-10 h-10", size = 40 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-[0_4px_12px_rgba(37,99,235,0.4)] ${className}`}
  >
    <defs>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="40%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    {/* Shield Body */}
    <path
      d="M32 4C18 4 10 12 10 24C10 44 26 56 32 60C38 56 54 44 54 24C54 12 46 4 32 4Z"
      fill="url(#shieldGrad)"
    />
    {/* Subtle highlight inner rim */}
    <path
      d="M32 7C20.5 7 13.5 13.5 13.5 24C13.5 41.5 27 52.5 32 56C37 52.5 50.5 41.5 50.5 24C50.5 13.5 43.5 7 32 7Z"
      stroke="rgba(255,255,255,0.3)"
      strokeWidth="1.5"
    />
    {/* Medical Cross */}
    <rect x="27.5" y="18" width="9" height="26" rx="3" fill="#ffffff" />
    <rect x="19" y="26.5" width="26" height="9" rx="3" fill="#ffffff" />
  </svg>
);

// Modern Glass Multistory Hospital Facade Graphic (matching the hero banner)
export const HospitalBuildingGraphic = ({ className = "h-40 w-auto" }) => (
  <div className={`relative overflow-hidden rounded-xl select-none ${className}`}>
    <img 
      src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=900" 
      alt="CareNova Modern Hospital Architecture"
      className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
      onError={(e) => {
        // Fallback to stylized SVG hospital facade if offline
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'block';
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-r from-[#d9e9fb]/40 via-transparent to-transparent pointer-events-none" />
    <div className="hidden absolute inset-0 bg-slate-900 text-white p-4">
      <div className="font-bold text-lg">+ CARENOVA HOSPITAL</div>
      <div className="text-xs text-slate-300">Advanced Care Center</div>
    </div>
  </div>
);

// Stethoscope Banner Graphic
export const StethoscopeGraphic = ({ className = "h-24 w-auto" }) => (
  <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
    <img 
      src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&q=80&w=600" 
      alt="CareNova Stethoscope" 
      className="w-full h-full object-cover rounded-xl opacity-90 mix-blend-multiply"
      onError={(e) => {
        e.target.style.display = 'none';
      }}
    />
  </div>
);

// ECG Heartbeat Cyan Pulse line
export const EcgPulseLine = ({ className = "w-full h-6" }) => (
  <svg
    viewBox="0 0 300 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M0 20 H60 L75 5 L85 35 L100 10 L115 28 L125 20 H180 L195 5 L205 35 L220 12 L230 25 L240 20 H300"
      stroke="#38bdf8"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-pulse"
    />
  </svg>
);
