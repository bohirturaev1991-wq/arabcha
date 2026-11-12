import { useEffect, useMemo, useState } from 'react';
import { useT } from '../i18n';
import { Ar, Play, Tr, VoiceCheck } from '../components';
import { ALL_ITEMS, type Item } from '../data/words';
import { getState, setState, bump } from '../store';
import { newCard, review, intervalLabel, type Grade } from '../srs';
import { speak } from '../speak';

const NEW_PER_SESSION = 10;

function buildQueue(): Item[] {
  const { cards } = getState();
  const now = Date.now();
  const due = ALL_ITEMS.filter((i) => cards[i.id] && cards[i.id].due <= now).sort((a, b) => cards[a.id].due - cards[b.id].due);
  const fresh = ALL_ITEMS.filter((i) => !cards[i.id]).slice(0, NEW_PER_SESSION);
  return [...due, ...fresh];
}

export default function Cards() {
  const { t, lang } = useT();
  const initial = useMemo(buildQueue, []);
  const [queue, setQueue] = useState(initial);
  const [open, setOpen] = useState(false);
  const item = queue[0];
  const nNew = queue.filter((i) => !getState().cards[i.id]).length;

  useEffect(() => {
    if (item) speak(item.ar).catch(() => {});
  }, [item?.id]);

  if (!item) {
    return (
      <div className="page">
        <h1>{t('cards')}</h1>
        <div className="card center">
          <p className="big">{t('allDone')}</p>
          <button className="btn" onClick={() => setQueue(buildQueue())}>
            {t('again2')}
          </button>
        </div>
      </div>
    );
  }

  const cs = getState().cards[item.id] ?? newCard();
  const grade = (g: Grade) => {
    const next = review(cs, g);
    setState((s) => ({ ...s, cards: { ...s.cards, [item.id]: next } }));
    bump('reviewed');
    setOpen(false);
    // «не помню» — карточка вернётся в конец очереди этой сессии
    setQueue((q) => (g === 0 ? [...q.slice(1), q[0]] : q.slice(1)));
  };

  return (
    <div className="page">
      <VoiceCheck />
      <h1>{t('cards')}</h1>
      <p className="muted small">
        {queue.length - nNew} {t('dueCards')} · {nNew} {t('newCards')}
      </p>
      <div className="card flash" onClick={() => !open && setOpen(true)}>
        <Ar size={48}>{item.ar}</Ar>
        <Play text={item.ar} />
        {open ? (
          <div className="flash-back">
            <Tr latin={item.tr} />
            <div className="big">{item[lang]}</div>
          </div>
        ) : (
          <p className="muted small">{t('cardsHint')}</p>
        )}
      </div>
      {open ? (
        <div className="grades">
          {([0, 1, 2, 3] as Grade[]).map((g) => (
            <button key={g} className={'btn grade g' + g} onClick={() => grade(g)}>
              {t((['again', 'hard', 'good', 'easy'] as const)[g])}
              <span className="small muted">{intervalLabel(cs, g, lang)}</span>
            </button>
          ))}
        </div>
      ) : (
        <button className="btn primary wide" onClick={() => setOpen(true)}>
          {t('showAnswer')}
        </button>
      )}
    </div>
  );
}
