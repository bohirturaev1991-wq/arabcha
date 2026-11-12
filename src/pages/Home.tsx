import { useStore, streak } from '../store';
import { useT, type Key } from '../i18n';
import { Ar, Progress, VoiceCheck } from '../components';
import { LETTERS } from '../data/letters';
import { HARAKAT } from '../data/harakat';
import { ALL_ITEMS } from '../data/words';

export default function Home() {
  const { t } = useT();
  const s = useStore((s) => s);
  const letters = Object.keys(s.letters).length;
  const har = Object.keys(s.harakat).length;
  const now = Date.now();
  const due = Object.values(s.cards).filter((c) => c.due <= now).length;
  const seen = Object.keys(s.cards).length;
  const days = streak(s);

  const steps: { href: string; icon: string; title: Key; hint: Key; done: number; total: number }[] = [
    { href: '#/alphabet', icon: 'أ', title: 'alphabet', hint: 'step1', done: letters, total: LETTERS.length },
    { href: '#/harakat', icon: 'ـَ', title: 'harakat', hint: 'step2', done: har, total: HARAKAT.length },
    { href: '#/words', icon: '📖', title: 'words', hint: 'step3', done: 0, total: 0 },
    { href: '#/phrases', icon: '💬', title: 'phrases', hint: 'step4', done: 0, total: 0 },
    { href: '#/cards', icon: '🗂', title: 'cards', hint: 'step5', done: seen, total: ALL_ITEMS.length },
    { href: '#/practice', icon: '🎯', title: 'practice', hint: 'step6', done: 0, total: 0 },
  ];
  // у кого есть база — сначала слова и фразы
  const order = s.profile.level === 'some' ? [2, 3, 4, 5, 0, 1] : [0, 1, 2, 3, 4, 5];

  return (
    <div className="page">
      <VoiceCheck />
      <section className="hero card">
        <Ar size={36}>بِسْمِ اللّٰهِ</Ar>
        <div className="stats">
          <div>
            <b>
              {letters}/{LETTERS.length}
            </b>
            <span className="muted small"> {t('lettersLearned')}</span>
          </div>
          <div>
            <b>{due}</b>
            <span className="muted small"> {t('dueCards')}</span>
          </div>
          <div>
            🔥 <b>{days}</b>
            <span className="muted small"> {t('streak')}</span>
          </div>
        </div>
      </section>
      <h2>{t('pathTitle')}</h2>
      <div className="path">
        {order.map((i, n) => {
          const st = steps[i];
          return (
            <a key={st.href} className="card path-step" href={st.href}>
              <span className="path-num">{n + 1}</span>
              <span className="path-icon" dir="rtl">
                {st.icon}
              </span>
              <span className="path-body">
                <b>{t(st.title)}</b>
                <span className="muted small">{t(st.hint)}</span>
                {st.total > 0 && <Progress value={st.done / st.total} />}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
