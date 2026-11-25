import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CatCharacter } from '../components/CatCharacter';
import { GlassCard } from '../components/GlassCard';

interface PostTrekFoodSectionProps {
  postFoodChoice: string | null;
  onSubmit: (choice: string) => void;
}

export const PostTrekFoodSection: React.FC<PostTrekFoodSectionProps> = ({
  postFoodChoice,
  onSubmit,
}) => {
  const [text, setText] = useState(postFoodChoice ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed) {
      onSubmit(trimmed);
    }
  };

  return (
    <section
      id="section-post-food"
      className="section-full"
      style={{ zIndex: 1, padding: '2rem 1rem 3rem' }}
    >
      <div style={{ width: '100%', maxWidth: 560, textAlign: 'center' }}>

        {/* Excited cat */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.6rem' }}>
          <CatCharacter mood={postFoodChoice ? 'happy' : 'excited'} size={210} />
        </div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: '1.4rem' }}
        >
          <h2 style={{
            fontSize: 'clamp(1.2rem, 5vw, 1.65rem)',
            fontWeight: 800,
            color: '#2d1a4a',
            lineHeight: 1.3,
            letterSpacing: '-0.015em',
            marginBottom: '0.45rem',
          }}>
            And once we&apos;re back down — what are you craving after the trek? 🍽️
          </h2>
          <p style={{
            fontSize: 'clamp(0.85rem, 3.5vw, 1rem)',
            color: '#6b5b8a',
            lineHeight: 1.5,
          }}>
            Breakfast, brunch, street food, coffee, or dessert — write whatever you&apos;d love ✨
          </p>
        </motion.div>

        {/* Free-write card */}
        <GlassCard style={{ padding: '1.25rem' }}>
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem',
            }}
          >
            <textarea
              id="input-post-trek-food"
              rows={3}
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (text.trim()) onSubmit(text.trim());
                }
              }}
              placeholder="e.g., Pancakes & iced latte, chole bhature, pizza, waffles, or surprise me..."
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: 16,
                border: '1.5px solid rgba(168,85,247,0.28)',
                background: 'rgba(255,255,255,0.78)',
                fontSize: '0.96rem',
                fontFamily: 'Inter, -apple-system, sans-serif',
                color: '#2d1a4a',
                outline: 'none',
                resize: 'vertical',
                minHeight: 84,
                lineHeight: 1.5,
                boxShadow: '0 2px 10px rgba(120,80,200,0.08)',
              }}
            />

            <motion.button
              id="btn-post-trek-food"
              type="submit"
              whileHover={{ scale: text.trim() ? 1.02 : 1 }}
              whileTap={{ scale: text.trim() ? 0.97 : 1 }}
              disabled={!text.trim()}
              style={{
                width: '100%',
                padding: '0.85rem 1.2rem',
                borderRadius: 16,
                border: 'none',
                background: text.trim()
                  ? 'linear-gradient(135deg, #a855f7, #7c3aed)'
                  : 'rgba(168,85,247,0.2)',
                color: text.trim() ? 'white' : '#9080b0',
                fontSize: '0.95rem',
                fontWeight: 600,
                fontFamily: 'Inter, -apple-system, sans-serif',
                cursor: text.trim() ? 'pointer' : 'not-allowed',
                boxShadow: text.trim() ? '0 6px 20px rgba(168,85,247,0.28)' : 'none',
                transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
              }}
            >
              {postFoodChoice ? 'Update craving 🐾' : 'Lock it in 🐾'}
            </motion.button>
          </form>
        </GlassCard>

        {/* Confirmation message */}
        <AnimatePresence>
          {postFoodChoice && (
            <motion.div
              key="post-food-confirm"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              style={{
                marginTop: '1rem',
                background: 'rgba(255,255,255,0.6)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1.5px solid rgba(168,85,247,0.25)',
                borderRadius: 20,
                padding: '1rem 1.4rem',
                boxShadow: '0 4px 18px rgba(168,85,247,0.12)',
              }}
            >
              <p style={{
                fontSize: 'clamp(0.9rem, 3.5vw, 1rem)',
                fontWeight: 600,
                color: '#4a2d7a',
                lineHeight: 1.5,
              }}>
                Sounds amazing — <strong>{postFoodChoice}</strong> after the trek, my treat 🐾
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PostTrekFoodSection;
