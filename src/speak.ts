// Озвучка арабского текста.
// В Android-приложении — системный синтез речи (Google TTS, работает без интернета, если установлен
// арабский голос). На сайте — голос браузера (Web Speech API).
import { getState } from './store';

type Native = {
  speak(o: { text: string; lang: string; rate: number; pitch?: number; volume?: number }): Promise<void>;
  stop(): Promise<void>;
  getSupportedLanguages(): Promise<{ languages: string[] }>;
  openInstall(): Promise<void>;
};

const isNative = () => !!(window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.();
let native: Native | null = null;
async function nativeTts(): Promise<Native | null> {
  if (!isNative()) return null;
  if (!native) native = (await import('@capacitor-community/text-to-speech')).TextToSpeech as unknown as Native;
  return native;
}

function webVoice(): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null;
  const vs = speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('ar'));
  // предпочитаем «качественные» голоса Google/Microsoft
  return vs.find((v) => /google|natural|online/i.test(v.name)) || vs[0] || null;
}

export type SpeakSpeed = 'slow' | 'normal';

/** Произнести арабский текст. slow — для разбора произношения. */
export async function speak(text: string, speed: SpeakSpeed = 'normal') {
  const base = getState().profile.rate || 0.9;
  const rate = speed === 'slow' ? base * 0.6 : base;
  const n = await nativeTts();
  if (n) {
    try {
      await n.stop();
    } catch {
      /* ничего не играло */
    }
    return n.speak({ text, lang: 'ar-SA', rate, pitch: 1, volume: 1 });
  }
  if (!('speechSynthesis' in window)) throw new Error('no-tts');
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ar-SA';
  const v = webVoice();
  if (v) u.voice = v;
  u.rate = rate;
  speechSynthesis.speak(u);
}

/** Есть ли арабский голос (для подсказки «установите арабский голос»). */
export async function hasArabicVoice(): Promise<boolean> {
  const n = await nativeTts();
  if (n) {
    try {
      const { languages } = await n.getSupportedLanguages();
      return languages.some((l) => l.toLowerCase().startsWith('ar'));
    } catch {
      return true;
    }
  }
  if (!('speechSynthesis' in window)) return false;
  if (!speechSynthesis.getVoices().length) await new Promise((r) => setTimeout(r, 800));
  return !!webVoice();
}

/** Открыть установку голосовых данных (Android). */
export async function installVoice() {
  const n = await nativeTts();
  if (n) await n.openInstall();
}

export const canInstallVoice = isNative;
