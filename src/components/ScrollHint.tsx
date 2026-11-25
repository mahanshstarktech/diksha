import { motion } from 'framer-motion';

interface ScrollHintProps {
  onClick?: () => void;
  delay?: number;
  label?: string;
}

/**
 * Clickable hovering down-arrow placed below cards/sections so the user can
 * tap to smoothly scroll to the next step without needing to swipe.
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
    animate={{ opacity: 0.72 }}
    whileHover={{ opacity: 1, scale: 1.08 }}
    whileTap={{ scale: 0.94 }}
    transition={{ delay, duration: 0.6 }}
    style={{
      background: 'none',
      border: 'none',
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: onClick ? 'pointer' : 'default',
      marginTop: '0.75rem',
      padding: '0.55rem 0.9rem',
    }}
    aria-label={label}
  >
    <motion.svg
      width="26"
      height="15"
      viewBox="0 0 28 16"
      fill="none"
      animate={{ y: [0, 7, 0] }}
      transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
    >
      <path
        d="M2 2L14 13L26 2"
        stroke="#7c3aed"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  </motion.button>
);

export default ScrollHint;
