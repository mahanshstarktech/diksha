import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface ScrollHintProps {
  onClick?: () => void;
  delay?: number;
  label?: string;
}

/**
 * Clickable hovering down-arrow with small paws placed below cards/buttons
 * so the user can tap to smoothly scroll to the next step.
 */
export const ScrollHint: React.FC<ScrollHintProps> = ({
  onClick,
  delay = 0.6,
  label = 'Scroll down',
}) => (
  <motion.button
    type="button"
    onClick={onClick}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.94 }}
    transition={{ delay, duration: 0.6 }}
    className="scroll-hint"
    style={{
      background: 'none',
      border: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.45rem',
      color: '#9080b0',
      cursor: onClick ? 'pointer' : 'default',
      margin: '1.15rem auto 0',
      padding: '0.65rem 1rem',
    }}
    aria-label={label}
  >
    <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>🐾</span>
    <ChevronDown size={22} strokeWidth={2} />
  </motion.button>
);

export default ScrollHint;
