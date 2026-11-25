import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { CatCharacter } from '../components/CatCharacter';
import { ScrollHint } from '../components/ScrollHint';
import { TREK_EXP_OPTIONS, TREK_DATE_LABEL } from '../lib/stateTypes';

interface TrekExperienceSectionProps {
  trekExpChoice: string | null;
  onSelect: (label: string) => void;
}

export const TrekExperienceSection: React.FC<TrekExperienceSectionProps> = ({
  trekExpChoice,
  onSelect,
}) => {
  const matchedOption = TREK_EXP_OPTIONS.find(opt => opt.label === trekExpChoice);

  return (
    <section
      id="section-trek-exp"
      className="section-full"
      style={{ zIndex: 1, padding: '2rem 1rem' }}
    >
      <div style={{ width: '100%', maxWidth: 560, textAlign: 'center' }}>

        {/* Curious cat */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
          <CatCharacter mood={trekExpChoice ? 'happy' : 'curious'} size={215} />
        </div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: '1.5rem' }}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#7c3aed',
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid rgba(168, 85, 247, 0.22)',
              borderRadius: 999,
              padding: '0.28rem 0.85rem',
              marginBottom: '0.75rem',
            }}
          >
            📅 Locked in for {TREK_DATE_LABEL}
          </span>
          <h2 style={{
            fontSize: 'clamp(1.3rem, 5vw, 1.75rem)',
            fontWeight: 800,
            color: '#2d1a4a',
            lineHeight: 1.3,
            letterSpacing: '-0.015em',
            marginBottom: '0.45rem',
          }}>
            Have you been on a trek before? 🥾
          </h2>
          <p style={{
            fontSize: 'clamp(0.85rem, 3.5vw, 1rem)',
            color: '#6b5b8a',
            lineHeight: 1.5,
          }}>
            Just so I know how to plan our pace ✨
          </p>
        </motion.div>

        {/* Experience options */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          marginBottom: '1.4rem',
          width: '100%',
        }}>
          {TREK_EXP_OPTIONS.map((opt, i) => {
            const isSelected = trekExpChoice === opt.label;
            return (
              <motion.button
                key={opt.id}
                id={`trek-exp-${opt.id}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelect(opt.label)}
                aria-pressed={isSelected}
                style={{
                  background: isSelected
                    ? 'rgba(168,85,247,0.16)'
                    : 'rgba(255,255,255,0.55)',
                  backdropFilter: 'blur(16px) saturate(160%)',
                  WebkitBackdropFilter: 'blur(16px) saturate(160%)',
                  border: isSelected
                    ? '2px solid rgba(168,85,247,0.55)'
                    : '1.5px solid rgba(255,255,255,0.4)',
                  borderRadius: 20,
                  padding: '1rem 1.25rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  boxShadow: isSelected
                    ? '0 8px 28px rgba(168,85,247,0.22)'
                    : '0 4px 16px rgba(120,80,200,0.10)',
                  transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.35rem' }}>{opt.emoji}</span>
                  <span style={{
                    fontSize: 'clamp(0.92rem, 3.6vw, 1.02rem)',
                    fontWeight: 600,
                    color: isSelected ? '#7c3aed' : '#2d1a4a',
                  }}>
                    {opt.label}
                  </span>
                </span>
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{ fontSize: '0.95rem', fontWeight: 700, color: '#7c3aed' }}
                  >
                    ✓
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Scroll hint before choice */}
        {!trekExpChoice && <ScrollHint />}

        {/* Confirmation message */}
        <AnimatePresence>
          {matchedOption && (
            <motion.div
              key="trek-exp-confirm"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <GlassCard style={{ textAlign: 'center', padding: '1rem 1.4rem' }}>
                <p style={{
                  fontSize: 'clamp(0.9rem, 3.5vw, 1rem)',
                  fontWeight: 600,
                  color: '#4a2d7a',
                  lineHeight: 1.5,
                }}>
                  {matchedOption.reply}
                </p>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TrekExperienceSection;
