import React from 'react';
import { motion } from 'framer-motion';

interface PawButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'yes' | 'no' | 'neutral';
  /** Visual scale — the clickable area stays ≥44×44 regardless */
  scale?: number;
  id?: string;
  disabled?: boolean;
  width?: number;
}

const VARIANT_STYLES = {
  yes: {
    outerTop: '#fcf8ff',
    outerBottom: '#f1e4ff',
    outerStroke: '#a855f7',
    padTop: '#c084fc',
    padMid: '#a855f7',
    padBottom: '#7e22ce',
    padStroke: 'rgba(109, 40, 217, 0.35)',
    gloss: 'rgba(255, 255, 255, 0.34)',
    text: '#ffffff',
    shadow: '0 8px 24px rgba(168, 85, 247, 0.34)',
  },
  no: {
    outerTop: 'rgba(255, 255, 255, 0.94)',
    outerBottom: 'rgba(244, 236, 255, 0.88)',
    outerStroke: '#cbbbe6',
    padTop: '#f3e8ff',
    padMid: '#e9d8fd',
    padBottom: '#ddd0f7',
    padStroke: 'rgba(147, 112, 219, 0.28)',
    gloss: 'rgba(255, 255, 255, 0.65)',
    text: '#4a356e',
    shadow: '0 6px 18px rgba(120, 80, 200, 0.14)',
  },
  neutral: {
    outerTop: 'rgba(255, 255, 255, 0.92)',
    outerBottom: 'rgba(245, 238, 255, 0.88)',
    outerStroke: '#c4b5fd',
    padTop: '#ede9fe',
    padMid: '#ddd6fe',
    padBottom: '#c4b5fd',
    padStroke: 'rgba(124, 58, 237, 0.25)',
    gloss: 'rgba(255, 255, 255, 0.55)',
    text: '#4a2d7a',
    shadow: '0 6px 18px rgba(120, 80, 200, 0.14)',
  },
};

/**
 * Cohesive scalloped cat-paw SVG button inspired by the reference paw shape,
 * styled to match the site's lavender/purple/glass theme.
 */
export const PawButton: React.FC<PawButtonProps> = ({
  label,
  onClick,
  variant = 'neutral',
  scale = 1,
  id,
  disabled = false,
  width = 142,
}) => {
  const v = VARIANT_STYLES[variant];
  const uid = React.useId().replaceAll(':', '');

  // Keep proportions faithful to reference paw while allowing wider buttons for long pivot labels
  const renderWidth = Math.round(
    (width > 165 ? Math.min(width * 0.86, 178) : 136) * (scale > 1 ? Math.min(scale, 1.48) : 1),
  );
  const renderHeight = Math.round(renderWidth * (158 / 200));
  const visualScale = scale < 1 ? scale : 1;
  const fontSize = label.length > 10 ? 13 : 18.5;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        minWidth: 44,
        minHeight: 44,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      onClick={disabled ? undefined : onClick}
      role="button"
      aria-label={label}
      id={id}
      tabIndex={0}
      onKeyDown={(e) => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) onClick(); }}
    >
      <motion.div
        animate={{ scale: visualScale }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        whileHover={{ scale: visualScale * 1.07, y: -2 }}
        whileTap={{ scale: visualScale * 0.94 }}
        style={{ display: 'inline-block', transformOrigin: 'center' }}
      >
        <svg
          viewBox="0 0 200 158"
          width={renderWidth}
          height={renderHeight}
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', filter: `drop-shadow(${v.shadow})` }}
        >
          <defs>
            <linearGradient id={`paw-outer-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={v.outerTop} />
              <stop offset="100%" stopColor={v.outerBottom} />
            </linearGradient>
            <linearGradient id={`paw-pad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={v.padTop} />
              <stop offset="55%" stopColor={v.padMid} />
              <stop offset="100%" stopColor={v.padBottom} />
            </linearGradient>
          </defs>

          {/* Outer cohesive scalloped paw silhouette */}
          <path
            d="
              M 100,145
              C 78,145 70,151 52,149
              C 30,146 18,131 23,112
              C 12,102 6,86 12,68
              C 17,52 34,46 46,50
              C 46,31 59,14 78,14
              C 88,14 96,20 100,26
              C 104,20 112,14 122,14
              C 141,14 154,31 154,50
              C 166,46 183,52 188,68
              C 194,86 188,102 177,112
              C 182,131 170,146 148,149
              C 130,151 122,145 100,145
              Z
            "
            fill={`url(#paw-outer-${uid})`}
            stroke={v.outerStroke}
            strokeWidth="3.2"
            strokeLinejoin="round"
          />

          {/* Four tilted glossy toe beans */}
          <g transform="rotate(-17 36 74)">
            <ellipse
              cx="36" cy="74" rx="14.5" ry="19"
              fill={`url(#paw-pad-${uid})`}
              stroke={v.padStroke}
              strokeWidth="1.5"
            />
            <path d="M 32,60 Q 41,62 43,72" fill="none" stroke={v.gloss} strokeWidth="2.5" strokeLinecap="round" />
          </g>

          <g transform="rotate(-6 75 43)">
            <ellipse
              cx="75" cy="43" rx="15.5" ry="20.5"
              fill={`url(#paw-pad-${uid})`}
              stroke={v.padStroke}
              strokeWidth="1.5"
            />
            <path d="M 71,28 Q 80,30 82,41" fill="none" stroke={v.gloss} strokeWidth="2.5" strokeLinecap="round" />
          </g>

          <g transform="rotate(6 125 43)">
            <ellipse
              cx="125" cy="43" rx="15.5" ry="20.5"
              fill={`url(#paw-pad-${uid})`}
              stroke={v.padStroke}
              strokeWidth="1.5"
            />
            <path d="M 121,28 Q 130,30 132,41" fill="none" stroke={v.gloss} strokeWidth="2.5" strokeLinecap="round" />
          </g>

          <g transform="rotate(17 164 74)">
            <ellipse
              cx="164" cy="74" rx="14.5" ry="19"
              fill={`url(#paw-pad-${uid})`}
              stroke={v.padStroke}
              strokeWidth="1.5"
            />
            <path d="M 160,60 Q 169,62 171,72" fill="none" stroke={v.gloss} strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Wide heart-dome main paw pad */}
          <path
            d="
              M 100,66
              C 122,66 138,83 152,102
              C 163,118 156,136 133,138
              C 118,139 109,131 100,131
              C 91,131 82,139 67,138
              C 44,136 37,118 48,102
              C 62,83 78,66 100,66
              Z
            "
            fill={`url(#paw-pad-${uid})`}
            stroke={v.padStroke}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />

          {/* Soft upper gloss arc on main pad */}
          <path
            d="M 105,74 Q 124,78 138,98"
            fill="none"
            stroke={v.gloss}
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Button label centered cleanly inside main pad */}
          <text
            x="100"
            y="108"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={v.text}
            fontSize={fontSize}
            fontFamily="Inter, -apple-system, sans-serif"
            fontWeight="700"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            {label}
          </text>
        </svg>
      </motion.div>
    </div>
  );
};

export default PawButton;
