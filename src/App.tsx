import { useReducer, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AnimatedBackground } from './components/AnimatedBackground';
import { HeroSection } from './sections/HeroSection';
import { AskSection } from './sections/AskSection';
import { CelebrationSection } from './sections/CelebrationSection';
import { TrekExperienceSection } from './sections/TrekExperienceSection';
import { SignOffSection } from './sections/SignOffSection';
import { useSmootScroll, scrollToSection } from './hooks/useScrollSections';
import { fireEvent, fireVisitEvent } from './lib/notifications';
import type { AppState, AppAction } from './lib/stateTypes';

// ─── Reducer ──────────────────────────────────────────────────────────────────

const initialState: AppState = {
  phase: 'ask',
  noCount: 0,
  trekExpChoice: null,
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'CLICK_NO': {
      if (state.phase !== 'ask') return state;
      const next = state.noCount + 1;
      if (next > 5) return { ...state, phase: 'pivot' };
      return { ...state, noCount: next };
    }
    case 'CLICK_YES':
      if (state.phase !== 'ask') return state;
      return { ...state, phase: 'yes' };
    case 'CLICK_PIVOT_YES':
      if (state.phase !== 'pivot') return state;
      return { ...state, phase: 'yes' };
    case 'CLICK_PIVOT_NO':
      if (state.phase !== 'pivot') return state;
      return { ...state, phase: 'no-final' };
    case 'GO_TO_TREK_EXP':
      if (state.phase !== 'yes') return state;
      return { ...state, phase: 'trek-exp' };
    case 'SELECT_TREK_EXP':
      if (!['trek-exp', 'signoff'].includes(state.phase)) return state;
      return { ...state, trekExpChoice: action.choice, phase: 'signoff' };
    default:
      return state;
  }
}

// ─── App ──────────────────────────────────────────────────────────────────────

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const lenisRef = useSmootScroll();
  const visitNotifiedRef   = useRef(false);
  const answerNotifiedRef  = useRef(false);
  const trekExpNotifiedRef = useRef(false);
  const allDoneNotifiedRef = useRef(false);

  const { phase, noCount, trekExpChoice } = state;

  // ── Notify: page opened ──────────────────────────────────────────────────
  useEffect(() => {
    if (visitNotifiedRef.current) return;
    visitNotifiedRef.current = true;
    void fireVisitEvent();
  }, []);

  // ── Scroll on phase change ───────────────────────────────────────────────
  useEffect(() => {
    const targets: Record<string, string> = {
      'yes':      'section-celebration',
      'trek-exp': 'section-trek-exp',
      'no-final': 'section-signoff',
      'signoff':  'section-signoff',
    };
    const target = targets[phase];
    if (target) {
      setTimeout(() => scrollToSection(target, lenisRef.current), 260);
    }
  }, [phase]);

  // ── Notify: final answer ─────────────────────────────────────────────────
  useEffect(() => {
    if (answerNotifiedRef.current) return;
    if (phase === 'yes' || phase === 'no-final') {
      answerNotifiedRef.current = true;
      fireEvent({
        answer: phase === 'yes' ? 'yes' : 'no-final',
        noCount,
      });
    }
  }, [phase, noCount]);

  // ── Notify: trek experience + all-done summary ───────────────────────────
  useEffect(() => {
    if (trekExpNotifiedRef.current || !trekExpChoice) return;
    trekExpNotifiedRef.current = true;
    fireEvent({ answer: 'trek-exp', noCount, trekExpChoice });

    if (!allDoneNotifiedRef.current) {
      allDoneNotifiedRef.current = true;
      setTimeout(() => {
        fireEvent({
          answer: 'all-done',
          noCount,
          trekExpChoice,
        });
      }, 1500);
    }
  }, [trekExpChoice, noCount]);

  // ── Section visibility ───────────────────────────────────────────────────
  const showAsk         = phase === 'ask' || phase === 'pivot';
  const showCelebration = ['yes', 'trek-exp', 'signoff'].includes(phase);
  const showTrekExp     = ['trek-exp', 'signoff'].includes(phase);
  const showSignoff     = phase === 'signoff' || phase === 'no-final';

  return (
    <div style={{ position: 'relative', minHeight: '100dvh' }}>
      <AnimatedBackground />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <HeroSection
          onScrollHintClick={() => scrollToSection('section-date-idea', lenisRef.current)}
        />

        {/* ── Date Idea + Ask / Pivot ──────────────────────────────── */}
        <AnimatePresence>
          {showAsk && (
            <motion.div key="ask" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
              <AskSection
                state={state}
                onYes={() => dispatch({ type: 'CLICK_YES' })}
                onNo={() => dispatch({ type: 'CLICK_NO' })}
                onPivotYes={() => dispatch({ type: 'CLICK_PIVOT_YES' })}
                onPivotNo={() => dispatch({ type: 'CLICK_PIVOT_NO' })}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Celebration ──────────────────────────────────────────── */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              key="celebration"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <CelebrationSection
                active={showCelebration}
                onContinue={() => dispatch({ type: 'GO_TO_TREK_EXP' })}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Trek Experience ──────────────────────────────────────── */}
        <AnimatePresence>
          {showTrekExp && (
            <motion.div
              key="trek-exp"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <TrekExperienceSection
                trekExpChoice={trekExpChoice}
                onSelect={(label) => {
                  dispatch({ type: 'SELECT_TREK_EXP', choice: label });
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Sign-off ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {showSignoff && (
            <motion.div
              key="signoff"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <SignOffSection
                phase={phase}
                trekExpChoice={trekExpChoice}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default App;
