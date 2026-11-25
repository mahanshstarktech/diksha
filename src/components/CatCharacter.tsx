import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { CatMood } from '../lib/stateTypes';

interface CatCharacterProps {
  mood: CatMood;
  size?: number;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Front-Facing Black Void Cat — Expressive & Realistic
   - Starts normal/calm on initial Ask, then progressively shifts through:
     normal → concerned → pleading → hurt → sad → very-sad on repeated "No"s
   - Multi-layered eyes: radial golden iris, expressive pupil dilation & subtle
     gaze shifts, triple specular catchlights, rim-lit eyelid contours, watery
     tear meniscus, natural blink lid, and realistic happy squint crescents
   ═══════════════════════════════════════════════════════════════════════════════ */

const SMOOTH_EASE = [0.22, 1, 0.36, 1] as const;
const MOOD_TRANSITION = { duration: 0.52, ease: SMOOTH_EASE };
const SPRING_SOFT = { type: 'spring' as const, stiffness: 165, damping: 22 };

// ── Mouth paths (identical M Q Q command structure for buttery morphing) ─────
const MOUTH_PATH: Record<CatMood, string> = {
  normal: 'M -7,19.5 Q -3.5,22 0,19.5 Q 3.5,22 7,19.5',
  concerned: 'M -6.5,20 Q -3.2,20.8 0,20 Q 3.2,20.8 6.5,20',
  pleading: 'M -6,21 Q -3,19.6 0,20.2 Q 3,19.6 6,21',
  hurt: 'M -7,22 Q -3.5,19 0,19.6 Q 3.5,19 7,22',
  sad: 'M -7.5,23 Q -3.7,18.2 0,19 Q 3.7,18.2 7.5,23',
  'very-sad': 'M -8.5,24 Q -4.2,17.2 0,18.2 Q 4.2,17.2 8.5,24',
  happy: 'M -9,18 Q -4.5,24 0,18.5 Q 4.5,24 9,18',
  dance: 'M -10,18 Q -5,25 0,18.5 Q 5,25 10,18',
  excited: 'M -9.5,18 Q -4.5,24.5 0,18.5 Q 4.5,24.5 9.5,18',
  hungry: 'M -9,18.5 Q -4.5,24 0,19 Q 4.5,24 9,18.5',
  content: 'M -7.5,19 Q -3.7,22.5 0,19 Q 3.7,22.5 7.5,19',
  curious: 'M -5,20 Q -2.5,22.8 0,21.5 Q 2.5,22.8 5,20',
};

// ── Pupil size (normal oval → wide dilated pleading/excited/hungry eyes) ─────
const PUPIL_RX: Record<CatMood, number> = {
  normal: 9.8,
  concerned: 11.2,
  pleading: 12.8,
  hurt: 13.8,
  sad: 14.6,
  'very-sad': 15.4,
  happy: 11.5,
  dance: 12,
  excited: 14.2,
  hungry: 14.8,
  content: 10.5,
  curious: 12.2,
};

const PUPIL_RY: Record<CatMood, number> = {
  normal: 12.2,
  concerned: 13.0,
  pleading: 13.8,
  hurt: 14.4,
  sad: 15.0,
  'very-sad': 15.6,
  happy: 12,
  dance: 12.5,
  excited: 14.6,
  hungry: 14.8,
  content: 11.8,
  curious: 13.2,
};

// ── Subtle pupil gaze offset (reflects true emotion & focus) ─────────────────
const PUPIL_OFFSET: Record<CatMood, { x: number; y: number }> = {
  normal: { x: 0, y: 0 },
  concerned: { x: 0, y: 0.5 },
  pleading: { x: 0, y: -0.8 },
  hurt: { x: 0, y: 1.0 },
  sad: { x: 0, y: 1.6 },
  'very-sad': { x: 0, y: 2.0 },
  happy: { x: 0, y: -0.5 },
  dance: { x: 0, y: -1.0 },
  excited: { x: 0, y: -1.0 },
  hungry: { x: 0, y: -0.5 },
  content: { x: 0, y: 0.4 },
  curious: { x: 2.2, y: -1.6 },
};

// ── Upper eyelid shapes (uniform M L L Q Z; eye circle r=17.5) ───────────────
// Progressive sad stages lift the inner corner & droop the outer corner
const UPPER_LID_LEFT: Record<CatMood, string> = {
  normal: 'M -20,-24 L 20,-24 L 20,-19 Q 0,-19 -20,-19 Z',
  concerned: 'M -20,-24 L 20,-24 L 20,-15 Q 0,-14 -20,-12 Z',
  pleading: 'M -20,-24 L 20,-24 L 20,-14 Q 1,-10 -20,-7 Z',
  hurt: 'M -20,-24 L 20,-24 L 20,-13 Q 2,-8 -20,-3 Z',
  sad: 'M -20,-24 L 20,-24 L 20,-12 Q 3,-5 -20,0 Z',
  'very-sad': 'M -20,-24 L 20,-24 L 20,-13 Q 3,-3 -20,3 Z',
  happy: 'M -20,-24 L 20,-24 L 20,-19 Q 0,-19 -20,-19 Z',
  dance: 'M -20,-24 L 20,-24 L 20,-19 Q 0,-19 -20,-19 Z',
  excited: 'M -20,-24 L 20,-24 L 20,-19 Q 0,-19 -20,-19 Z',
  hungry: 'M -20,-24 L 20,-24 L 20,-19 Q 0,-19 -20,-19 Z',
  content: 'M -20,-24 L 20,-24 L 20,-10 Q 0,-12 -20,-10 Z',
  curious: 'M -20,-24 L 20,-24 L 20,-19 Q 0,-19 -20,-19 Z',
};

const UPPER_LID_RIGHT: Record<CatMood, string> = {
  normal: 'M -20,-24 L 20,-24 L 20,-19 Q 0,-19 -20,-19 Z',
  concerned: 'M -20,-24 L 20,-24 L 20,-12 Q 0,-14 -20,-15 Z',
  pleading: 'M -20,-24 L 20,-24 L 20,-7 Q -1,-10 -20,-14 Z',
  hurt: 'M -20,-24 L 20,-24 L 20,-3 Q -2,-8 -20,-13 Z',
  sad: 'M -20,-24 L 20,-24 L 20,0 Q -3,-5 -20,-12 Z',
  'very-sad': 'M -20,-24 L 20,-24 L 20,3 Q -3,-3 -20,-13 Z',
  happy: 'M -20,-24 L 20,-24 L 20,-19 Q 0,-19 -20,-19 Z',
  dance: 'M -20,-24 L 20,-24 L 20,-19 Q 0,-19 -20,-19 Z',
  excited: 'M -20,-24 L 20,-24 L 20,-19 Q 0,-19 -20,-19 Z',
  hungry: 'M -20,-24 L 20,-24 L 20,-19 Q 0,-19 -20,-19 Z',
  content: 'M -20,-24 L 20,-24 L 20,-10 Q 0,-12 -20,-10 Z',
  curious: 'M -20,-24 L 20,-24 L 20,-15 Q 0,-17 -20,-15 Z',
};

// ── Lower eyelid shapes (uniform M L L Q Z; eye bottom = +17.5) ──────────────
const LOWER_LID_PATH: Record<CatMood, string> = {
  normal: 'M -20,24 L 20,24 L 20,19 Q 0,19 -20,19 Z',
  concerned: 'M -20,24 L 20,24 L 20,17.5 Q 0,16.5 -20,17.5 Z',
  pleading: 'M -20,24 L 20,24 L 20,16 Q 0,14.5 -20,16 Z',
  hurt: 'M -20,24 L 20,24 L 20,15 Q 0,13 -20,15 Z',
  sad: 'M -20,24 L 20,24 L 20,14 Q 0,11.5 -20,14 Z',
  'very-sad': 'M -20,24 L 20,24 L 20,13 Q 0,10 -20,13 Z',
  happy: 'M -20,24 L 20,24 L 20,3 Q 0,-12 -20,3 Z',
  dance: 'M -20,24 L 20,24 L 20,1 Q 0,-14 -20,1 Z',
  excited: 'M -20,24 L 20,24 L 20,13.5 Q 0,8 -20,13.5 Z',
  hungry: 'M -20,24 L 20,24 L 20,15 Q 0,11 -20,15 Z',
  content: 'M -20,24 L 20,24 L 20,13.5 Q 0,10 -20,13.5 Z',
  curious: 'M -20,24 L 20,24 L 20,19 Q 0,19 -20,19 Z',
};

// ── Watery rim opacity (progressively wells up with sadness) ─────────────────
const WATERY_OPACITY: Record<CatMood, number> = {
  normal: 0,
  concerned: 0.15,
  pleading: 0.35,
  hurt: 0.58,
  sad: 0.78,
  'very-sad': 0.95,
  happy: 0,
  dance: 0,
  excited: 0.2,
  hungry: 0.2,
  content: 0,
  curious: 0,
};

// ── Ear angle (perked when normal/happy, progressively droops on No clicks) ───
const EAR_TILT: Record<CatMood, number> = {
  normal: 0,
  concerned: 3,
  pleading: 6,
  hurt: 9,
  sad: 13,
  'very-sad': 17,
  happy: 0,
  dance: 0,
  excited: 0,
  hungry: 0,
  content: 1,
  curious: 0,
};

// ── Head vertical droop & tilt ───────────────────────────────────────────────
const HEAD_DROP: Record<CatMood, { y: number; rotate: number }> = {
  normal: { y: 0, rotate: 0 },
  concerned: { y: 0.5, rotate: -0.8 },
  pleading: { y: 1.2, rotate: -1.8 },
  hurt: { y: 2.0, rotate: -2.5 },
  sad: { y: 3.0, rotate: -3.2 },
  'very-sad': { y: 4.0, rotate: -4.2 },
  happy: { y: 0, rotate: 0 },
  dance: { y: 0, rotate: 0 },
  excited: { y: -1, rotate: 0 },
  hungry: { y: 0, rotate: 0 },
  content: { y: 0, rotate: 0 },
  curious: { y: 0, rotate: 0 },
};

// ── Tail curves (anchored at hip (0,0) — progressive droop as sadness grows) ─
const TAIL_SWAY: Record<CatMood, [string, string]> = {
  normal: ['M 0,0 Q 38,8 54,-20', 'M 0,0 Q 40,10 57,-14'],
  concerned: ['M 0,0 Q 40,12 56,-6', 'M 0,0 Q 41,13 57,-2'],
  pleading: ['M 0,0 Q 40,15 56,4', 'M 0,0 Q 41,16 57,6'],
  hurt: ['M 0,0 Q 40,17 56,11', 'M 0,0 Q 40,17 56,11'],
  sad: ['M 0,0 Q 38,19 54,16', 'M 0,0 Q 38,19 54,16'],
  'very-sad': ['M 0,0 Q 35,21 48,19', 'M 0,0 Q 35,21 48,19'],
  happy: ['M 0,0 Q 34,4 52,-30', 'M 0,0 Q 38,0 58,-22'],
  dance: ['M 0,0 Q 30,-8 46,-44', 'M 0,0 Q 42,2 62,-32'],
  excited: ['M 0,0 Q 34,-4 52,-38', 'M 0,0 Q 40,2 60,-28'],
  hungry: ['M 0,0 Q 36,6 54,-26', 'M 0,0 Q 40,2 60,-18'],
  content: ['M 0,0 Q 38,10 56,-14', 'M 0,0 Q 40,12 58,-8'],
  curious: ['M 0,0 Q 38,2 50,-32', 'M 0,0 Q 42,4 54,-26'],
};

const BLACK_FUR = '#131317';
const FUR_SOFT = '#1f1f26';
const EAR_INNER = '#26212e';
const LID_RIM = '#353242';
const PAW_LINE = '#32313b';

export const CatCharacter: React.FC<CatCharacterProps> = ({ mood, size = 220 }) => {
  const prefersReduced = useReducedMotion();
  const isDancing = mood === 'dance';
  const isExcited = mood === 'excited';
  const isHungry = mood === 'hungry';
  const isCurious = mood === 'curious';
  const isHappy = mood === 'happy';
  const isVerySad = mood === 'very-sad';
  const isHurtOrWorse = mood === 'hurt' || mood === 'sad' || isVerySad;
  const isSadFamily =
    mood === 'concerned' || mood === 'pleading' || isHurtOrWorse;
  const isSquinting = isHappy || isDancing;
  const isSparkly =
    isExcited || isHungry || mood === 'pleading' || isHurtOrWorse;

  const height = size * (240 / 300);

  const renderEye = (side: 'left' | 'right') => {
    const cx = side === 'left' ? -24 : 24;
    const clipId = `void-cat-eye-${side}`;
    const upperLid = side === 'left' ? UPPER_LID_LEFT[mood] : UPPER_LID_RIGHT[mood];
    const gaze = PUPIL_OFFSET[mood];
    const watery = WATERY_OPACITY[mood];

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

          {/* Expressive black pupil with subtle emotional gaze shift */}
          <motion.ellipse
            fill="#0b0b0e"
            animate={{
              cx: gaze.x,
              cy: gaze.y,
              rx: PUPIL_RX[mood],
              ry: PUPIL_RY[mood],
            }}
            transition={MOOD_TRANSITION}
          />

          {/* Primary specular catchlight */}
          <motion.circle
            fill="white"
            style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
            animate={{
              cx: -5.5 + gaze.x * 0.45,
              cy: -5.5 + gaze.y * 0.45,
              r: isSparkly ? 4.3 : 3.4,
              opacity: isSquinting ? 0.5 : 0.96,
              scale:
                !prefersReduced && (isExcited || isHungry || isHurtOrWorse)
                  ? [1, 1.16, 0.96, 1]
                  : 1,
            }}
            transition={
              !prefersReduced && (isExcited || isHungry || isHurtOrWorse)
                ? { duration: isVerySad ? 1.0 : 1.35, repeat: Infinity, ease: 'easeInOut' }
                : MOOD_TRANSITION
            }
          />

          {/* Secondary lower-right jewel glint */}
          <motion.circle
            fill="white"
            animate={{
              cx: 5.5 + gaze.x * 0.35,
              cy: 5.5 + gaze.y * 0.35,
              r: isHurtOrWorse ? 2.3 : 1.5,
              opacity: isSquinting ? 0 : isSparkly ? 0.92 : 0.65,
            }}
            transition={MOOD_TRANSITION}
          />

          {/* Tertiary upper-right tear/sparkle glint for pleading/sad/excited */}
          <motion.circle
            cx={6.5}
            cy={-4.5}
            r={1.35}
            fill="white"
            style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
            animate={{
              opacity: isSquinting ? 0 : isSparkly ? 0.8 : 0,
              scale: !prefersReduced && isSparkly ? [0.85, 1.25, 0.85] : 1,
            }}
            transition={
              !prefersReduced && isSparkly
                ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }
                : MOOD_TRANSITION
            }
          />

          {/* Watery tear meniscus along lower eye rim */}
          <motion.path
            d="M -14.5,10.5 Q 0,18.5 14.5,10.5"
            fill="none"
            stroke="#bae6fd"
            strokeWidth="2.6"
            strokeLinecap="round"
            animate={{ opacity: watery }}
            transition={MOOD_TRANSITION}
          />

          {/* Mood upper eyelid + subtle rim light so sad/worried slant reads clearly */}
          <motion.path
            fill={BLACK_FUR}
            stroke={LID_RIM}
            strokeWidth="1.25"
            animate={{ d: upperLid }}
            transition={MOOD_TRANSITION}
          />

          {/* Mood lower eyelid (creates happy crescents & cheek-lift) */}
          <motion.path
            fill={BLACK_FUR}
            stroke={isSquinting ? '#eab308' : LID_RIM}
            strokeOpacity={isSquinting ? 0.65 : 0.7}
            strokeWidth="1.25"
            animate={{ d: LOWER_LID_PATH[mood] }}
            transition={MOOD_TRANSITION}
          />

          {/* Natural Blink Lid (y=-62 open, y=-20 closed across -20..+20) */}
          {!prefersReduced && !isSquinting && (
            <motion.rect
              x="-20"
              width="40"
              height="40"
              fill={BLACK_FUR}
              animate={{ y: [-62, -62, -62, -20, -62] }}
              transition={{
                duration: isVerySad ? 3.4 : 4.4,
                times: [0, 0.89, 0.93, 0.965, 1],
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </g>

        {/* Falling teardrop on very-sad (plus subtle gloss bead on sad) */}
        <AnimatePresence>
          {(mood === 'sad' || isVerySad) && (
            <motion.path
              key={`tear-${side}`}
              d="M 0,14 Q -3.5,21 0,26 Q 3.5,21 0,14 Z"
              fill="#7dd3fc"
              initial={{ opacity: 0, y: -3 }}
              animate={
                prefersReduced
                  ? { opacity: isVerySad ? 0.85 : 0.45, y: 2 }
                  : isVerySad
                    ? { opacity: [0.35, 0.95, 0], y: [0, 9, 17] }
                    : { opacity: [0.25, 0.65, 0.25], y: [0, 2, 0] }
              }
              exit={{ opacity: 0 }}
              transition={{
                duration: isVerySad ? 1.45 : 2.2,
                repeat: Infinity,
                ease: isVerySad ? 'easeIn' : 'easeInOut',
                delay: side === 'right' ? 0.65 : 0,
              }}
            />
          )}
        </AnimatePresence>
      </g>
    );
  };

  const [tailA, tailB] = TAIL_SWAY[mood];
  const earTilt = EAR_TILT[mood];
  const headDrop = HEAD_DROP[mood];

  return (
    <motion.div
      style={{ width: `${size / 16}rem`, height: `${height / 16}rem`, position: 'relative' }}
      animate={
        prefersReduced
          ? {}
          : isDancing
            ? { y: [0, -9, 0, -6, 0], rotate: [0, -2.5, 0, 2.5, 0] }
            : isExcited
              ? { y: [0, -5, 0], rotate: [-1, 1, -1] }
              : isHungry
                ? { y: [0, -3, 0] }
                : isVerySad
                  ? { y: [0, 1.5, 0], x: [-0.7, 0.7, -0.7] }
                  : { y: [0, -1.5, 0], rotate: 0, x: 0 }
      }
      transition={
        prefersReduced
          ? { duration: 0 }
          : isDancing
            ? { duration: 0.65, repeat: Infinity, ease: 'easeInOut' }
            : isExcited
              ? { duration: 1.1, repeat: Infinity, ease: 'easeInOut' }
              : isVerySad
                ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
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
                💗
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
              🐾
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
              d: prefersReduced || isHurtOrWorse ? tailA : [tailA, tailB, tailA],
            }}
            transition={
              prefersReduced || isHurtOrWorse
                ? MOOD_TRANSITION
                : isDancing
                  ? { duration: 0.65, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
            }
          />
        </g>

        {/* ── Sitting Body ─────────────────────────────────────── */}
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

        {/* Subtle chest fur curve */}
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

        {/* ── Cohesive Head Group (ears + head + face tilt smoothly together) ─ */}
        <g transform="translate(150, 100)">
          <motion.g
            style={{ transformBox: 'fill-box', transformOrigin: '50% 72%' }}
            animate={
              prefersReduced
                ? { rotate: headDrop.rotate, y: headDrop.y }
                : isCurious
                  ? { rotate: [-4, 6, -4], y: [0, -1.5, 0] }
                  : isSadFamily
                    ? { rotate: headDrop.rotate, y: headDrop.y }
                    : isDancing
                      ? { rotate: [-3, 3, -3], y: [0, -2, 0] }
                      : { rotate: headDrop.rotate, y: [0, 1, 0] }
            }
            transition={
              isCurious
                ? { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
                : isSadFamily
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
                  rotate: isSadFamily
                    ? -earTilt
                    : isCurious
                      ? (prefersReduced ? -3 : [-4, 3, -4])
                      : isHappy || isExcited || isDancing
                        ? (prefersReduced ? 0 : [0, -4, 0])
                        : 0,
                }}
                transition={
                  isSadFamily
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
                  rotate: isSadFamily
                    ? earTilt
                    : isCurious
                      ? (prefersReduced ? 2 : [2, -3, 2])
                      : isHappy || isExcited || isDancing
                        ? (prefersReduced ? 0 : [0, 4, 0])
                        : 0,
                }}
                transition={
                  isSadFamily
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
