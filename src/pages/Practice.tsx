import { useEffect, useState } from 'react';
import { useT, type Key } from '../i18n';
import { Ar, Play, Tr, VoiceCheck } from '../components';
import { LETTERS } from '../data/letters';
import { ALL_ITEMS } from '../data/words';
import { setState, bump } from '../store';
import { speak } from '../speak';
import { trOf } from '../translit';

type Kind = 'listenLetter' | 'letterName' | 'listenWord' | 'meaning' | 'read';
const KINDS: { id: Kind; icon: string }[] = [
  { id: 'listenLetter', icon: '👂' },
  { id: 'letterName', icon: 'أ' },
  { id: 'listenWord', icon: '🎧' },
  { id: 'meaning', icon: '💡' },
  { id: 'read', icon: '📖' },
];

interface Q {
  prompt: Key;
  audio?: string; // что произнести
  show?: string; // что показать по-арабски
  options: { label: string; ar?: boolean; ok: boolean }[];
}

const shuffle = <T,>(a: T[]) => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};
const pick = <T,>(a: T[], n: number) => shuffle(a).slice(0, n);

function makeQ(kind: Kind, lang: 'uz' | 'ru'): Q {
  if (kind === 'listenLetter' || kind === 'letterName') {
    const [right, ...wrong] = pick(LETTERS, 4);
    const opts = [right, ...wrong].map((l) => ({
      label: kind === 'listenLetter' ? l.ar : trOf(l.tr, lang),
      ar: kind === 'listenLetter',
      ok: l === right,
    }));
    return kind === 'listenLetter'
      ? { prompt: 'whatLetter', audio: right.name, options: shuffle(opts) }
      : { prompt: 'whatName', show: right.ar, audio: right.name, options: shuffle(opts) };
  }
  const [right, ...wrong] = pick(ALL_ITEMS.filter((i) => i.ar.length < 40), 4);
  const all = [right, ...wrong];
  if (kind === 'listenWord')
    return { prompt: 'whatWord', audio: right.ar, options: shuffle(all.map((i) => ({ label: i.ar, ar: true, ok: i === right }))) };
  if (kind === 'meaning')
    return { prompt: 'whatMeans', show: right.ar, audio: right.ar, options: shuffle(all.map((i) => ({ label: i[lang], ok: i === right }))) };
  return { prompt: 'howRead', show: right.ar, audio: right.ar, options: shuffle(all.map((i) => ({ label: trOf(i.tr, lang), ok: i === right }))) };
}

const ROUND = 10;

export default function Practice() {
  const { t, lang } = useT();
  const [kind, setKind] = useState<Kind | null>(null);
  const [q, setQ] = useState<Q | null>(null);
  const [n, setN] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);

  const start = (k: Kind) => {
    setKind(k);
    setN(0);
    setScore(0);
    setChosen(null);
    setQ(makeQ(k, lang));
  };

  // в заданиях «на слух» сразу проигрываем звук
  useEffect(() => {
    if (q?.audio && (kind === 'listenLetter' || kind === 'listenWord')) speak(q.audio).catch(() => {});
  }, [q]);

  if (!kind || !q) {
    return (
      <div className="page">
        <VoiceCheck />
        <h1>{t('practice')}</h1>
        <div className="topic-grid">
          {KINDS.map((k) => (
            <button key={k.id} className="card topic" onClick={() => start(k.id)}>
              <span className="topic-icon">{k.icon}</span>
              <b>{t(('ex_' + k.id) as Key)}</b>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (n >= ROUND) {
    return (
      <div className="page">
        <h1>{t('result')}</h1>
        <div className="card center">
          <p className="big">
            {score} / {ROUND}
          </p>
          <div className="row">
            <button className="btn primary" onClick={() => start(kind)}>
              {t('again2')}
            </button>
            <button className="btn" onClick={() => setKind(null)}>
              {t('finish')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const answer = (i: number) => {
    if (chosen !== null) return;
    setChosen(i);
    const ok = q.options[i].ok;
    if (ok) setScore((s) => s + 1);
    bump('answered');
    setState((s) => ({ ...s, qstats: { answered: s.qstats.answered + 1, correct: s.qstats.correct + (ok ? 1 : 0) } }));
    if (!ok && q.audio) speak(q.audio, 'slow').catch(() => {});
  };
  const next = () => {
    setChosen(null);
    setN((x) => x + 1);
    setQ(makeQ(kind, lang));
  };
  const listenOnly = kind === 'listenLetter' || kind === 'listenWord';

  return (
    <div className="page">
      <div className="row between">
        <span className="muted small">
          {t('question')} {n + 1}/{ROUND}
        </span>
        <span className="muted small">✓ {score}</span>
      </div>
      <div className="card quiz">
        <h3>{t(q.prompt)}</h3>
        {q.show && <Ar size={kind === 'letterName' ? 90 : 44}>{q.show}</Ar>}
        {q.audio && (listenOnly || chosen !== null) && <Play text={q.audio} />}
      </div>
      <div className={'options' + (q.options.some((o) => o.ar) ? ' ar-options' : '')}>
        {q.options.map((o, i) => {
          const cls = chosen === null ? '' : o.ok ? ' ok' : chosen === i ? ' bad' : ' dim';
          return (
            <button key={i} className={'btn option' + cls} onClick={() => answer(i)}>
              {o.ar ? <Ar size={30}>{o.label}</Ar> : o.label}
            </button>
          );
        })}
      </div>
      {chosen !== null && (
        <>
          <div className={'notice ' + (q.options[chosen].ok ? 'ok' : 'warn')}>
            {q.options[chosen].ok ? t('correct') : t('wrong')}
            {kind !== 'letterName' && kind !== 'listenLetter' && q.audio && (
              <AnswerHint ar={q.audio} />
            )}
          </div>
          <button className="btn primary wide" onClick={next}>
            {t('next')} →
          </button>
        </>
      )}
    </div>
  );
}

function AnswerHint({ ar }: { ar: string }) {
  const { lang } = useT();
  const item = ALL_ITEMS.find((i) => i.ar === ar);
  if (!item) return null;
  return (
    <div className="hint">
      <Ar size={28}>{item.ar}</Ar> <Tr latin={item.tr} /> — {item[lang]}
    </div>
  );
}
