import React from 'react';

interface SecretCatIconProps {
  size?: number;
  className?: string;
}

/**
 * Crisp inline vector icon of a tiny black cat shushing — avoids mobile emoji mismatches.
 */
export const SecretCatIcon: React.FC<SecretCatIconProps> = ({ size = 24, className }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
      aria-hidden="true"
    >
      {/* Ears */}
      <path d="M9 17L7 6L16 12Z" fill="#141418" />
      <path d="M31 17L33 6L24 12Z" fill="#141418" />
      <path d="M10 15L9 9L14 13Z" fill="#2c2636" />
      <path d="M30 15L31 9L26 13Z" fill="#2c2636" />

      {/* Round head */}
      <ellipse cx="20" cy="22" rx="13" ry="11.5" fill="#141418" />

      {/* Golden eyes */}
      <circle cx="15" cy="20" r="3.1" fill="#eab308" />
      <circle cx="25" cy="20" r="3.1" fill="#eab308" />
      <circle cx="15" cy="20" r="1.8" fill="#0b0b0e" />
      <circle cx="25" cy="20" r="1.8" fill="#0b0b0e" />
      <circle cx="14.2" cy="19.1" r="0.7" fill="#ffffff" />
      <circle cx="24.2" cy="19.1" r="0.7" fill="#ffffff" />

      {/* Tiny nose */}
      <path d="M18.8 23.5Q20 22.8 21.2 23.5Q20 24.8 18.8 23.5Z" fill="#7c5667" />

      {/* Cute paw raised in shush gesture */}
      <rect x="17.5" y="24.5" width="5" height="10.5" rx="2.5" fill="#272630" stroke="#454254" strokeWidth="1" />
      <circle cx="20" cy="26.8" r="1.1" fill="#f9a8d4" />
    </svg>
  );
};

export default SecretCatIcon;
