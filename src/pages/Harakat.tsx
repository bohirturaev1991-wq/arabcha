import { useStore, setState } from '../store';
import { useT } from '../i18n';
import { Ar, Play, Tr, VoiceCheck } from '../components';
import { HARAKAT } from '../data/harakat';
import { LETTERS } from '../data/letters';
import { speak } from '../speak';

// таблица «буква × огласовка» для тренировки чтения слогов
const DRILL = ['ba', 'ta', 'tha', 'jim', 'dal', 'ra', 'sin', 'mim', 'nun', 'lam', 'kaf', 'qaf'];
const VOWELS = [
  { s: 'َ', v: 'a' },
  { s: 'ِ', v: 'i' },
  { s: 'ُ', v: 'u' },
];

export default function Harakat() {
  const { t, lang } = useT();
  const done = useStore((s) => s.harakat);
  const letters = DRILL.map((id) => LETTERS.find((l) => l.id === id)!).filter(Boolean);

  return (
    <div className="page">
      <VoiceCheck />
      <h1>{t('harakat')}</h1>
      <p className="muted small">{t('step2')}</p>
      {HARAKAT.map((h) => (
        <section key={h.id} className={'card haraka' + (done[h.id] ? ' done' : '')}>
          <div className="haraka-head">
            <button className="haraka-sign" onClick={() => speak(h.sign.split(' ')[0], 'slow')}>
              <Ar size={56}>{h.sign}</Ar>
            </button>
            <div>
              <Ar size={28}>{h.name}</Ar> <Tr latin={h.tr} />
              <p>{h[lang]}</p>
            </div>
          </div>
          <div className="haraka-ex">
            {h.ex.map((e) => (
              <div key={e.ar} className="ex-row">
                <Ar size={34}>{e.ar}</Ar>
                <span>
                  <Tr latin={e.tr} /> — {e[lang]}
                </span>
                <Play text={e.ar} small />
              </div>
            ))}
          </div>
          <button
            className={'btn small ' + (done[h.id] ? 'done' : '')}
            onClick={() =>
              setState((s) => {
                const harakat = { ...s.harakat };
                if (harakat[h.id]) delete harakat[h.id];
                else harakat[h.id] = Date.now();
                return { ...s, harakat };
              })
            }
          >
            {done[h.id] ? t('learned') : t('markLearned')}
          </button>
        </section>
      ))}

      <h2>{t('syllables')}</h2>
      <p className="muted small">{t('tapToHear')}</p>
      <div className="card drill">
        <table dir="rtl">
          <tbody>
            {letters.map((l) => (
              <tr key={l.id}>
                {VOWELS.map((v) => {
                  const ar = l.ar + v.s;
                  return (
                    <td key={v.v}>
                      <button className="syl-cell" onClick={() => speak(ar, 'slow')}>
                        <Ar size={32}>{ar}</Ar>
                        <span dir="ltr" className="small">
                          <Tr latin={(l.id === 'ya' ? 'y' : l.sound) + v.v} />
                        </span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
