// Чтение Корана настоящим чтецом — по аятам, с EveryAyah (нужен интернет; прослушанное кешируется).
// Синтезатор речи таджвид не соблюдает, поэтому для Корана — только запись чтеца.
import { useSyncExternalStore } from 'react';
import { getState } from './store';

export const RECITERS = [
  { id: 'Husary_128kbps', uz: 'Mahmud Xalil al-Husariy', ru: 'Махмуд Халиль аль-Хусари' },
  { id: 'Husary_Muallim_128kbps', uz: 'Husariy — oʻqituvchi (takrorlash bilan)', ru: 'Хусари — учитель (с повтором)' },
  { id: 'Alafasy_128kbps', uz: 'Mishari al-Afasiy', ru: 'Мишари аль-Афаси' },
] as const;
export const DEFAULT_RECITER = RECITERS[0].id;

const pad = (n: number) => String(n).padStart(3, '0');
export const ayahUrl = (s: number, a: number, reciter = getState().profile.reciter || DEFAULT_RECITER) =>
  `https://everyayah.com/data/${reciter}/${pad(s)}${pad(a)}.mp3`;

type Status = { key: string | null; loading: boolean; error: boolean };
let status: Status = { key: null, loading: false, error: false };
const subs = new Set<() => void>();
const set = (s: Partial<Status>) => {
  status = { ...status, ...s };
  subs.forEach((f) => f());
};

let audio: HTMLAudioElement | null = null;
let queue: [number, number][] = [];
let repeat = false;

function playOne(s: number, a: number) {
  if (!audio) {
    audio = new Audio();
    audio.preload = 'auto';
    audio.addEventListener('playing', () => set({ loading: false }));
    audio.addEventListener('ended', () => {
      if (repeat && queue.length === 0) {
        audio!.currentTime = 0;
        audio!.play().catch(() => set({ error: true, loading: false }));
        return;
      }
      const next = queue.shift();
      if (next) playOne(...next);
      else set({ key: null, loading: false });
    });
    audio.addEventListener('error', () => set({ error: true, loading: false }));
  }
  set({ key: `${s}:${a}`, loading: true, error: false });
  audio.src = ayahUrl(s, a);
  audio.play().catch(() => set({ error: true, loading: false }));
}

/** Прочитать аят (или несколько подряд). Повторное нажатие на играющий — стоп. */
export function recite(list: [number, number][], opts: { repeat?: boolean } = {}) {
  const [first, ...rest] = list;
  if (!first) return;
  if (status.key === `${first[0]}:${first[1]}` && !status.error) return stopRecite();
  repeat = !!opts.repeat;
  queue = rest;
  playOne(...first);
}

export function stopRecite() {
  queue = [];
  repeat = false;
  audio?.pause();
  set({ key: null, loading: false, error: false });
}

export function useRecite() {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => status,
  );
}
