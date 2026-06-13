export default function LanguageToggle({ lang, setLang }) {
  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'ar' : 'en';
    setLang(nextLang);
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = nextLang;
    localStorage.setItem('qr_pref_lang', nextLang);
  };

  return (
    <button className="lang-toggle-btn" onClick={toggleLanguage} aria-label="Toggle language">
      <span className="lang-icon">🌐</span>
      <span className="lang-text">
        {lang === 'en' ? 'العربية' : 'English'}
      </span>
    </button>
  );
}
