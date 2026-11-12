import { useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import { useBackClose } from './back';
import { speak, hasArabicVoice, installVoice, canInstallVoice, SpeakError, type SpeakSpeed, type VoiceError } from './speak';
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

// ---- общая плашка «почему нет звука» ----
let soundErr: VoiceError | null = null;
const errSubs = new Set<() => void>();
export function reportSoundError(e: unknown) {
  soundErr = e instanceof SpeakError ? e.kind : 'failed';
  errSubs.forEach((f) => f());
}
function clearSoundError() {
  soundErr = null;
  errSubs.forEach((f) => f());
}
/** Нажатие «прослушать» с понятным сообщением при ошибке. */
export function say(text: string, sp: SpeakSpeed = 'normal') {
  return speak(text, sp)
    .then(() => {
      if (soundErr) clearSoundError();
      bump('listened');
    })
    .catch(reportSoundError);
}

export function SoundErrorBanner() {
  const { t } = useT();
  const err = useSyncExternalStore(
    (cb) => {
      errSubs.add(cb);
      return () => errSubs.delete(cb);
    },
    () => soundErr,
  );
  if (!err) return null;
  const key = err === 'noArabic' ? (canInstallVoice() ? 'err_noArabic' : 'err_noArabicWeb') : err === 'notReady' ? 'err_notReady' : err === 'noTts' ? 'err_noArabicWeb' : 'err_failed';
  return (
    <div className="notice warn sound-err" role="alert">
      <span>🔇 {t(key)}</span>
      <div className="row">
        {err === 'noArabic' && canInstallVoice() && (
          <button className="btn small primary" onClick={() => installVoice()}>
            {t('installVoice')}
          </button>
        )}
        <a className="btn small" href="#/settings" onClick={clearSoundError}>
          {t('soundDiag')}
        </a>
        <button className="btn small ghost" onClick={clearSoundError}>
          ✕
        </button>
      </div>
    </div>
  );
}

/** Кнопка «прослушать» (обычно и медленно). */
export function Play({ text, small, slow = true }: { text: string; small?: boolean; slow?: boolean }) {
  const { t } = useT();
  const go = (sp: SpeakSpeed) => (e: React.MouseEvent) => {
    e.stopPropagation();
    say(text, sp);
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
