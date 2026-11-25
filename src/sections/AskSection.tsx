import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CatCharacter } from '../components/CatCharacter';
import { PawButton } from '../components/PawButton';
import { GlassCard } from '../components/GlassCard';
import { SecretCatIcon } from '../components/SecretCatIcon';
import { ASK_STAGES } from '../lib/stateTypes';
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
      style={{ zIndex: 1, paddingTop: '1.5rem', paddingBottom: '2rem' }}
    >
      <div style={{ width: '100%', maxWidth: '34rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Date idea + secret location card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard style={{ padding: 'clamp(1.1rem, 3.5vw, 1.5rem) clamp(1.15rem, 4vw, 1.6rem)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <span
                  style={{
                    display: 'block',
                    fontSize: 'clamp(0.68rem, 2.5vw, 0.78rem)',
                    fontWeight: 700,
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                    color: '#7c3aed',
                    marginBottom: '0.45rem',
                  }}
                >
                  Date Idea · Sunday, <span style={{ whiteSpace: 'nowrap' }}>Nov 29</span>
                </span>
                <p
                  style={{
                    fontSize: 'clamp(0.95rem, 3.4vw, 1.06rem)',
                    fontWeight: 600,
                    lineHeight: 1.55,
                    color: '#2d1a4a',
                    textWrap: 'pretty',
                  }}
                >
                  A quiet morning trek together — crisp air, easy trails, and the sunrise view. 🌅
                </p>
              </div>

              <div
                style={{
                  height: 1,
                  background: 'rgba(168, 85, 247, 0.14)',
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 11,
                      background: 'rgba(168, 85, 247, 0.1)',
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <SecretCatIcon size={22} />
                  </div>
                  <h2 style={{
                    fontSize: 'clamp(0.98rem, 3.6vw, 1.08rem)',
                    fontWeight: 700,
                    color: '#2d1a4a',
                    letterSpacing: '-0.01em',
                  }}>
                    Where? That&apos;s a secret
                  </h2>
                </div>
                <p style={{
                  fontSize: 'clamp(0.86rem, 3.1vw, 0.94rem)',
                  lineHeight: 1.58,
                  color: '#5a4a7a',
                  textWrap: 'pretty',
                }}>
                  Keeping the trail spot a surprise for now — just bring good energy and trust me on this one. 🐾
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Main interaction card */}
        <GlassCard id="ask-card" style={{ textAlign: 'center', padding: 'clamp(1.35rem, 4vw, 1.75rem) clamp(1.15rem, 4vw, 1.5rem)' }}>

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
                fontSize: 'clamp(1rem, 3.8vw, 1.18rem)',
                fontWeight: 600,
                color: '#2d1a4a',
                lineHeight: 1.5,
                marginBottom: '1.25rem',
                minHeight: '3rem',
                textWrap: 'balance',
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
                  label={'Yes,\nsometime 🌄'}
                  variant="yes"
                  onClick={onPivotYes}
                  scale={1.0}
                  width={185}
                />
                <PawButton
                  id="btn-pivot-no"
                  label={'How about\nsomething else?'}
                  variant="no"
                  onClick={onPivotNo}
                  scale={1.0}
                  width={185}
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
