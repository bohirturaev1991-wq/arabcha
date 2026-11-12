// Озвучка арабского текста.
// В Android-приложении — системный синтез речи (движок по умолчанию; нужен арабский голос,
// лучше всего «Синтезатор речи Google»). На сайте — голос браузера (Web Speech API).
import { getState } from './store';

type Native = {
  speak(o: { text: string; lang: string; rate: number; pitch?: number; volume?: number }): Promise<void>;
  stop(): Promise<void>;
  getSupportedLanguages(): Promise<{ languages: string[] }>;
  isLanguageSupported(o: { lang: string }): Promise<{ supported: boolean }>;
  openInstall(): Promise<void>;
};

export const isNative = () => !!(window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.();
let native: Native | null = null;
async function nativeTts(): Promise<Native | null> {
  if (!isNative()) return null;
  if (!native) native = (await import('@capacitor-community/text-to-speech')).TextToSpeech as unknown as Native;
  return native;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Причина, по которой нет звука — для понятного сообщения пользователю. */
export type VoiceError = 'noArabic' | 'notReady' | 'noTts' | 'failed';
export class SpeakError extends Error {
  constructor(
    public kind: VoiceError,
    msg: string,
  ) {
    super(msg);
  }
}
let lastError = '';
export const getLastError = () => lastError;

function classify(e: unknown): SpeakError {
  if (e instanceof SpeakError) return e;
  const msg = String((e as { message?: string })?.message ?? e);
  lastError = msg;
  if (/not supported/i.test(msg)) return new SpeakError('noArabic', msg);
  if (/initialized|not available/i.test(msg)) return new SpeakError('notReady', msg);
  return new SpeakError('failed', msg);
}

let voicesReady: Promise<void> | null = null;
function loadWebVoices(): Promise<void> {
  if (!('speechSynthesis' in window)) return Promise.resolve();
  if (speechSynthesis.getVoices().length) return Promise.resolve();
  voicesReady ??= new Promise<void>((res) => {
    speechSynthesis.addEventListener('voiceschanged', () => res(), { once: true });
    setTimeout(res, 1500);
  });
  return voicesReady;
}

function webVoice(): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null;
  const vs = speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith('ar'));
  // предпочитаем «качественные» голоса Google/Microsoft
  return vs.find((v) => /google|natural|online/i.test(v.name)) || vs[0] || null;
}

export type SpeakSpeed = 'slow' | 'normal';

async function speakNative(n: Native, text: string, rate: number) {
  try {
    await n.stop();
  } catch {
    /* ничего не играло */
  }
  // движок может ещё запускаться (первое нажатие после открытия) — несколько попыток;
  // язык пробуем и как «ar-SA», и просто «ar»
  let err: SpeakError | null = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    for (const lang of ['ar-SA', 'ar']) {
      try {
        await n.speak({ text, lang, rate, pitch: 1, volume: 1 });
        lastError = '';
        return;
      } catch (e) {
        err = classify(e);
        if (err.kind === 'notReady') break;
      }
    }
    if (err?.kind !== 'notReady') break;
    await sleep(700);
  }
  throw err ?? new SpeakError('failed', 'unknown');
}

async function speakWeb(text: string, rate: number) {
  if (!('speechSynthesis' in window)) {
    lastError = 'speechSynthesis missing';
    throw new SpeakError('noTts', lastError);
  }
  await loadWebVoices();
  const v = webVoice();
  // голоса известны, но арабского среди них нет — другой голос арабский текст не прочитает
  if (!v && speechSynthesis.getVoices().length) {
    lastError = 'web: no arabic voice';
    throw new SpeakError('noArabic', lastError);
  }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ar-SA';
  if (v) u.voice = v;
  u.rate = rate;
  await new Promise<void>((res, rej) => {
    let started = false;
    u.onstart = () => (started = true);
    u.onend = () => res();
    u.onerror = (e) => {
      // «interrupted»/«canceled» — нажали другую кнопку, это не ошибка
      if (e.error === 'interrupted' || e.error === 'canceled') res();
      else rej(new SpeakError(v ? 'failed' : 'noArabic', (lastError = 'web: ' + e.error)));
    };
    speechSynthesis.speak(u);
    // если так и не начал говорить — скорее всего, нет арабского голоса
    setTimeout(() => {
      if (!started && !speechSynthesis.speaking) {
        lastError = v ? 'web: did not start' : 'web: no arabic voice';
        rej(new SpeakError(v ? 'failed' : 'noArabic', lastError));
      }
    }, 3000);
  });
  lastError = '';
}

/** Произнести арабский текст. slow — для разбора произношения. Бросает SpeakError с причиной. */
export async function speak(text: string, speed: SpeakSpeed = 'normal') {
  const base = getState().profile.rate || 0.9;
  const rate = speed === 'slow' ? base * 0.6 : base;
  const n = await nativeTts();
  if (n) return speakNative(n, text, rate);
  return speakWeb(text, rate);
}

/** Есть ли арабский голос (для подсказки «установите арабский голос»). */
export async function hasArabicVoice(): Promise<boolean> {
  const n = await nativeTts();
  if (n) {
    for (let i = 0; i < 4; i++) {
      try {
        const { supported } = await n.isLanguageSupported({ lang: 'ar' });
        return supported;
      } catch {
        await sleep(700); // движок ещё не готов
      }
    }
    return true;
  }
  if (!('speechSynthesis' in window)) return false;
  await loadWebVoices();
  return !!webVoice();
}

/** Сведения для блока «Диагностика звука» в настройках. */
export async function voiceInfo(): Promise<string[]> {
  const out: string[] = [isNative() ? 'Android app' : 'Web: ' + navigator.userAgent.replace(/\).*$/, ')')];
  const n = await nativeTts();
  if (n) {
    try {
      const { languages } = await n.getSupportedLanguages();
      const ar = languages.filter((l) => l.toLowerCase().startsWith('ar'));
      out.push(`TTS: ${languages.length} langs, arabic: ${ar.join(', ') || '—'}`);
    } catch (e) {
      out.push('TTS error: ' + String((e as Error)?.message ?? e));
    }
  } else if ('speechSynthesis' in window) {
    await loadWebVoices();
    const all = speechSynthesis.getVoices();
    const ar = all.filter((v) => v.lang.toLowerCase().startsWith('ar'));
    out.push(`Voices: ${all.length}, arabic: ${ar.map((v) => v.name).join(', ') || '—'}`);
  } else out.push('speechSynthesis: —');
  if (lastError) out.push('Last error: ' + lastError);
  return out;
}

/** Открыть установку голосовых данных (Android). */
export async function installVoice() {
  const n = await nativeTts();
  if (n) await n.openInstall();
}

export const canInstallVoice = isNative;
