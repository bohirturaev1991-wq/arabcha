import { useSyncExternalStore } from 'react';
import type { CardState } from './srs';

export type Lang = 'uz' | 'ru';
export type Level = 'zero' | 'some';

export interface State {
  profile: { lang: Lang; level: Level | null; rate: number; arSize: number };
  letters: Record<string, number>; // выученные буквы → когда
  harakat: Record<string, number>; // пройденные огласовки
  cards: Record<string, CardState>; // интервальное повторение слов и фраз
  qstats: { answered: number; correct: number };
  activity: Record<string, { answered: number; reviewed: number; listened: number }>;
}

const KEY = 'arabcha:v1';
const initial: State = {
  profile: { lang: 'uz', level: null, rate: 0.9, arSize: 30 },
  letters: {},
  harakat: {},
  cards: {},
  qstats: { answered: 0, correct: 0 },
  activity: {},
};

function load(): State {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (s && s.profile) return { ...initial, ...s, profile: { ...initial.profile, ...s.profile } };
  } catch {
    /* повреждённые данные — начинаем заново */
  }
  return initial;
}

let state = load();
const subs = new Set<() => void>();
let timer: ReturnType<typeof setTimeout> | undefined;

export const getState = () => state;
export function setState(fn: (s: State) => State) {
  state = fn(state);
  subs.forEach((f) => f());
  clearTimeout(timer);
  timer = setTimeout(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* нет места */
    }
  }, 250);
}
export function replaceState(s: State) {
  setState(() => ({ ...initial, ...s, profile: { ...initial.profile, ...s.profile } }));
}
export function resetState() {
  setState(() => ({ ...initial, profile: { ...state.profile } }));
}
export function useStore<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => sel(state),
  );
}

export const today = () => {
  const d = new Date(Date.now() - 4 * 3600 * 1000); // день начинается в 4:00
  return d.toISOString().slice(0, 10);
};
export function bump(kind: 'answered' | 'reviewed' | 'listened', n = 1) {
  const d = today();
  setState((s) => {
    const a = s.activity[d] || { answered: 0, reviewed: 0, listened: 0 };
    return { ...s, activity: { ...s.activity, [d]: { ...a, [kind]: a[kind] + n } } };
  });
}
export function streak(s: State) {
  let n = 0;
  const d = new Date(Date.now() - 4 * 3600 * 1000);
  for (;;) {
    const k = d.toISOString().slice(0, 10);
    const a = s.activity[k];
    if (!a || a.answered + a.reviewed + a.listened === 0) {
      if (n === 0 && k === today()) {
        d.setDate(d.getDate() - 1);
        continue;
      }
      return n;
    }
    n++;
    d.setDate(d.getDate() - 1);
  }
}
