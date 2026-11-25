import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

/**
 * Reusable frosted glass card wrapper with fluid responsive padding and width.
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  style,
  id,
}) => {
  return (
    <div
      id={id}
      className={`glass-card ${className}`}
      style={{
        padding: 'clamp(1.15rem, 3.6vw, 1.85rem) clamp(1.15rem, 4vw, 2rem)',
        width: '100%',
        maxWidth: '34rem',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default GlassCard;
