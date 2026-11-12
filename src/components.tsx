import { useEffect, useState, type ReactNode } from 'react';
import { useBackClose } from './back';
import { speak, hasArabicVoice, installVoice, canInstallVoice, type SpeakSpeed } from './speak';
import { bump, useStore } from './store';
import { useT } from './i18n';
import { trOf } from './translit';

/** Арабский текст (справа налево, крупным шрифтом). */
export function Ar({ children, size }: { children: ReactNode; size?: number }) {
  const base = useStore((s) => s.profile.arSize);
  return (
    <span className="ar" dir="rtl" lang="ar" style={{ fontSize: size ?? base }}>
      {children}
    </span>
  );
}

/** Кнопка «прослушать» (обычно и медленно). */
export function Play({ text, small, slow = true }: { text: string; small?: boolean; slow?: boolean }) {
  const { t } = useT();
  const [err, setErr] = useState(false);
  const go = (sp: SpeakSpeed) => (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(text, sp)
      .then(() => bump('listened'))
      .catch(() => setErr(true));
  };
  return (
    <span className={'play' + (small ? ' small' : '')}>
      <button className="play-btn" onClick={go('normal')} aria-label={t('listen')} title={t('listen')}>
        🔊
      </button>
      {slow && (
        <button className="play-btn slow" onClick={go('slow')} aria-label={t('slow')} title={t('slow')}>
          🐢
        </button>
      )}
      {err && <span className="muted small">✕</span>}
    </span>
  );
}

/** Транскрипция по языку интерфейса. */
export function Tr({ latin }: { latin: string }) {
  const { lang } = useT();
  return <span className="tr">[{trOf(latin, lang)}]</span>;
}

/** Предупреждение, если на устройстве нет арабского голоса. */
export function VoiceCheck() {
  const { t } = useT();
  const [ok, setOk] = useState(true);
  useEffect(() => {
    hasArabicVoice().then(setOk);
  }, []);
  if (ok) return null;
  return (
    <div className="notice warn">
      {canInstallVoice() ? t('noVoice') : t('noVoiceWeb')}
      {canInstallVoice() && (
        <button className="btn small" onClick={() => installVoice()}>
          {t('installVoice')}
        </button>
      )}
    </div>
  );
}

export function Modal({ onClose, children, title }: { onClose: () => void; children: ReactNode; title: string }) {
  useBackClose(true, onClose);
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="close">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Progress({ value }: { value: number }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div style={{ width: pct + '%' }} />
    </div>
  );
}
