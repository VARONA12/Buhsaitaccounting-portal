import React from 'react';

export const Logo = ({ size = 24, className = "" }: { size?: number, className?: string }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M128 352L40 440H384V352H128Z" fill="currentColor"/>
      <path d="M192 224L144 272H384V224H192Z" fill="currentColor"/>
      <path d="M256 96L208 144H448L384 40H256V96Z" fill="currentColor"/>
      <path d="M256 40V440H320V40H256Z" fill="currentColor"/>
    </svg>
  );
};
