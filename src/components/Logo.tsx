import React from 'react';

export const Logo = ({ size = 32, className = "" }: { size?: number, className?: string }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Recreated STYLIZED EF LOGO in YELLOW */}
      <path d="M120 440 L260 440 L260 360 L140 360 Z" fill="#FFC107" />
      <path d="M180 300 L380 300 L380 220 L200 220 Z" fill="#FFC107" />
      <path d="M240 160 L500 160 L500 80 L260 80 Z" fill="#FFC107" />
      <path d="M250 40 V480 H300 V40 H250 Z" fill="#FFC107" />
    </svg>
  );
};
