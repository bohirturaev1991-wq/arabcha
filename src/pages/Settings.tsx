import { useEffect, useState } from 'react';
import { useT } from '../i18n';
import { Ar, VoiceCheck, say } from '../components';
import { useStore, setState, resetState, type Lang, type Level } from '../store';
import { installVoice, canInstallVoice, voiceInfo } from '../speak';
import { APK_URL, isNative } from '../update';
import { useTaj, installTaj, removeTaj } from '../tajData';

export default function Settings() {
  const { t } = useT();
  const p = useStore((s) => s.profile);
  const [diag, setDiag] = useState<string[]>([]);
  const refresh = () => voiceInfo().then(setDiag);
  useEffect(() => {
    refresh();
  }, []);
  const set = (patch: Partial<typeof p>) => setState((s) => ({ ...s, profile: { ...s.profile, ...patch } }));

  return (
    <div className="page settings">
      <h1>{t('settings')}</h1>
      <VoiceCheck />
      <div className="card">
        <h3>{t('language')}</h3>
        <div className="seg">
          {(['uz', 'ru'] as Lang[]).map((l) => (
            <button key={l} className={p.lang === l ? 'on' : ''} onClick={() => set({ lang: l })}>
              {l === 'uz' ? 'Oʻzbekcha' : 'Русский'}
            </button>
          ))}
        </div>
        <h3>{t('level')}</h3>
        <div className="seg">
          {(
            [
              ['zero', 'levelZero'],
              ['some', 'levelSome'],
            ] as const
          ).map(([v, k]) => (
            <button key={v} className={p.level === v ? 'on' : ''} onClick={() => set({ level: v as Level })}>
              {t(k)}
            </button>
          ))}
        </div>
      </div>
      <div className="card">
        <h3>
          {t('speed')}: {p.rate.toFixed(2)}
        </h3>
        <input type="range" min={0.5} max={1.2} step={0.05} value={p.rate} onChange={(e) => set({ rate: +e.target.value })} />
        <h3>
          {t('arSize')}: {p.arSize}px
        </h3>
        <input type="range" min={22} max={48} step={2} value={p.arSize} onChange={(e) => set({ arSize: +e.target.value })} />
        <p>
          <Ar>مَرْحَبًا، كَيْفَ حَالُكَ؟</Ar>
        </p>
        <div className="row">
          <button className="btn" onClick={() => say('مَرْحَبًا، كَيْفَ حَالُكَ؟').finally(refresh)}>
            🔊 {t('testVoice')}
          </button>
          {canInstallVoice() && (
            <button className="btn ghost" onClick={() => installVoice()}>
              {t('installVoice')}
            </button>
          )}
        </div>
        <h3>🔧 {t('soundDiag')}</h3>
        <pre className="diag">{diag.join('\n')}</pre>
      </div>
      <ExtraSection />
      <div className="card">
        <button
          className="btn danger"
          onClick={() => {
            if (confirm(t('resetConfirm'))) resetState();
          }}
        >
          {t('reset')}
        </button>
      </div>
      {!isNative() && (
        <a className="btn wide" href={APK_URL}>
          ⬇ {t('apk')}
        </a>
      )}
      <p className="muted small center">build {__BUILD__}</p>
    </div>
  );
}

/** Личный раздел: подключается файлом, в публичном коде его содержимого нет. */
function ExtraSection() {
  const { t } = useT();
  const taj = useTaj();
  const [bad, setBad] = useState(false);
  const onFile = async (f: File | undefined) => {
    if (!f) return;
    const ok = installTaj(await f.text());
    setBad(!ok);
    if (ok) location.hash = '#/tajweed';
  };
  return (
    <div className="card extra">
      <h3>🔒 {t('extra')}</h3>
      {taj ? (
        <div className="row">
          <a className="btn primary" href="#/tajweed">
            {t('extraOn')}
          </a>
          <button className="btn ghost" onClick={() => confirm(t('extraRemove') + '?') && removeTaj()}>
            {t('extraRemove')}
          </button>
        </div>
      ) : (
        <>
          <p className="muted small">{t('extraHint')}</p>
          <label className="btn">
            📂 {t('extraLoad')}
            <input type="file" accept=".json,application/json,text/plain,*/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
          </label>
          {bad && <div className="notice warn">{t('extraBad')}</div>}
        </>
      )}
    </div>
  );
}
