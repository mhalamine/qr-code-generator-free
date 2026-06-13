import { translations } from '../utils/translations';

export default function ThemeToggle({ theme, toggleTheme, lang }) {
  const t = translations[lang];

  return (
    <button
      className="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={t.themeToggle}
      title={theme === 'dark' ? t.themeLight : t.themeDark}
    >
      <span className="theme-icon">
        {theme === 'dark' ? '☀️' : '🌙'}
      </span>
      <span className="theme-text">
        {theme === 'dark' ? t.themeLight : t.themeDark}
      </span>
    </button>
  );
}
