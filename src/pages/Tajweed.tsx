import { useState } from 'react';
import { useT } from '../i18n';
import { Ar, Tr } from '../components';
import { useTaj, type TajData, type TajExample } from '../tajData';
import { href } from '../router';
import { setState, useStore } from '../store';
import { RECITERS, DEFAULT_RECITER, recite, stopRecite, useRecite } from '../recite';

/** Арабский текст с подсвеченной частью (там, где действует правило). */
export function Hl({ ar, hl, size }: { ar: string; hl: string; size?: number }) {
  const i = hl ? ar.indexOf(hl) : -1;
  if (i < 0) return <Ar size={size}>{ar}</Ar>;
  return (
    <Ar size={size}>
      {ar.slice(0, i)}
      <mark className="taj-hl">{ar.slice(i, i + hl.length)}</mark>
      {ar.slice(i + hl.length)}
    </Ar>
  );
}

/** Кнопка «чтение чтеца» для аята. */
export function QariButton({ s, a, label }: { s: number; a: number; label?: string }) {
  const { t } = useT();
  const st = useRecite();
  const on = st.key === `${s}:${a}`;
  return (
    <button className={'btn small qari' + (on ? ' on' : '')} onClick={() => recite([[s, a]])} title={t('listenQari')}>
      {on ? (st.loading ? '⏳' : st.error ? '⚠' : '⏹') : '🎙'} {label ?? `${s}:${a}`}
    </button>
  );
}

function ReciteError() {
  const { t } = useT();
  const st = useRecite();
  return st.error ? <div className="notice warn">⚠ {t('reciteError')}</div> : null;
}

function ReciterPick() {
  const { t, lang } = useT();
  const cur = useStore((s) => s.profile.reciter || DEFAULT_RECITER);
  return (
    <label className="reciter">
      <span className="muted small">🎙 {t('reciter')}</span>
      <select
        value={cur}
        onChange={(e) => {
          stopRecite();
          setState((s) => ({ ...s, profile: { ...s.profile, reciter: e.target.value } }));
        }}
      >
        {RECITERS.map((r) => (
          <option key={r.id} value={r.id}>
            {r[lang]}
          </option>
        ))}
      </select>
    </label>
  );
}

function Example({ e }: { e: TajExample }) {
  const { lang } = useT();
  return (
    <div className="taj-ex">
      <Hl ar={e.ar} hl={e.hl} size={34} />
      <div className="taj-ex-body">
        <Tr latin={e.tr} />
        <span className="small">{e[lang]}</span>
      </div>
      <QariButton s={e.ref[0]} a={e.ref[1]} />
    </div>
  );
}

export default function Tajweed({ sub, arg }: { sub?: string; arg?: string }) {
  const d = useTaj();
  if (!d) return <div className="page">404</div>;
  if (sub === 'sura' && arg) return <SuraPage n={+arg} d={d} />;
  return <TajweedHome tab={sub === 'suras' ? 'suras' : 'rules'} d={d} />;
}

function TajweedHome({ tab, d }: { tab: 'rules' | 'suras'; d: TajData }) {
  const { groups: TAJ_GROUPS, rules: TAJWEED, waqf: WAQF, suras: SURAS } = d;
  const { t, lang } = useT();
  const [open, setOpen] = useState<string | null>(null);
  const groups = Object.keys(TAJ_GROUPS);

  return (
    <div className="page">
      <h1>📖 {t('tajweed')}</h1>
      <div className="seg">
        <button className={tab === 'rules' ? 'on' : ''} onClick={() => location.replace(href('/tajweed'))}>
          {t('tajRules')}
        </button>
        <button className={tab === 'suras' ? 'on' : ''} onClick={() => location.replace(href('/tajweed/suras'))}>
          {t('suras')}
        </button>
      </div>
      <p className="notice small">{t('tajNote')}</p>
      <ReciterPick />
      <ReciteError />

      {tab === 'suras' ? (
        <div className="topic-grid">
          {SURAS.map((s) => (
            <a key={s.n} className="card topic" href={href('/tajweed/sura/' + s.n)}>
              <Ar size={30}>{s.name}</Ar>
              <b>{s[lang]}</b>
              <span className="muted small">
                {s.n} · {s.ayat.length} {t('ayah')}
              </span>
            </a>
          ))}
        </div>
      ) : (
        <>
          {groups.map((g) => (
            <section key={g} className="taj-group">
              <h2>{TAJ_GROUPS[g][lang]}</h2>
              {TAJWEED.filter((r) => r.group === g).map((r) => {
                const isOpen = open === r.id;
                return (
                  <div key={r.id} className={'card taj-rule' + (isOpen ? ' open' : '')}>
                    <button className="taj-head" onClick={() => setOpen(isOpen ? null : r.id)} aria-expanded={isOpen}>
                      <span>
                        <b>{r[lang]}</b>
                        <span className="muted small">
                          {' '}
                          <Ar size={18}>{r.ar}</Ar>
                        </span>
                      </span>
                      <span aria-hidden>{isOpen ? '▴' : '▾'}</span>
                    </button>
                    {isOpen && (
                      <div className="taj-body">
                        <p>{r.what[lang]}</p>
                        {r.letters && (
                          <div className="taj-letters">
                            <span className="muted small">{t('tajLetters')}:</span> <Ar size={26}>{r.letters}</Ar>
                          </div>
                        )}
                        {r.ex.map((e) => (
                          <Example key={e.ar + e.ref.join()} e={e} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
          ))}
          <h2>{t('waqf')}</h2>
          <div className="card waqf">
            {WAQF.map((w) => (
              <div key={w.sign} className="waqf-row">
                <Ar size={26}>{w.sign}</Ar>
                <span>{w[lang]}</span>
              </div>
            ))}
          </div>
          <a className="btn wide" href={href('/tajweed/suras')}>
            {t('suras')} →
          </a>
        </>
      )}
    </div>
  );
}

function SuraPage({ n, d }: { n: number; d: TajData }) {
  const SURAS = d.suras;
  const { t, lang } = useT();
  const s = SURAS.find((x) => x.n === n);
  const st = useRecite();
  const [rep, setRep] = useState(false);
  const [showTr, setShowTr] = useState(true);
  if (!s) return <div className="page">404</div>;
  const playing = st.key?.startsWith(n + ':');
  const all = s.ayat.map((a) => [n, a.n] as [number, number]);

  return (
    <div className="page sura">
      <div className="card center">
        <Ar size={40}>{`سُورَةُ ${s.name}`}</Ar>
        <b>{s[lang]}</b>
        <div className="row center-row">
          <button className="btn primary" onClick={() => (playing ? stopRecite() : recite(all))}>
            {playing ? '⏹ ' + t('stop') : '▶ ' + t('playAll')}
          </button>
        </div>
        <div className="row center-row small">
          <label>
            <input type="checkbox" checked={rep} onChange={(e) => setRep(e.target.checked)} /> 🔁 {t('repeatAyah')}
          </label>
          <label>
            <input type="checkbox" checked={showTr} onChange={(e) => setShowTr(e.target.checked)} /> {t('showTr')}
          </label>
        </div>
      </div>
      <ReciterPick />
      <ReciteError />
      {n !== 1 && n !== 9 && (
        <div className="basmala">
          <Ar size={30}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Ar>
        </div>
      )}
      {s.ayat.map((a) => {
        const on = st.key === `${n}:${a.n}`;
        return (
          <div key={a.n} className={'card ayah' + (on ? ' on' : '')} onClick={() => recite([[n, a.n]], { repeat: rep })}>
            <div className="ayah-ar">
              <Ar size={34}>
                {a.ar} <span className="ayah-num">{toArabicDigits(a.n)}</span>
              </Ar>
            </div>
            {showTr && <Tr latin={a.tr} />}
            <div className="small">{a[lang]}</div>
            <span className="ayah-play muted small">{on ? (st.loading ? '⏳' : '⏹') : '🎙'}</span>
          </div>
        );
      })}
      <div className="row nav-row">
        {SURAS[SURAS.indexOf(s) - 1] ? (
          <a className="btn ghost" href={href('/tajweed/sura/' + SURAS[SURAS.indexOf(s) - 1].n)} onClick={stopRecite}>
            ← {SURAS[SURAS.indexOf(s) - 1][lang]}
          </a>
        ) : (
          <span />
        )}
        {SURAS[SURAS.indexOf(s) + 1] && (
          <a className="btn" href={href('/tajweed/sura/' + SURAS[SURAS.indexOf(s) + 1].n)} onClick={stopRecite}>
            {SURAS[SURAS.indexOf(s) + 1][lang]} →
          </a>
        )}
      </div>
    </div>
  );
}

const toArabicDigits = (n: number) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[+d]);
