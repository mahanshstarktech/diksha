// ─── App State Types ──────────────────────────────────────────────────────────

export type Phase =
  | 'ask'       // initial ask, noCount 0-5
  | 'pivot'     // 6th decline → "some other time?"
  | 'yes'       // celebration
  | 'trek-exp'  // have you been on a trek before?
  | 'no-final'  // pivot declined → warm close
  | 'signoff';  // final screen

export type CatMood =
  | 'normal'
  | 'concerned'
  | 'pleading'
  | 'hurt'
  | 'sad'
  | 'very-sad'
  | 'happy'
  | 'content'
  | 'curious'
  | 'hungry'
  | 'excited'
  | 'dance';

export const TREK_DATE_LABEL = 'Sunday, Nov 29';
export const TREK_TIME_LABEL = 'Sunday Morning · Nov 29';
export const TREK_LOCATION = 'Somewhere secret';

export interface AppState {
  phase: Phase;
  noCount: number;
  trekExpChoice: string | null;
}

export type AppAction =
  | { type: 'CLICK_NO' }
  | { type: 'CLICK_YES' }
  | { type: 'CLICK_PIVOT_YES' }
  | { type: 'CLICK_PIVOT_NO' }
  | { type: 'GO_TO_TREK_EXP' }
  | { type: 'SELECT_TREK_EXP'; choice: string };

// ─── State Progression Table ──────────────────────────────────────────────────

export interface AskStageConfig {
  question: string;
  mood: CatMood;
  noScale: number;
  yesScale: number;
}

export const ASK_STAGES: AskStageConfig[] = [
  {
    question: 'Would you like to go on a trek with me? 🐾',
    mood: 'normal',
    noScale: 1.0,
    yesScale: 1.0,
  },
  {
    question: 'Please? 🥺',
    mood: 'concerned',
    noScale: 0.88,
    yesScale: 1.08,
  },
  {
    question: 'Pleaseee? Just this Sunday? 🐱💭',
    mood: 'pleading',
    noScale: 0.76,
    yesScale: 1.16,
  },
  {
    question: 'Please please please? 🥹',
    mood: 'hurt',
    noScale: 0.64,
    yesScale: 1.24,
  },
  {
    question: "I'll even carry your bag the whole trek. Please? 🎒🥺",
    mood: 'sad',
    noScale: 0.52,
    yesScale: 1.32,
  },
  {
    question: 'This is my last please, I promise. Pleeeease? 💗',
    mood: 'very-sad',
    noScale: 0.42,
    yesScale: 1.4,
  },
];

export const TREK_EXP_OPTIONS = [
  {
    id: 'experienced',
    emoji: '🏔️',
    label: "Yes, I've been on treks before!",
    reply: "Ooh, a trail pro! You get to set the pace then 😄🐾",
  },
  {
    id: 'few-times',
    emoji: '🌿',
    label: 'Once or twice, a little bit',
    reply: "Perfect — this trail is super scenic and easygoing 🐾",
  },
  {
    id: 'first-time',
    emoji: '🌱',
    label: 'Nope, this will be my first!',
    reply: "Even better — I'll make sure your first trek is unforgettable 💗🐾",
  },
];
