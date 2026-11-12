import { useStore, setState } from '../store';
import { useT } from '../i18n';
import { Ar, Play, Tr, VoiceCheck, say } from '../components';
import { EXTRA, LETTERS, forms, syllables, type Letter } from '../data/letters';
import { href } from '../router';


export default function Alphabet() {
  const { t } = useT();
  const learned = useStore((s) => s.letters);
  return (
    <div className="page">
      <VoiceCheck />
      <h1>{t('alphabet')}</h1>
      <p className="muted small">{t('tapToHear')}</p>
      <div className="letter-grid" dir="rtl">
        {LETTERS.map((l) => (
          <a key={l.id} className={'letter-tile' + (learned[l.id] ? ' done' : '') + (l.hard ? ' hard' : '')} href={href('/letter/' + l.id)}>
            <Ar size={40}>{l.ar}</Ar>
            <span className="letter-tr" dir="ltr">
              <Tr latin={l.tr} />
            </span>
          </a>
        ))}
      </div>
      <h2>{t('extraSigns')}</h2>
      <div className="letter-grid" dir="rtl">
        {EXTRA.map((l) => (
          <a key={l.id} className="letter-tile" href={href('/letter/' + l.id)}>
            <Ar size={40}>{l.ar}</Ar>
            <span className="letter-tr" dir="ltr">
              <Tr latin={l.tr} />
            </span>
          </a>
        ))}
      </div>
      <a className="btn primary wide" href="#/harakat">
        ـَ ـِ ـُ → {t('harakat')}
      </a>
    </div>
  );
}

export function LetterPage({ id }: { id: string }) {
  const { t, lang } = useT();
  const all = [...LETTERS, ...EXTRA];
  const i = all.findIndex((l) => l.id === id);
  const l: Letter | undefined = all[i];
  const learned = useStore((s) => !!s.letters[id]);
  if (!l) return <div className="page">404</div>;
  const f = forms(l);
  const syl = syllables(l);
  const prev = all[i - 1];
  const next = all[i + 1];
  const go = (x: Letter) => location.replace(href('/letter/' + x.id));

  return (
    <div className="page letter-page">
      <div className="card letter-hero">
        <button className="letter-big" onClick={() => say(l.name)} aria-label={t('listen')}>
          <Ar size={110}>{l.ar}</Ar>
        </button>
        <div className="letter-name">
          <Ar size={34}>{l.name}</Ar>
          <Tr latin={l.tr} />
          <Play text={l.name} />
        </div>
        <div className="letter-sound">
          <span className="muted small">{t('sound')}:</span> <b><Tr latin={l.sound} /></b>
        </div>
        <p>{l[lang]}</p>
        {l.hard && <div className="notice warn">⚠ {t('hardSound')}</div>}
      </div>

      <h2>{t('forms')}</h2>
      <div className="forms card">
        {(
          [
            ['final', f.fin],
            ['medial', f.med],
            ['initial', f.init],
            ['isolated', f.isol],
          ] as const
        ).map(([k, v]) => (
          <div key={k} className="form-cell">
            <Ar size={44}>{v}</Ar>
            <span className="muted small">{t(k)}</span>
          </div>
        ))}
      </div>
      {!l.joins && l.id !== 'hamza' && <p className="muted small">↔ {t('noJoin')}</p>}

      {syl.length > 0 && (
        <>
          <h2>{t('syllables')}</h2>
          <div className="syl-grid" dir="rtl">
            {syl.map((s) => (
              <button key={s.ar} className="syl card" onClick={() => say(s.ar, 'slow')}>
                <Ar size={38}>{s.ar}</Ar>
                <span dir="ltr">
                  <Tr latin={s.tr} />
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      <h2>{t('example')}</h2>
      <div className="card example">
        <Ar size={40}>{l.ex.ar}</Ar>
        <div>
          <Tr latin={l.ex.tr} /> — {l.ex[lang]}
        </div>
        <Play text={l.ex.ar} />
      </div>

      <button
        className={'btn wide ' + (learned ? 'done' : 'primary')}
        onClick={() =>
          setState((s) => {
            const letters = { ...s.letters };
            if (learned) delete letters[l.id];
            else letters[l.id] = Date.now();
            return { ...s, letters };
          })
        }
      >
        {learned ? t('learned') : t('markLearned')}
      </button>
      <div className="row nav-row">
        {prev ? (
          <button className="btn ghost" onClick={() => go(prev)}>
            ← <Ar size={22}>{prev.ar}</Ar>
          </button>
        ) : (
          <span />
        )}
        {next && (
          <button className="btn" onClick={() => go(next)}>
            <Ar size={22}>{next.ar}</Ar> →
          </button>
        )}
      </div>
    </div>
  );
}
