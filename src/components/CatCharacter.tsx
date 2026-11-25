import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { CatMood } from '../lib/stateTypes';

interface CatCharacterProps {
  mood: CatMood;
  size?: number;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Front-Facing Black Void Cat — inspired by user's reference image.
   - Sleek matte-black silhouette, tall pointed ears, subtle whiskers & nose
   - Large golden-ringed eyes with dilating pupils & white catchlights
   - Uniform SVG path commands so every mood transition morphs smoothly
   - Bulletproof clipPath-contained eyelid blink + fill-box transform origins
   ═══════════════════════════════════════════════════════════════════════════════ */

const SMOOTH_EASE = [0.22, 1, 0.36, 1] as const;
const MOOD_TRANSITION = { duration: 0.5, ease: SMOOTH_EASE };
const SPRING_SOFT = { type: 'spring' as const, stiffness: 170, damping: 22 };

// ── Mouth paths (all use identical M Q Q command structure for smooth morphing) ─
const MOUTH_PATH: Record<CatMood, string> = {
  happy: 'M -9,18 Q -4.5,24 0,18.5 Q 4.5,24 9,18',
  dance: 'M -10,18 Q -5,25 0,18.5 Q 5,25 10,18',
  excited: 'M -9.5,18 Q -4.5,24.5 0,18.5 Q 4.5,24.5 9.5,18',
  hungry: 'M -9,18.5 Q -4.5,24 0,19 Q 4.5,24 9,18.5',
  content: 'M -7.5,19 Q -3.7,22.5 0,19 Q 3.7,22.5 7.5,19',
  'small-smile': 'M -7,19.5 Q -3.5,22 0,19.5 Q 3.5,22 7,19.5',
  curious: 'M -5,20 Q -2.5,23 0,21.5 Q 2.5,23 5,20',
  neutral: 'M -6,20.5 Q -3,20.8 0,20.5 Q 3,20.8 6,20.5',
  sad: 'M -7,22.5 Q -3.5,19 0,19.5 Q 3.5,19 7,22.5',
  'very-sad': 'M -8,23.5 Q -4,18 0,18.8 Q 4,18 8,23.5',
};

// ── Pupil dimensions (dilate realistically when pleading, excited, or hungry) ─
const PUPIL_RX: Record<CatMood, number> = {
  happy: 11.5,
  dance: 12,
  excited: 14,
  hungry: 14.5,
  content: 10.5,
  curious: 12.5,
  'small-smile': 10.5,
  neutral: 9.5,
  sad: 14.2,
  'very-sad': 15,
};

const PUPIL_RY: Record<CatMood, number> = {
  happy: 12,
  dance: 12.5,
  excited: 14.5,
  hungry: 14.5,
  content: 11.8,
  curious: 13.5,
  'small-smile': 11.8,
  neutral: 11.5,
  sad: 14.5,
  'very-sad': 15.2,
};

// ── Upper eyelid shapes (uniform M L L Q Z commands; eye radius = 17.5) ──────
const UPPER_LID_LEFT: Record<CatMood, string> = {
  happy: 'M -20,-24 L 20,-24 L 20,-19 Q 0,-19 -20,-19 Z',
  dance: 'M -20,-24 L 20,-24 L 20,-19 Q 0,-19 -20,-19 Z',
  excited: 'M -20,-24 L 20,-24 L 20,-19 Q 0,-19 -20,-19 Z',
  hungry: 'M -20,-24 L 20,-24 L 20,-19 Q 0,-19 -20,-19 Z',
  content: 'M -20,-24 L 20,-24 L 20,-10 Q 0,-12 -20,-10 Z',
  curious: 'M -20,-24 L 20,-24 L 20,-19 Q 0,-19 -20,-19 Z',
  'small-smile': 'M -20,-24 L 20,-24 L 20,-13 Q 0,-15 -20,-13 Z',
  neutral: 'M -20,-24 L 20,-24 L 20,-9 Q 0,-10 -20,-9 Z',
  sad: 'M -20,-24 L 20,-24 L 20,-11 Q 2,-6 -20,-3 Z',
  'very-sad': 'M -20,-24 L 20,-24 L 20,-13 Q 2,-5 -20,1 Z',
};

const UPPER_LID_RIGHT: Record<CatMood, string> = {
  happy: 'M -20,-24 L 20,-24 L 20,-19 Q 0,-19 -20,-19 Z',
  dance: 'M -20,-24 L 20,-24 L 20,-19 Q 0,-19 -20,-19 Z',
  excited: 'M -20,-24 L 20,-24 L 20,-19 Q 0,-19 -20,-19 Z',
  hungry: 'M -20,-24 L 20,-24 L 20,-19 Q 0,-19 -20,-19 Z',
  content: 'M -20,-24 L 20,-24 L 20,-10 Q 0,-12 -20,-10 Z',
  curious: 'M -20,-24 L 20,-24 L 20,-16 Q 0,-17 -20,-16 Z',
  'small-smile': 'M -20,-24 L 20,-24 L 20,-13 Q 0,-15 -20,-13 Z',
  neutral: 'M -20,-24 L 20,-24 L 20,-9 Q 0,-10 -20,-9 Z',
  sad: 'M -20,-24 L 20,-24 L 20,-3 Q -2,-6 -20,-11 Z',
  'very-sad': 'M -20,-24 L 20,-24 L 20,1 Q -2,-5 -20,-13 Z',
};

// ── Lower eyelid shapes (uniform M L L Q Z commands; eye bottom = +17.5) ─────
const LOWER_LID_PATH: Record<CatMood, string> = {
  happy: 'M -20,24 L 20,24 L 20,3 Q 0,-11 -20,3 Z',
  dance: 'M -20,24 L 20,24 L 20,1 Q 0,-13 -20,1 Z',
  excited: 'M -20,24 L 20,24 L 20,14 Q 0,9 -20,14 Z',
  hungry: 'M -20,24 L 20,24 L 20,16 Q 0,13 -20,16 Z',
  content: 'M -20,24 L 20,24 L 20,14 Q 0,11 -20,14 Z',
  curious: 'M -20,24 L 20,24 L 20,19 Q 0,19 -20,19 Z',
  'small-smile': 'M -20,24 L 20,24 L 20,13 Q 0,10 -20,13 Z',
  neutral: 'M -20,24 L 20,24 L 20,19 Q 0,19 -20,19 Z',
  sad: 'M -20,24 L 20,24 L 20,15 Q 0,13 -20,15 Z',
  'very-sad': 'M -20,24 L 20,24 L 20,14 Q 0,12 -20,14 Z',
};

// ── Tail curves (morphed directly via d from hip (0,0) — never detaches!) ────
const TAIL_SWAY: Record<CatMood, [string, string]> = {
  happy: ['M 0,0 Q 34,4 52,-30', 'M 0,0 Q 38,0 58,-22'],
  dance: ['M 0,0 Q 30,-8 46,-44', 'M 0,0 Q 42,2 62,-32'],
  excited: ['M 0,0 Q 34,-4 52,-38', 'M 0,0 Q 40,2 60,-28'],
  hungry: ['M 0,0 Q 36,6 54,-26', 'M 0,0 Q 40,2 60,-18'],
  content: ['M 0,0 Q 38,10 56,-14', 'M 0,0 Q 40,12 58,-8'],
  curious: ['M 0,0 Q 38,2 50,-32', 'M 0,0 Q 42,4 54,-26'],
  'small-smile': ['M 0,0 Q 40,12 56,-8', 'M 0,0 Q 42,14 58,-4'],
  neutral: ['M 0,0 Q 42,14 58,-2', 'M 0,0 Q 42,15 58,0'],
  sad: ['M 0,0 Q 40,18 58,14', 'M 0,0 Q 40,18 58,14'],
  'very-sad': ['M 0,0 Q 38,20 52,18', 'M 0,0 Q 38,20 52,18'],
};

const BLACK_FUR = '#131317';
const FUR_SOFT = '#1f1f26';
const EAR_INNER = '#26212e';
const PAW_LINE = '#32313b';

export const CatCharacter: React.FC<CatCharacterProps> = ({ mood, size = 220 }) => {
  const prefersReduced = useReducedMotion();
  const isDancing = mood === 'dance';
  const isExcited = mood === 'excited';
  const isHungry = mood === 'hungry';
  const isCurious = mood === 'curious';
  const isHappy = mood === 'happy';
  const isVerySad = mood === 'very-sad';
  const isSad = mood === 'sad' || isVerySad;
  const isSquinting = isHappy || isDancing;

  const height = size * (240 / 300);

  const renderEye = (side: 'left' | 'right') => {
    const cx = side === 'left' ? -24 : 24;
    const clipId = `void-cat-eye-${side}`;
    const upperLid = side === 'left' ? UPPER_LID_LEFT[mood] : UPPER_LID_RIGHT[mood];

    return (
      <g key={side} transform={`translate(${cx}, 0)`}>
        <defs>
          <clipPath id={clipId}>
            <circle cx="0" cy="0" r="17.5" />
          </clipPath>
        </defs>

        {/* Subtle golden outer rim glow */}
        <circle cx="0" cy="0" r="18.2" fill="#d49b1a" opacity="0.22" />

        {/* Clipped eye interior */}
        <g clipPath={`url(#${clipId})`}>
          {/* Golden iris */}
          <circle cx="0" cy="0" r="17.5" fill="url(#cat-gold-iris)" />

          {/* Expressive black pupil */}
          <motion.ellipse
            cx={0}
            cy={isSad ? 1.5 : 0}
            fill="#0b0b0e"
            animate={{
              rx: PUPIL_RX[mood],
              ry: PUPIL_RY[mood],
            }}
            transition={MOOD_TRANSITION}
          />

          {/* Main specular catchlight */}
          <motion.circle
            cx={-5.5}
            cy={-5.5}
            fill="white"
            style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
            animate={{
              r: isExcited || isHungry || isSad ? 4.2 : 3.4,
              opacity: isSquinting ? 0.45 : 0.95,
              scale: !prefersReduced && (isExcited || isHungry) ? [1, 1.18, 1] : 1,
            }}
            transition={
              !prefersReduced && (isExcited || isHungry)
                ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
                : MOOD_TRANSITION
            }
          />

          {/* Secondary subtle eye glint */}
          <motion.circle
            cx={5.5}
            cy={5.5}
            r={isSad ? 2.2 : 1.5}
            fill="white"
            animate={{
              opacity: isSquinting ? 0 : isSad ? 0.9 : 0.65,
            }}
            transition={MOOD_TRANSITION}
          />

          {/* Watery lower-rim shimmer when sad */}
          <motion.path
            d="M -14,11 Q 0,18 14,11"
            fill="none"
            stroke="#bae6fd"
            strokeWidth="2.4"
            strokeLinecap="round"
            animate={{ opacity: isSad ? (isVerySad ? 0.85 : 0.55) : 0 }}
            transition={MOOD_TRANSITION}
          />

          {/* Mood upper eyelid */}
          <motion.path
            fill={BLACK_FUR}
            animate={{ d: upperLid }}
            transition={MOOD_TRANSITION}
          />

          {/* Mood lower eyelid (creates happy smiling eyes) */}
          <motion.path
            fill={BLACK_FUR}
            animate={{ d: LOWER_LID_PATH[mood] }}
            transition={MOOD_TRANSITION}
          />

          {/* Natural Blink Lid: y=-60 keeps bottom edge at -20 (fully open); y=-20 covers -20..+20 */}
          {!prefersReduced && !isSquinting && (
            <motion.rect
              x="-20"
              width="40"
              height="40"
              fill={BLACK_FUR}
              animate={{ y: [-60, -60, -60, -20, -60] }}
              transition={{
                duration: 4.4,
                times: [0, 0.9, 0.935, 0.968, 1],
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </g>

        {/* Falling teardrop for very-sad */}
        <AnimatePresence>
          {isVerySad && (
            <motion.path
              key={`tear-${side}`}
              d="M 0,14 Q -3.5,21 0,26 Q 3.5,21 0,14 Z"
              fill="#7dd3fc"
              initial={{ opacity: 0, y: -3 }}
              animate={
                prefersReduced
                  ? { opacity: 0.85, y: 2 }
                  : { opacity: [0.3, 0.95, 0], y: [0, 9, 17] }
              }
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeIn',
                delay: side === 'right' ? 0.65 : 0,
              }}
            />
          )}
        </AnimatePresence>
      </g>
    );
  };

  const [tailA, tailB] = TAIL_SWAY[mood];

  return (
    <motion.div
      style={{ width: size, height, position: 'relative' }}
      animate={
        prefersReduced
          ? {}
          : isDancing
            ? { y: [0, -9, 0, -6, 0], rotate: [0, -2.5, 0, 2.5, 0] }
            : isExcited
              ? { y: [0, -5, 0], rotate: [-1, 1, -1] }
              : isHungry
                ? { y: [0, -3, 0] }
                : { y: [0, -1.5, 0], rotate: 0 }
      }
      transition={
        prefersReduced
          ? { duration: 0 }
          : isDancing
            ? { duration: 0.65, repeat: Infinity, ease: 'easeInOut' }
            : isExcited
              ? { duration: 1.1, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }
      }
    >
      <svg
        viewBox="0 0 300 240"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={`Black cat feeling ${mood}`}
        role="img"
      >
        <defs>
          <radialGradient id="cat-gold-iris" cx="48%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="65%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#b47b09" />
          </radialGradient>
        </defs>

        {/* ── Floating mood reactions ─────────────────────────── */}
        <AnimatePresence>
          {(isHappy || isExcited) && !prefersReduced && (
            <motion.text
              key={`heart-${mood}`}
              x="228"
              y="44"
              fontSize="20"
              style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
              initial={{ opacity: 0, y: 10, scale: 0.7 }}
              animate={{ opacity: [0, 1, 1, 0], y: [8, -4, -14, -22], scale: [0.75, 1.08, 1, 0.85] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.3, repeat: Infinity, ease: 'easeOut' }}
            >
              💗
            </motion.text>
          )}
          {isDancing && !prefersReduced && (
            <>
              <motion.text
                key="dance-note"
                x="44"
                y="46"
                fontSize="20"
                style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
                animate={{ opacity: [0.3, 1, 0.3], y: [4, -10, 4], rotate: [-8, 8, -8] }}
                transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
              >
                🎵
              </motion.text>
              <motion.text
                key="dance-sparkle"
                x="234"
                y="48"
                fontSize="18"
                style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
                animate={{ opacity: [0.3, 1, 0.3], y: [-6, 6, -6], rotate: [8, -8, 8] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
              >
                ✨
              </motion.text>
            </>
          )}
          {isCurious && !prefersReduced && (
            <motion.text
              key="curious-q"
              x="228"
              y="44"
              fontSize="22"
              fontWeight="800"
              fill="#7c3aed"
              style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
              animate={{ opacity: [0.55, 1, 0.55], y: [2, -7, 2], rotate: [-6, 6, -6] }}
              transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
            >
              ?
            </motion.text>
          )}
          {isHungry && !prefersReduced && (
            <motion.text
              key="hungry-sparkle"
              x="230"
              y="44"
              fontSize="20"
              style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
              animate={{ opacity: [0.35, 1, 0.35], scale: [0.85, 1.2, 0.85] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              ✨
            </motion.text>
          )}
        </AnimatePresence>

        {/* ── Soft ground shadow ───────────────────────────────── */}
        <ellipse cx="150" cy="222" rx="60" ry="8" fill="rgba(45, 26, 74, 0.14)" />

        {/* ── Expressive Tail (morphed d-curve anchored at (192, 204)) ── */}
        <g transform="translate(192, 204)">
          <motion.path
            fill="none"
            stroke={BLACK_FUR}
            strokeWidth="13"
            strokeLinecap="round"
            animate={{
              d: prefersReduced || isSad ? tailA : [tailA, tailB, tailA],
            }}
            transition={
              prefersReduced || isSad
                ? MOOD_TRANSITION
                : isDancing
                  ? { duration: 0.65, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
            }
          />
        </g>

        {/* ── Sitting Body (front-facing, cute compact silhouette) ─ */}
        <path
          d="
            M 106,130
            C 95,155 92,188 97,208
            C 101,220 118,224 150,224
            C 182,224 199,220 203,208
            C 208,188 205,155 194,130
            Z
          "
          fill={BLACK_FUR}
        />

        {/* Subtle chest fur curve so torso reads cleanly */}
        <path
          d="M 134,148 Q 150,162 166,148 Q 150,155 134,148 Z"
          fill={FUR_SOFT}
          opacity="0.7"
        />

        {/* ── Cute Front Sitting Paws ──────────────────────────── */}
        <g transform="translate(128, 215)">
          <motion.g
            style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
            animate={
              prefersReduced
                ? { y: 0, rotate: 0 }
                : isDancing
                  ? { y: [0, -8, 0], rotate: [0, -8, 0] }
                  : isExcited || isHungry
                    ? { y: [0, -5, 0], rotate: [0, -5, 0] }
                    : isHappy
                      ? { y: [0, -3, 0] }
                      : { y: 0, rotate: 0 }
            }
            transition={
              isDancing
                ? { duration: 0.45, repeat: Infinity, ease: 'easeInOut' }
                : isExcited || isHungry
                  ? { duration: 0.7, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            <ellipse cx="0" cy="0" rx="14" ry="9.5" fill={BLACK_FUR} stroke={FUR_SOFT} strokeWidth="1.2" />
            <line x1="-4.5" y1="2" x2="-4.5" y2="8.5" stroke={PAW_LINE} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="4.5" y1="2" x2="4.5" y2="8.5" stroke={PAW_LINE} strokeWidth="1.5" strokeLinecap="round" />
          </motion.g>
        </g>

        <g transform="translate(172, 215)">
          <motion.g
            style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
            animate={
              prefersReduced
                ? { y: 0, rotate: 0 }
                : isDancing
                  ? { y: [0, -8, 0], rotate: [0, 8, 0] }
                  : isExcited || isHungry
                    ? { y: [0, -5, 0], rotate: [0, 5, 0] }
                    : isHappy
                      ? { y: [0, -3, 0] }
                      : { y: 0, rotate: 0 }
            }
            transition={
              isDancing
                ? { duration: 0.45, repeat: Infinity, ease: 'easeInOut', delay: 0.22 }
                : isExcited || isHungry
                  ? { duration: 0.7, repeat: Infinity, ease: 'easeInOut', delay: 0.35 }
                  : { duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }
            }
          >
            <ellipse cx="0" cy="0" rx="14" ry="9.5" fill={BLACK_FUR} stroke={FUR_SOFT} strokeWidth="1.2" />
            <line x1="-4.5" y1="2" x2="-4.5" y2="8.5" stroke={PAW_LINE} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="4.5" y1="2" x2="4.5" y2="8.5" stroke={PAW_LINE} strokeWidth="1.5" strokeLinecap="round" />
          </motion.g>
        </g>

        {/* ── Cohesive Head Group (ears + head + face tilt together) ─ */}
        <g transform="translate(150, 100)">
          <motion.g
            style={{ transformBox: 'fill-box', transformOrigin: '50% 72%' }}
            animate={
              prefersReduced
                ? { rotate: 0, y: 0 }
                : isCurious
                  ? { rotate: [-4, 6, -4], y: [0, -1.5, 0] }
                  : isSad
                    ? { rotate: isVerySad ? -4 : -2.5, y: 3 }
                    : isDancing
                      ? { rotate: [-3, 3, -3], y: [0, -2, 0] }
                      : { rotate: 0, y: [0, 1, 0] }
            }
            transition={
              isCurious
                ? { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
                : isSad
                  ? SPRING_SOFT
                  : isDancing
                    ? { duration: 0.65, repeat: Infinity, ease: 'easeInOut' }
                    : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            {/* Left Ear — single unified group anchored at its base inside skull */}
            <g transform="translate(-34, -22)">
              <motion.g
                style={{ transformBox: 'fill-box', transformOrigin: '60% 85%' }}
                animate={{
                  rotate: isSad
                    ? (isVerySad ? -14 : -9)
                    : isCurious
                      ? (prefersReduced ? -3 : [-4, 3, -4])
                      : isHappy || isExcited || isDancing
                        ? (prefersReduced ? 0 : [0, -4, 0])
                        : 0,
                }}
                transition={
                  isSad
                    ? SPRING_SOFT
                    : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
                }
              >
                <path
                  d="M -20,16 C -24,-8 -18,-34 -10,-44 C -2,-48 12,-24 20,2 Z"
                  fill={BLACK_FUR}
                />
                <path
                  d="M -12,9 C -14,-8 -11,-24 -7,-31 C -3,-33 5,-18 10,0 Z"
                  fill={EAR_INNER}
                />
              </motion.g>
            </g>

            {/* Right Ear — single unified group anchored at its base inside skull */}
            <g transform="translate(34, -22)">
              <motion.g
                style={{ transformBox: 'fill-box', transformOrigin: '40% 85%' }}
                animate={{
                  rotate: isSad
                    ? (isVerySad ? 14 : 9)
                    : isCurious
                      ? (prefersReduced ? 2 : [2, -3, 2])
                      : isHappy || isExcited || isDancing
                        ? (prefersReduced ? 0 : [0, 4, 0])
                        : 0,
                }}
                transition={
                  isSad
                    ? SPRING_SOFT
                    : { duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }
                }
              >
                <path
                  d="M 20,16 C 24,-8 18,-34 10,-44 C 2,-48 -12,-24 -20,2 Z"
                  fill={BLACK_FUR}
                />
                <path
                  d="M 12,9 C 14,-8 11,-24 7,-31 C 3,-33 -5,-18 -10,0 Z"
                  fill={EAR_INNER}
                />
              </motion.g>
            </g>

            {/* Head silhouette (round with plump cheeks, facing front) */}
            <path
              d="
                M 0,-42
                C 34,-42 58,-24 58,4
                C 58,28 36,42 0,42
                C -36,42 -58,28 -58,4
                C -58,-24 -34,-42 0,-42
                Z
              "
              fill={BLACK_FUR}
            />

            {/* Subtle cheek whiskers */}
            <g stroke="#393744" strokeWidth="1.35" strokeLinecap="round" opacity="0.75">
              <path d="M -42,8 Q -58,5 -68,8" fill="none" />
              <path d="M -44,14 Q -60,14 -70,17" fill="none" />
              <path d="M -40,20 Q -56,23 -64,27" fill="none" />
              <path d="M 42,8 Q 58,5 68,8" fill="none" />
              <path d="M 44,14 Q 60,14 70,17" fill="none" />
              <path d="M 40,20 Q 56,23 64,27" fill="none" />
            </g>

            {/* Golden-ringed Expressive Cat Eyes */}
            {renderEye('left')}
            {renderEye('right')}

            {/* Tiny soft plum cat nose */}
            <path
              d="M -3.5,12.5 Q 0,10.5 3.5,12.5 Q 2,16.5 0,17 Q -2,16.5 -3.5,12.5 Z"
              fill="#6e4b5b"
            />

            {/* Expressive tiny cat mouth (smoothly morphs per mood) */}
            <motion.path
              fill="none"
              stroke="#9e96aa"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ d: MOUTH_PATH[mood] }}
              transition={MOOD_TRANSITION}
            />
          </motion.g>
        </g>
      </svg>
    </motion.div>
  );
};

export default CatCharacter;
