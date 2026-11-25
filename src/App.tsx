import { useReducer, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AnimatedBackground } from './components/AnimatedBackground';
import { HeroSection } from './sections/HeroSection';
import { AskSection } from './sections/AskSection';
import { CelebrationSection } from './sections/CelebrationSection';
import { TrekExperienceSection } from './sections/TrekExperienceSection';
import { FoodSection } from './sections/FoodSection';
import { PostTrekFoodSection } from './sections/PostTrekFoodSection';
import { SignOffSection } from './sections/SignOffSection';
import { useSmootScroll, scrollToSection } from './hooks/useScrollSections';
import { fireEvent, fireVisitEvent } from './lib/notifications';
import { FOOD_OPTIONS } from './lib/stateTypes';
import type { AppState, AppAction } from './lib/stateTypes';

// ─── Reducer ──────────────────────────────────────────────────────────────────

const initialState: AppState = {
  phase: 'ask',
  noCount: 0,
  trekExpChoice: null,
  foodChoice: null,
  postFoodChoice: null,
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
      if (state.phase !== 'trek-exp') return state;
      return { ...state, trekExpChoice: action.choice, phase: 'food' };
    case 'SELECT_FOOD':
      if (state.phase !== 'food') return state;
      return { ...state, foodChoice: action.choice, phase: 'post-food' };
    case 'SELECT_POST_FOOD':
      if (!['post-food', 'signoff'].includes(state.phase)) return state;
      return { ...state, postFoodChoice: action.choice, phase: 'signoff' };
    default:
      return state;
  }
}

// ─── App ──────────────────────────────────────────────────────────────────────

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const lenisRef = useSmootScroll();
  const visitNotifiedRef    = useRef(false);
  const answerNotifiedRef   = useRef(false);
  const trekExpNotifiedRef  = useRef(false);
  const foodNotifiedRef     = useRef(false);
  const lastPostFoodRef     = useRef<string | null>(null);
  const allDoneNotifiedRef  = useRef(false);

  const { phase, noCount, trekExpChoice, foodChoice, postFoodChoice } = state;

  // ── Notify: page opened ──────────────────────────────────────────────────
  useEffect(() => {
    if (visitNotifiedRef.current) return;
    visitNotifiedRef.current = true;
    void fireVisitEvent();
  }, []);

  // ── Scroll on phase change ───────────────────────────────────────────────
  useEffect(() => {
    const targets: Record<string, string> = {
      'yes':       'section-celebration',
      'trek-exp':  'section-trek-exp',
      'food':      'section-food',
      'post-food': 'section-post-food',
      'no-final':  'section-signoff',
      'signoff':   'section-signoff',
    };
    const target = targets[phase];
    if (target) {
      setTimeout(() => scrollToSection(target, lenisRef.current), 350);
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

  // ── Notify: trek experience ──────────────────────────────────────────────
  useEffect(() => {
    if (trekExpNotifiedRef.current || !trekExpChoice) return;
    trekExpNotifiedRef.current = true;
    fireEvent({ answer: 'trek-exp', noCount, trekExpChoice });
  }, [trekExpChoice, noCount]);

  // ── Notify: trek snack choice ────────────────────────────────────────────
  useEffect(() => {
    if (foodNotifiedRef.current || !foodChoice) return;
    foodNotifiedRef.current = true;
    const foodLabel = FOOD_OPTIONS.find(f => f.id === foodChoice)?.label ?? foodChoice;
    fireEvent({ answer: 'food-choice', noCount, foodChoice: foodLabel });
  }, [foodChoice, noCount]);

  // ── Notify: post-trek food + all-done summary ────────────────────────────
  useEffect(() => {
    if (!postFoodChoice || lastPostFoodRef.current === postFoodChoice) return;
    lastPostFoodRef.current = postFoodChoice;
    const foodLabel = foodChoice
      ? (FOOD_OPTIONS.find(f => f.id === foodChoice)?.label ?? foodChoice)
      : undefined;

    fireEvent({
      answer: 'post-food-choice',
      noCount,
      postFoodChoice,
    });

    if (!allDoneNotifiedRef.current && trekExpChoice && foodLabel) {
      allDoneNotifiedRef.current = true;
      setTimeout(() => {
        fireEvent({
          answer: 'all-done',
          noCount,
          trekExpChoice,
          foodChoice: foodLabel,
          postFoodChoice,
        });
      }, 1500);
    }
  }, [postFoodChoice, noCount, trekExpChoice, foodChoice]);

  // ── Section visibility ───────────────────────────────────────────────────
  const showAsk         = phase === 'ask' || phase === 'pivot';
  const showCelebration = ['yes', 'trek-exp', 'food', 'post-food', 'signoff'].includes(phase);
  const showTrekExp     = ['trek-exp', 'food', 'post-food', 'signoff'].includes(phase);
  const showFood        = ['food', 'post-food', 'signoff'].includes(phase);
  const showPostFood    = ['post-food', 'signoff'].includes(phase);
  const showSignoff     = phase === 'signoff' || phase === 'no-final';

  const foodLabel = foodChoice
    ? (FOOD_OPTIONS.find(f => f.id === foodChoice)?.label ?? foodChoice)
    : null;

  return (
    <div style={{ position: 'relative', minHeight: '100dvh' }}>
      <AnimatedBackground />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <HeroSection
          onScrollHintClick={() => scrollToSection('section-ask', lenisRef.current)}
        />

        {/* ── Ask / Pivot ──────────────────────────────────────────── */}
        <AnimatePresence>
          {showAsk && (
            <motion.div key="ask" exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
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

        {/* ── Trek Snacks ──────────────────────────────────────────── */}
        <AnimatePresence>
          {showFood && (
            <motion.div
              key="food"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <FoodSection
                foodChoice={foodChoice}
                onSelect={(id, label) => {
                  dispatch({ type: 'SELECT_FOOD', choice: id === 'custom' ? label : id });
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Post-Trek Food ───────────────────────────────────────── */}
        <AnimatePresence>
          {showPostFood && (
            <motion.div
              key="post-food"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <PostTrekFoodSection
                postFoodChoice={postFoodChoice}
                onSubmit={(choice) => {
                  dispatch({ type: 'SELECT_POST_FOOD', choice });
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
                foodChoice={foodLabel}
                postFoodChoice={postFoodChoice}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default App;
