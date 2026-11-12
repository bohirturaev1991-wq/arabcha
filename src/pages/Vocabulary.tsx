import { useState } from 'react';
import { useT } from '../i18n';
import { Ar, Play, Tr, VoiceCheck } from '../components';
import { PHRASES, TOPICS } from '../data/words';
import { href } from '../router';
import { useStore } from '../store';

export default function Vocabulary({ kind, topic }: { kind: 'words' | 'phrases'; topic?: string }) {
  const { t, lang } = useT();
  const list = kind === 'words' ? TOPICS : PHRASES;
  const cards = useStore((s) => s.cards);
  const [hideTr, setHideTr] = useState(false);
  const tp = topic ? list.find((x) => x.id === topic) : undefined;

  if (!tp) {
    return (
      <div className="page">
        <h1>{t(kind)}</h1>
        <div className="topic-grid">
          {list.map((x) => {
            const seen = x.items.filter((i) => cards[i.id]).length;
            return (
              <a key={x.id} className="card topic" href={href('/' + kind + '/' + x.id)}>
                <span className="topic-icon">{x.icon}</span>
                <b>{x[lang]}</b>
                <span className="muted small">
                  {seen}/{x.items.length}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <VoiceCheck />
      <h1>
        {tp.icon} {tp[lang]}
      </h1>
      <label className="row small muted">
        <input type="checkbox" checked={!hideTr} onChange={(e) => setHideTr(!e.target.checked)} /> {t('showTr')}
      </label>
      <div className="vocab">
        {tp.items.map((i) => (
          <div key={i.id} className={'card vocab-item' + (kind === 'phrases' ? ' phrase' : '')}>
            <div className="vocab-ar">
              <Ar size={kind === 'phrases' ? 28 : 34}>{i.ar}</Ar>
            </div>
            <div className="vocab-body">
              {!hideTr && <Tr latin={i.tr} />}
              <span>{i[lang]}</span>
            </div>
            <Play text={i.ar} />
          </div>
        ))}
      </div>
      <a className="btn primary wide" href="#/cards">
        🗂 {t('cards')}
      </a>
    </div>
  );
}
