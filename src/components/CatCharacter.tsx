import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { CatMood } from '../lib/stateTypes';

interface CatCharacterProps {
  mood: CatMood;
  size?: number;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Animated Bongo Cat — tailored per step/mood:
   - Eye blink, ear wiggles, head tilt & breathing
   - Expressive alternating or double paw bongo taps
   - Mood-driven props (hearts, music notes, sparkles, question mark, teardrops)
   ═══════════════════════════════════════════════════════════════════════════════ */

const MOUTH: Record<CatMood, string> = {
  happy: 'M 155,106 Q 163,122 172,110 Q 176,106 180,110 Q 189,122 197,106',
  excited: 'M 153,105 Q 162,124 171,110 Q 176,105 181,110 Q 190,124 199,105',
  hungry: 'M 155,106 Q 164,122 173,110 Q 177,106 181,110 Q 190,122 198,106',
  content: 'M 158,108 Q 165,120 172,111 Q 176,107 180,111 Q 187,120 194,108',
  curious: 'M 161,111 Q 171,115 178,109 Q 185,115 193,110',
  'small-smile': 'M 160,109 Q 167,117 174,111 Q 177,109 180,111 Q 187,117 194,109',
  neutral: 'M 162,110 Q 177,112 192,110',
  sad: 'M 158,114 Q 177,104 196,114',
  'very-sad': 'M 156,117 Q 177,100 198,117',
  dance: 'M 153,105 Q 162,124 171,110 Q 176,105 181,110 Q 190,124 199,105',
};

const EYE_RY: Record<CatMood, number> = {
  happy: 3.5,
  excited: 13.5,
  hungry: 14,
  content: 12,
  curious: 13.5,
  'small-smile': 11,
  neutral: 14,
  sad: 14,
  'very-sad': 15.5,
  dance: 2.5,
};

const HL_OP: Record<CatMood, number> = {
  happy: 0,
  excited: 1,
  hungry: 1,
  content: 0.95,
  curious: 0.95,
  'small-smile': 0.9,
  neutral: 0.95,
  sad: 0.9,
  'very-sad': 0.95,
  dance: 0,
};

const BLUSH: Record<CatMood, number> = {
  happy: 0.48,
  excited: 0.55,
  hungry: 0.5,
  content: 0.35,
  curious: 0.25,
  'small-smile': 0.3,
  neutral: 0,
  sad: 0.2,
  'very-sad': 0.25,
  dance: 0.55,
};

const spring = { type: 'spring' as const, stiffness: 220, damping: 20 };

export const CatCharacter: React.FC<CatCharacterProps> = ({ mood, size = 220 }) => {
  const prefersReduced = useReducedMotion();
  const isDancing = mood === 'dance';
  const isExcited = mood === 'excited';
  const isHungry = mood === 'hungry';
  const isCurious = mood === 'curious';
  const isHappy = mood === 'happy';
  const isVerySad = mood === 'very-sad';
  const isSad = mood === 'sad' || isVerySad;
  const shouldBlink = !isHappy && !isDancing;

  const height = size * (196 / 340);

  // Outer body animation per mood
  const getBodyAnimate = () => {
    if (prefersReduced) return {};
    if (isDancing) {
      return { y: [0, -10, 0, -7, 0], rotate: [0, -3.5, 0, 3.5, 0] };
    }
    if (isExcited) {
      return { y: [0, -6, 0, -4, 0], rotate: [-1.5, 1.5, -1.5] };
    }
    if (isHungry) {
      return { y: [0, -4, 0], scale: [1, 1.02, 1] };
    }
    if (isCurious) {
      return { rotate: [-2.5, 3, -2.5], y: [0, -2, 0] };
    }
    if (isHappy) {
      return { y: [0, -4, 0], rotate: [-1.5, 1.5, -1.5] };
    }
    if (isVerySad) {
      return { rotate: [-3.5, -2.5, -3.5], y: [0, 1.5, 0] };
    }
    if (isSad) {
      return { rotate: -3, y: [0, 1, 0] };
    }
    return { y: [0, -2, 0], rotate: 0 };
  };

  const getBodyTransition = () => {
    if (prefersReduced) return { duration: 0 };
    if (isDancing) return { duration: 0.55, repeat: Infinity, ease: 'easeInOut' as const };
    if (isExcited) return { duration: 0.9, repeat: Infinity, ease: 'easeInOut' as const };
    if (isHungry) return { duration: 1.1, repeat: Infinity, ease: 'easeInOut' as const };
    if (isCurious) return { duration: 2.6, repeat: Infinity, ease: 'easeInOut' as const };
    if (isHappy) return { duration: 1.8, repeat: Infinity, ease: 'easeInOut' as const };
    if (isVerySad) return { duration: 1.6, repeat: Infinity, ease: 'easeInOut' as const };
    if (isSad) return { duration: 2.4, repeat: Infinity, ease: 'easeInOut' as const };
    return { duration: 2.6, repeat: Infinity, ease: 'easeInOut' as const };
  };

  // Left & Right paw animations (bongo taps vs poses)
  const getLeftPawAnimate = () => {
    if (prefersReduced) return { y: 0, rotate: 0 };
    if (isDancing) return { y: [0, -18, 0, 2, 0], rotate: [0, 10, 0, -4, 0] };
    if (isExcited || isHungry) return { y: [0, -14, 0, -2, 0], rotate: [0, 8, 0] };
    if (isHappy) return { y: [0, -9, 0, 0, 0], rotate: [0, 6, 0, 0, 0] };
    if (isCurious) return { y: [0, -10, -8, 0], rotate: [0, 10, 8, 0] };
    if (isSad) return { y: 4, rotate: -4 };
    return { y: [0, -4, 0], rotate: 0 };
  };

  const getRightPawAnimate = () => {
    if (prefersReduced) return { y: 0, rotate: 0 };
    if (isDancing) return { y: [0, 2, 0, -18, 0], rotate: [0, 4, 0, -10, 0] };
    if (isExcited || isHungry) return { y: [0, -2, 0, -14, 0], rotate: [0, -8, 0] };
    if (isHappy) return { y: [0, 0, 0, -9, 0], rotate: [0, 0, 0, -6, 0] };
    if (isCurious) return { y: [0, -2, 0], rotate: 0 };
    if (isSad) return { y: 4, rotate: 4 };
    return { y: [0, -4, 0], rotate: 0 };
  };

  const getPawTransition = (delay = 0) => {
    if (prefersReduced) return { duration: 0 };
    if (isDancing) return { duration: 0.48, repeat: Infinity, ease: 'easeInOut' as const, delay };
    if (isExcited || isHungry) return { duration: 0.65, repeat: Infinity, ease: 'easeInOut' as const, delay };
    if (isHappy) return { duration: 1.4, repeat: Infinity, ease: 'easeInOut' as const, delay };
    if (isCurious) return { duration: 2.2, repeat: Infinity, ease: 'easeInOut' as const };
    if (isSad) return spring;
    return { duration: 2.4, repeat: Infinity, ease: 'easeInOut' as const, delay };
  };

  // Ear wiggle
  const getEarAnimate = (dir: -1 | 1) => {
    if (prefersReduced) return { rotate: 0 };
    if (isSad) return { rotate: dir * 6 };
    if (isCurious) return { rotate: dir === -1 ? [0, -7, 0] : [0, 3, 0] };
    if (isDancing || isExcited || isHappy) return { rotate: [0, dir * -5, 0] };
    return { rotate: [0, dir * -2.5, 0] };
  };

  return (
    <motion.div
      style={{ width: size, height, position: 'relative' }}
      animate={getBodyAnimate()}
      transition={getBodyTransition()}
    >
      <svg
        viewBox="0 -14 340 196"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={`Bongo cat feeling ${mood}`}
        role="img"
      >
        {/* ── Floating mood props ─────────────────────────────── */}
        <AnimatePresence>
          {(isHappy || isExcited) && !prefersReduced && (
            <motion.text
              key={`heart-${mood}`}
              x="275"
              y="26"
              fontSize="20"
              initial={{ opacity: 0, y: 12, scale: 0.6 }}
              animate={{ opacity: [0, 1, 1, 0], y: [10, -4, -14, -22], scale: [0.7, 1.05, 1, 0.85] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
            >
              💗
            </motion.text>
          )}
          {isDancing && !prefersReduced && (
            <>
              <motion.text
                key="note-1"
                x="34"
                y="22"
                fontSize="20"
                animate={{ opacity: [0.2, 1, 0.2], y: [4, -10, 4], rotate: [-8, 8, -8] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                🎵
              </motion.text>
              <motion.text
                key="note-2"
                x="286"
                y="24"
                fontSize="18"
                animate={{ opacity: [0.2, 1, 0.2], y: [-6, 6, -6], rotate: [8, -8, 8] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
              >
                ✨
              </motion.text>
            </>
          )}
          {isCurious && !prefersReduced && (
            <motion.text
              key="curious-mark"
              x="274"
              y="22"
              fontSize="20"
              fontWeight="700"
              fill="#7c3aed"
              animate={{ opacity: [0.5, 1, 0.5], y: [2, -6, 2], rotate: [-6, 6, -6] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              ?
            </motion.text>
          )}
          {isHungry && !prefersReduced && (
            <motion.text
              key="hungry-sparkle"
              x="276"
              y="22"
              fontSize="19"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
            >
              ✨
            </motion.text>
          )}
        </AnimatePresence>

        {/* ── Table / surface line ─────────────────────────────── */}
        <line
          x1="10" y1="138" x2="330" y2="138"
          stroke="#2d2d2d" strokeWidth="4.5" strokeLinecap="round"
        />

        {/* ── Head + body outline ──────────────────────────────── */}
        <path
          d="
            M 52,138
            C 28,136 16,118 20,96
            C 24,72 48,52 78,42
            L 100,10
            L 122,44
            C 142,54 158,58 170,58
            C 182,58 198,54 218,44
            L 240,10
            L 262,42
            C 292,52 316,72 320,96
            C 324,118 312,136 288,138
            Z
          "
          fill="white"
          stroke="#2d2d2d"
          strokeWidth="5"
          strokeLinejoin="round"
        />

        {/* ── Left inner ear (animated twitch) ────────────────── */}
        <motion.g
          animate={getEarAnimate(-1)}
          transition={{ duration: 2.2, repeat: isSad ? 0 : Infinity, ease: 'easeInOut' }}
          style={{ originX: '101px', originY: '44px' }}
        >
          <path d="M 86,44 L 101,16 L 118,44 Z" fill="#ffb5c5" opacity="0.65" />
        </motion.g>

        {/* ── Right inner ear (animated twitch) ───────────────── */}
        <motion.g
          animate={getEarAnimate(1)}
          transition={{ duration: 2.2, repeat: isSad ? 0 : Infinity, ease: 'easeInOut', delay: 0.2 }}
          style={{ originX: '239px', originY: '44px' }}
        >
          <path d="M 222,44 L 239,16 L 254,44 Z" fill="#ffb5c5" opacity="0.65" />
        </motion.g>

        {/* ── Blush (subtle, mood-driven) ──────────────────────── */}
        <motion.ellipse
          cx="120" cy="104" rx="14" ry="7"
          fill="#ffb5c5"
          animate={{ opacity: BLUSH[mood] }}
          transition={spring}
          style={{ opacity: BLUSH[mood] }}
        />
        <motion.ellipse
          cx="230" cy="104" rx="14" ry="7"
          fill="#ffb5c5"
          animate={{ opacity: BLUSH[mood] }}
          transition={spring}
          style={{ opacity: BLUSH[mood] }}
        />

        {/* ══════════════════════════════════════════════════════════
            EYES — Large circles with white highlights + natural blink
            ══════════════════════════════════════════════════════════ */}

        <motion.g
          animate={
            shouldBlink && !prefersReduced
              ? { scaleY: [1, 1, 1, 0.08, 1] }
              : { scaleY: 1 }
          }
          transition={
            shouldBlink && !prefersReduced
              ? { duration: 4.2, times: [0, 0.9, 0.94, 0.97, 1], repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.2 }
          }
          style={{ originX: '176px', originY: '92px' }}
        >
          {/* Left eye */}
          <motion.ellipse
            cx="148" cy="92" rx="14"
            fill="#2d2d2d"
            animate={{ ry: EYE_RY[mood] }}
            transition={spring}
          />
          {/* Left eye highlight */}
          <motion.circle
            cx="141" cy="83" r="5"
            fill="white"
            animate={{
              opacity: HL_OP[mood],
              scale: isExcited || isHungry ? [1, 1.25, 1] : 1,
            }}
            transition={
              isExcited || isHungry
                ? { duration: 1.1, repeat: Infinity, ease: 'easeInOut' }
                : spring
            }
          />

          {/* Right eye */}
          <motion.ellipse
            cx="205" cy="92" rx="14"
            fill="#2d2d2d"
            animate={{ ry: EYE_RY[mood] }}
            transition={spring}
          />
          {/* Right eye highlight */}
          <motion.circle
            cx="198" cy="83" r="5"
            fill="white"
            animate={{
              opacity: HL_OP[mood],
              scale: isExcited || isHungry ? [1, 1.25, 1] : 1,
            }}
            transition={
              isExcited || isHungry
                ? { duration: 1.1, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }
                : spring
            }
          />
        </motion.g>

        {/* ── Tears (very-sad) ─────────────────────────────────── */}
        <AnimatePresence>
          {isVerySad && (
            <>
              <motion.path
                key="tear-left"
                d="M 152,102 Q 149,112 152,120 Q 155,112 152,102"
                fill="#87ceeb"
                initial={{ opacity: 0, y: -4 }}
                animate={prefersReduced ? { opacity: 0.85 } : { opacity: [0.4, 0.95, 0], y: [0, 8, 14] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeIn' }}
              />
              <motion.path
                key="tear-right"
                d="M 201,102 Q 198,112 201,120 Q 204,112 201,102"
                fill="#87ceeb"
                initial={{ opacity: 0, y: -4 }}
                animate={prefersReduced ? { opacity: 0.85 } : { opacity: [0.4, 0.95, 0], y: [0, 8, 14] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeIn', delay: 0.6 }}
              />
            </>
          )}
        </AnimatePresence>

        {/* ── Mouth (morphs per mood) ──────────────────────────── */}
        <motion.path
          d={MOUTH[mood]}
          fill="none"
          stroke="#2d2d2d"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ d: MOUTH[mood] }}
          transition={spring}
        />

        {/* ── Left paw (animated bongo taps!) ─────────────────── */}
        <motion.g
          animate={getLeftPawAnimate()}
          transition={getPawTransition(0)}
          style={{ originX: '58px', originY: '152px' }}
        >
          <g transform="rotate(-15 58 152)">
            <ellipse cx="58" cy="152" rx="22" ry="26"
              fill="white" stroke="#2d2d2d" strokeWidth="4.5" />
            <circle cx="47" cy="144" r="4.5" fill="#ffb5c5" />
            <circle cx="58" cy="140" r="4.5" fill="#ffb5c5" />
            <circle cx="69" cy="144" r="4.5" fill="#ffb5c5" />
            <circle cx="58" cy="156" r="7.5" fill="#ffb5c5" />
          </g>
        </motion.g>

        {/* ── Right paw (animated bongo taps!) ────────────────── */}
        <motion.g
          animate={getRightPawAnimate()}
          transition={getPawTransition(0.12)}
          style={{ originX: '282px', originY: '152px' }}
        >
          <g transform="rotate(15 282 152)">
            <ellipse cx="282" cy="152" rx="22" ry="26"
              fill="white" stroke="#2d2d2d" strokeWidth="4.5" />
            <circle cx="271" cy="144" r="4.5" fill="#ffb5c5" />
            <circle cx="282" cy="140" r="4.5" fill="#ffb5c5" />
            <circle cx="293" cy="144" r="4.5" fill="#ffb5c5" />
            <circle cx="282" cy="156" r="7.5" fill="#ffb5c5" />
          </g>
        </motion.g>
      </svg>
    </motion.div>
  );
};

export default CatCharacter;
