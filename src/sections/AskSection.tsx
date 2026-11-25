import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CatCharacter } from '../components/CatCharacter';
import { PawButton } from '../components/PawButton';
import { GlassCard } from '../components/GlassCard';
import { SecretCatIcon } from '../components/SecretCatIcon';
import { ScrollHint } from '../components/ScrollHint';
import { ASK_STAGES, TREK_TIME_LABEL } from '../lib/stateTypes';
import type { AppState } from '../lib/stateTypes';

interface AskSectionProps {
  state: AppState;
  onYes: () => void;
  onNo: () => void;
  onPivotYes: () => void;
  onPivotNo: () => void;
}

const springText = { type: 'spring' as const, stiffness: 280, damping: 26 };

export const AskSection: React.FC<AskSectionProps> = ({
  state,
  onYes,
  onNo,
  onPivotYes,
  onPivotNo,
}) => {
  const { phase, noCount } = state;

  const stage = ASK_STAGES[Math.min(noCount, ASK_STAGES.length - 1)];
  const isPivot = phase === 'pivot';

  const questionText = isPivot
    ? "Okay okay, I'll stop bugging you about this Sunday 😅 But for real — would you want to go on a trek together sometime?"
    : stage.question;

  const catMood = isPivot ? 'curious' : stage.mood;
  const noScale = isPivot ? 1.0 : stage.noScale;
  const yesScale = isPivot ? 1.0 : stage.yesScale;

  return (
    <section
      id="section-ask"
      className="section-full"
      style={{ zIndex: 1, paddingTop: '1.75rem', paddingBottom: '2rem' }}
    >
      <div style={{ width: '100%', maxWidth: 540, display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Date idea + secret location card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard style={{ padding: '1.25rem 1.35rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                    color: '#7c3aed',
                    marginBottom: '0.45rem',
                  }}
                >
                  Date Idea · {TREK_TIME_LABEL}
                </span>
                <p
                  style={{
                    fontSize: '0.98rem',
                    fontWeight: 600,
                    lineHeight: 1.5,
                    color: '#2d1a4a',
                  }}
                >
                  My date idea for us: a quiet Sunday morning trek on Nov 29 — crisp air,
                  easy trails, and the sunrise view together. 🌅
                </p>
              </div>

              <div
                style={{
                  height: 1,
                  background: 'rgba(168, 85, 247, 0.14)',
                }}
              />

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 13,
                    background: 'rgba(168, 85, 247, 0.1)',
                    border: '1px solid rgba(168, 85, 247, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <SecretCatIcon size={28} />
                </div>
                <div>
                  <h2 style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: '#2d1a4a',
                    marginBottom: '0.25rem',
                    letterSpacing: '-0.01em',
                  }}>
                    Where? That&apos;s a secret
                  </h2>
                  <p style={{
                    fontSize: '0.88rem',
                    lineHeight: 1.55,
                    color: '#5a4a7a',
                  }}>
                    I&apos;m keeping the trail spot a little surprise for now — just bring
                    good energy and trust me on this one. 🐾
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Hovering down arrow right after Date Idea card */}
          <ScrollHint
            delay={0.4}
            label="Scroll to question"
            onClick={() => {
              document.getElementById('ask-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
          />
        </motion.div>

        {/* Main interaction card */}
        <GlassCard id="ask-card" style={{ textAlign: 'center', padding: '1.5rem 1.35rem' }}>

          {/* Cat */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <CatCharacter mood={catMood} size={195} />
          </div>

          {/* Question text */}
          <AnimatePresence mode="wait">
            <motion.p
              key={questionText}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={springText}
              style={{
                fontSize: 'clamp(1rem, 4vw, 1.18rem)',
                fontWeight: 600,
                color: '#2d1a4a',
                lineHeight: 1.5,
                marginBottom: '1.25rem',
                minHeight: '3rem',
              }}
            >
              {questionText}
            </motion.p>
          </AnimatePresence>

          {/* Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
          }}>
            {isPivot ? (
              <>
                <PawButton
                  id="btn-pivot-yes"
                  label="Yes, sometime 🌄"
                  variant="yes"
                  onClick={onPivotYes}
                  scale={1.0}
                  width={210}
                />
                <PawButton
                  id="btn-pivot-no"
                  label="No, not really"
                  variant="no"
                  onClick={onPivotNo}
                  scale={1.0}
                  width={180}
                />
              </>
            ) : (
              <>
                <PawButton
                  id="btn-yes"
                  label="Yes! 🐾"
                  variant="yes"
                  onClick={onYes}
                  scale={yesScale}
                />
                <PawButton
                  id="btn-no"
                  label="No"
                  variant="no"
                  onClick={onNo}
                  scale={noScale}
                />
              </>
            )}
          </div>

          {/* No count hint (subtle) */}
          <AnimatePresence>
            {!isPivot && noCount > 0 && (
              <motion.p
                key={`nc-${noCount}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  marginTop: '0.9rem',
                  fontSize: '0.75rem',
                  color: '#9080b0',
                  letterSpacing: '0.04em',
                }}
              >
                {'🐾'.repeat(noCount)}
              </motion.p>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>
    </section>
  );
};

export default AskSection;
