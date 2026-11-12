import { useEffect } from 'react';
import { useRoute, href } from './router';
import { useStore, setState, type Lang } from './store';
import { useT, type Key } from './i18n';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Alphabet, { LetterPage } from './pages/Alphabet';
import Harakat from './pages/Harakat';
import Vocabulary from './pages/Vocabulary';
import Cards from './pages/Cards';
import Practice from './pages/Practice';
import Settings from './pages/Settings';

const NAV: { path: string; key: Key; icon: string }[] = [
  { path: '/', key: 'home', icon: '⌂' },
  { path: '/alphabet', key: 'alphabet', icon: 'أ' },
  { path: '/words', key: 'words', icon: '📖' },
  { path: '/phrases', key: 'phrases', icon: '💬' },
  { path: '/cards', key: 'cards', icon: '🗂' },
  { path: '/practice', key: 'practice', icon: '🎯' },
];

function goBack() {
  if (history.length > 1) history.back();
  else location.hash = '#/';
}

export default function App() {
  const { parts } = useRoute();
  const { t, lang } = useT();
  const level = useStore((s) => s.profile.level);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  if (!level) return <Onboarding />;

  const page = parts[0] || '';
  let body;
  switch (page) {
    case 'alphabet':
      body = <Alphabet />;
      break;
    case 'letter':
      body = <LetterPage id={parts[1]} />;
      break;
    case 'harakat':
      body = <Harakat />;
      break;
    case 'words':
      body = <Vocabulary kind="words" topic={parts[1]} />;
      break;
    case 'phrases':
      body = <Vocabulary kind="phrases" topic={parts[1]} />;
      break;
    case 'cards':
      body = <Cards />;
      break;
    case 'practice':
      body = <Practice />;
      break;
    case 'settings':
      body = <Settings />;
      break;
    default:
      body = <Home />;
  }
  const active = (p: string) =>
    p === '/' ? page === '' : '/' + page === p || (p === '/alphabet' && (page === 'letter' || page === 'harakat'));
  const inner = page === 'letter' || page === 'settings' || page === 'harakat' || (parts.length > 1 && (page === 'words' || page === 'phrases'));

  return (
    <div className="shell">
      <header className="topbar">
        {inner && (
          <button className="icon-btn back-btn" onClick={goBack} aria-label={t('goBack')} title={t('goBack')}>
            ←
          </button>
        )}
        <a className="brand" href="#/">
          <img src="icon.svg" alt="" width={28} height={28} />
          <span>{t('appName')}</span>
        </a>
        <div className="topbar-actions">
          <div className="seg small" role="group" aria-label="Til / Язык">
            {(['uz', 'ru'] as Lang[]).map((l) => (
              <button key={l} className={lang === l ? 'on' : ''} onClick={() => setState((s) => ({ ...s, profile: { ...s.profile, lang: l } }))}>
                {l === 'uz' ? 'UZ' : 'RU'}
              </button>
            ))}
          </div>
          <a className="icon-btn" href="#/settings" title={t('settings')} aria-label={t('settings')}>
            ⚙
          </a>
        </div>
      </header>
      <nav className="sidenav" aria-label="main">
        {NAV.map((n) => (
          <a key={n.path} href={href(n.path)} className={active(n.path) ? 'active' : ''}>
            <span className="nav-icon" aria-hidden>
              {n.icon}
            </span>
            <span className="nav-label">{t(n.key)}</span>
          </a>
        ))}
      </nav>
      <main className="content">{body}</main>
    </div>
  );
}
