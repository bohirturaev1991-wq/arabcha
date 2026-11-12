import { useState } from 'react';
import { setState, type Lang, type Level } from '../store';
import { tr } from '../i18n';
import { Ar } from '../components';

export default function Onboarding() {
  const [lang, setLang] = useState<Lang>('uz');
  const [level, setLevel] = useState<Level | null>(null);
  const t = (k: Parameters<typeof tr>[1]) => tr(lang, k);
  return (
    <div className="onboarding">
      <div className="card onboarding-card">
        <img src="icon.svg" alt="" width={64} height={64} />
        <h1>
          <Ar size={34}>أَهْلًا وَسَهْلًا</Ar>
        </h1>
        <p className="muted">{t('welcome')}</p>
        <h3>{t('chooseLang')}</h3>
        <div className="seg">
          {(['uz', 'ru'] as Lang[]).map((l) => (
            <button key={l} className={lang === l ? 'on' : ''} onClick={() => setLang(l)}>
              {l === 'uz' ? 'Oʻzbekcha' : 'Русский'}
            </button>
          ))}
        </div>
        <h3>{t('yourLevel')}</h3>
        <div className="choices">
          {(
            [
              ['zero', '🌱', 'levelZero', 'levelZeroHint'],
              ['some', '📗', 'levelSome', 'levelSomeHint'],
            ] as const
          ).map(([v, icon, k, h]) => (
            <button key={v} className={'choice' + (level === v ? ' on' : '')} onClick={() => setLevel(v)}>
              <span className="choice-icon">{icon}</span>
              <span>
                <b>{t(k)}</b>
                <span className="muted small">{t(h)}</span>
              </span>
            </button>
          ))}
        </div>
        <button
          className="btn primary wide"
          disabled={!level}
          onClick={() => setState((s) => ({ ...s, profile: { ...s.profile, lang, level } }))}
        >
          {t('start')}
        </button>
      </div>
    </div>
  );
}
