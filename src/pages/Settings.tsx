import { useT } from '../i18n';
import { Ar, VoiceCheck } from '../components';
import { useStore, setState, resetState, type Lang, type Level } from '../store';
import { speak, installVoice, canInstallVoice } from '../speak';
import { APK_URL, isNative } from '../update';

export default function Settings() {
  const { t } = useT();
  const p = useStore((s) => s.profile);
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
          <button className="btn" onClick={() => speak('مَرْحَبًا، كَيْفَ حَالُكَ؟').catch(() => {})}>
            🔊 {t('testVoice')}
          </button>
          {canInstallVoice() && (
            <button className="btn ghost" onClick={() => installVoice()}>
              {t('installVoice')}
            </button>
          )}
        </div>
      </div>
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
