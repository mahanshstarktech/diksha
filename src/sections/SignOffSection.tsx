import { motion } from 'framer-motion';
import { CatCharacter } from '../components/CatCharacter';
import { SecretCatIcon } from '../components/SecretCatIcon';
import { TREK_DATE_LABEL, TREK_LOCATION } from '../lib/stateTypes';
import type { Phase } from '../lib/stateTypes';

interface SignOffSectionProps {
  phase: Phase;
  trekExpChoice: string | null;
}

export const SignOffSection: React.FC<SignOffSectionProps> = ({
  phase,
  trekExpChoice,
}) => {
  const isNoFinal = phase === 'no-final';

  return (
    <section
      id="section-signoff"
      className="section-full"
      style={{ zIndex: 1, padding: '2.5rem 1rem 4rem' }}
    >
      <div style={{ textAlign: 'center', maxWidth: 480, width: '100%' }}>

        {/* Cat */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.6rem' }}>
          <CatCharacter mood={isNoFinal ? 'content' : 'happy'} size={205} />
        </div>

        {isNoFinal ? (
          <>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={{
                fontSize: 'clamp(1.5rem, 6vw, 2.2rem)',
                fontWeight: 900,
                lineHeight: 1.15,
                color: '#4a3a6a',
                marginBottom: '0.75rem',
              }}
            >
              No worries at all 🐾
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7 }}
              style={{
                fontSize: 'clamp(0.9rem, 3.5vw, 1.05rem)',
                color: '#6b5b8a',
                lineHeight: 1.7,
                marginBottom: '2rem',
              }}
            >
              Thanks for humoring me. The offer stands whenever you&apos;re up for it — no pressure, ever. 💜
            </motion.p>
          </>
        ) : (
          <>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="gradient-text"
              style={{
                fontSize: 'clamp(1.6rem, 7vw, 2.5rem)',
                fontWeight: 900,
                lineHeight: 1.12,
                letterSpacing: '-0.02em',
                marginBottom: '1rem',
              }}
            >
              See you on Sunday
              <br />
              <span style={{ whiteSpace: 'nowrap' }}>Nov 29</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.7 }}
              style={{
                fontSize: 'clamp(0.9rem, 3.5vw, 1.05rem)',
                color: '#5a4a7a',
                lineHeight: 1.75,
                marginBottom: '1.5rem',
              }}
            >
              <p style={{ marginBottom: '0.85rem' }}>
                If I were a poet, you&apos;d be the reason I&apos;d never run out of words.
              </p>
              <p style={{ fontWeight: 600, color: '#4a2d7a' }}>
                Thank you for saying yes.
                <br />
                My heart hasn&apos;t stopped smiling since. 💗
              </p>
            </motion.div>

            {/* Recap card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45, duration: 0.6 }}
              style={{
                background: 'rgba(255,255,255,0.55)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1.5px solid rgba(255,255,255,0.45)',
                borderRadius: 22,
                padding: '1.15rem 1.4rem',
                boxShadow: '0 4px 18px rgba(120,80,200,0.12)',
                marginBottom: '1.5rem',
              }}
            >
              <p style={{
                fontSize: 'clamp(0.85rem, 3vw, 0.95rem)',
                color: '#5a4a7a',
                lineHeight: 1.7,
              }}>
                📅 <strong>{TREK_DATE_LABEL} · Morning</strong>
                <br />📍 {TREK_LOCATION} <SecretCatIcon size={18} />
                {trekExpChoice && (
                  <><br />🥾 <strong>{trekExpChoice}</strong></>
                )}
                <br /><br />
                <span style={{ color: '#7c3aed', fontWeight: 600 }}>
                  All I need now is you. 🐾
                </span>
              </p>
            </motion.div>
          </>
        )}

        {/* Paw trail */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          style={{
            fontSize: '1.4rem',
            letterSpacing: '0.4rem',
            color: '#c084fc',
          }}
        >
          🐾🐾🐾
        </motion.div>
      </div>

      {/* Made with love footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.6 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 1 }}
        style={{
          marginTop: '1.5rem',
          fontSize: '0.75rem',
          color: '#8a7a9a',
          letterSpacing: '0.02em',
          textAlign: 'center',
          width: '100%',
        }}
      >
        Made with ❤️ By Mahansh Gaur
      </motion.div>
    </section>
  );
};

export default SignOffSection;
