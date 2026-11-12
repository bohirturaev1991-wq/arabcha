// Раздел «Таджвид» — закрытый: тексты правил и сур не входят в публичный код.
// Они загружаются из файла arabcha-tajweed.json (Настройки → «Дополнительный раздел»)
// и хранятся только на этом устройстве.
import { useSyncExternalStore } from 'react';

export interface TajExample {
  ar: string;
  hl: string;
  tr: string;
  ref: [number, number];
  uz: string;
  ru: string;
}
export interface TajRule {
  id: string;
  group: string;
  ar: string;
  tr: string;
  uz: string;
  ru: string;
  what: { uz: string; ru: string };
  letters?: string;
  ex: TajExample[];
}
export interface Ayah {
  n: number;
  ar: string;
  tr: string;
  uz: string;
  ru: string;
}
export interface Sura {
  n: number;
  name: string;
  tr: string;
  uz: string;
  ru: string;
  ayat: Ayah[];
}
export interface TajData {
  v: number;
  groups: Record<string, { uz: string; ru: string }>;
  rules: TajRule[];
  waqf: { sign: string; uz: string; ru: string }[];
  suras: Sura[];
}

const KEY = 'arabcha:extra';
let data: TajData | null = load();
const subs = new Set<() => void>();

function valid(d: unknown): d is TajData {
  const x = d as TajData;
  return !!x && Array.isArray(x.rules) && Array.isArray(x.suras) && Array.isArray(x.waqf) && typeof x.groups === 'object';
}
function load(): TajData | null {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || 'null');
    return valid(d) ? d : null;
  } catch {
    return null;
  }
}

/** Подключить раздел из текста файла. Возвращает false, если файл не подходит. */
export function installTaj(text: string): boolean {
  try {
    const d = JSON.parse(text);
    if (!valid(d)) return false;
    localStorage.setItem(KEY, JSON.stringify(d));
    data = d;
    subs.forEach((f) => f());
    return true;
  } catch {
    return false;
  }
}
export function removeTaj() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  data = null;
  subs.forEach((f) => f());
}
export const getTaj = () => data;
export function useTaj() {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => data,
  );
}
