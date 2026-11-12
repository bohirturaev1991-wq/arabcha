// Транскрипция: латиница (для узбекского интерфейса) и кириллица (для русского).
// Особые арабские звуки помечены: ḥ ṣ ḍ ṭ ẓ — «глубокие/твёрдые», ʻ — айн, ʼ — хамза.
import type { Lang } from './store';

const PAIRS: [string, string][] = [
  ['kh', 'х'], ['sh', 'ш'], ['th', 'с̱'], ['dh', 'з̱'], ['gh', 'гъ'],
  ['ā', 'а̄'], ['ī', 'ӣ'], ['ū', 'ӯ'], ['ḥ', 'х̣'], ['ṣ', 'с̣'], ['ḍ', 'д̣'], ['ṭ', 'т̣'], ['ẓ', 'з̣'],
  ['a', 'а'], ['b', 'б'], ['t', 'т'], ['j', 'дж'], ['d', 'д'], ['r', 'р'], ['z', 'з'], ['s', 'с'], ['f', 'ф'],
  ['q', 'къ'], ['k', 'к'], ['l', 'л'], ['m', 'м'], ['n', 'н'], ['h', 'һ'], ['w', 'в'], ['y', 'й'], ['i', 'и'], ['u', 'у'],
];

export function toCyr(s: string) {
  let out = '';
  let i = 0;
  while (i < s.length) {
    const low = s.slice(i).toLowerCase();
    const p = PAIRS.find(([l]) => low.startsWith(l));
    if (p) {
      const upper = s[i] !== s[i].toLowerCase();
      out += upper ? p[1][0].toUpperCase() + p[1].slice(1) : p[1];
      i += p[0].length;
    } else {
      out += s[i];
      i++;
    }
  }
  // «йа/йу/йи» читаются как «я/ю/йи» — оставляем как есть: так точнее передаётся звук
  return out;
}

export const trOf = (latin: string, lang: Lang) => (lang === 'ru' ? toCyr(latin) : latin);
