import { useState, useEffect, useRef, useCallback } from 'react';
import LanguageToggle from './components/LanguageToggle';
import ThemeToggle from './components/ThemeToggle';
import QRForm from './components/QRForm';
import Customizer from './components/Customizer';
import QRPreview from './components/QRPreview';
import History from './components/History';
import { translations } from './utils/translations';
import { defaultDesignConfig } from './utils/presets';
import { getLogo, saveLogo, deleteLogo as deleteLogoFromDB } from './utils/db';

export default function App() {
  // Theme State
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('qr_pref_theme');
    if (stored) return stored;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemDark ? 'dark' : 'light';
  });

  // Sync theme to body element
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('qr_pref_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // 1. Language State
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('qr_pref_lang') || 'en';
  });

  // Apply language attributes on mount
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = translations[lang];

  // 2. State for QR inputs
  const [rawValue, setRawValue] = useState('');
  const [formData, setFormData] = useState(null);
  const [formType, setFormType] = useState('link');
  const [formKey, setFormKey] = useState(0);

  // 3. State for Styling config
  const [designConfig, setDesignConfig] = useState(defaultDesignConfig);

  // 4. State for History
  const [historyList, setHistoryList] = useState(() => {
    const stored = localStorage.getItem('qr_generation_history');
    return stored ? JSON.parse(stored) : [];
  });

  // Load logo from IndexedDB on startup
  useEffect(() => {
    const fetchLogo = async () => {
      const cachedLogo = await getLogo();
      if (cachedLogo) {
        setDesignConfig((prev) => ({
          ...prev,
          image: cachedLogo,
        }));
      }
    };
    fetchLogo();
  }, []);

  // Update layout class on body
  useEffect(() => {
    document.body.className = lang === 'ar' ? 'rtl-layout' : 'ltr-layout';
  }, [lang]);

  // Handle data updates from forms
  const handleDataChange = useCallback((value, metadata) => {
    setRawValue(value);
    setFormData(metadata);
    setFormType(metadata.type);
  }, []);

  // Handle custom design updates
  const handleConfigUpdate = (updater) => {
    setDesignConfig(updater);
  };

  // Handle Logo Upload
  const handleLogoChange = async (base64Image) => {
    setDesignConfig((prev) => ({
      ...prev,
      image: base64Image,
    }));
    await saveLogo(base64Image);
  };

  // Handle Logo Removal
  const handleLogoRemove = async () => {
    setDesignConfig((prev) => ({
      ...prev,
      image: null,
    }));
    await deleteLogoFromDB();
  };

  // Load custom configuration from History item
  const handleLoadHistory = (item) => {
    setFormType(item.type);
    setFormData(item.metadata);
    setFormKey((prev) => prev + 1); // Force form remount with new default values
    
    // Restore styling
    setDesignConfig((prev) => ({
      ...prev,
      dotsOptions: item.style.dotsOptions || prev.dotsOptions,
      backgroundOptions: item.style.backgroundOptions || prev.backgroundOptions,
      cornersSquareOptions: item.style.cornersSquareOptions || prev.cornersSquareOptions,
      cornersDotOptions: item.style.cornersDotOptions || prev.cornersDotOptions,
      imageOptions: item.style.imageOptions || prev.imageOptions,
      // Retain the current image unless the history item had one
      image: item.style.image || prev.image,
    }));
  };

  // Clear History
  const handleClearHistory = () => {
    setHistoryList([]);
    localStorage.removeItem('qr_generation_history');
  };

  // Apply visual preset styles
  const handleApplyPreset = (preset) => {
    setDesignConfig((prev) => ({
      ...prev,
      ...preset,
      // Retain image options and current logo image
      image: prev.image,
      imageOptions: prev.imageOptions,
    }));
  };

  // Auto-save history item (debounced after typing stops)
  const lastSavedRef = useRef({ val: '', type: '', styleHash: '' });
  useEffect(() => {
    if (!rawValue) return;

    // Create a simplified style hash to detect design shifts
    const styleHash = JSON.stringify({
      dots: designConfig.dotsOptions,
      bg: designConfig.backgroundOptions,
      cornersSq: designConfig.cornersSquareOptions,
      cornersDt: designConfig.cornersDotOptions,
    });

    // Check if this specific item has already been saved as the most recent entry
    if (
      lastSavedRef.current.val === rawValue &&
      lastSavedRef.current.type === formType &&
      lastSavedRef.current.styleHash === styleHash
    ) {
      return;
    }

    const timer = setTimeout(() => {
      const newHistoryItem = {
        id: `qr-${Date.now()}`,
        type: formType,
        value: rawValue,
        metadata: formData,
        timestamp: Date.now(),
        style: {
          dotsOptions: designConfig.dotsOptions,
          backgroundOptions: designConfig.backgroundOptions,
          cornersSquareOptions: designConfig.cornersSquareOptions,
          cornersDotOptions: designConfig.cornersDotOptions,
          imageOptions: designConfig.imageOptions,
          image: designConfig.image, // Retain the base64 logo representation
        },
      };

      setHistoryList((prev) => {
        // Keep only top 10 recent items
        const updated = [newHistoryItem, ...prev.filter(item => item.value !== rawValue || item.type !== formType)].slice(0, 15);
        localStorage.setItem('qr_generation_history', JSON.stringify(updated));
        return updated;
      });

      lastSavedRef.current = { val: rawValue, type: formType, styleHash };
    }, 2000); // 2 second debounce before saving to history

    return () => clearTimeout(timer);
  }, [rawValue, formType, formData, designConfig]);

  return (
    <div className="app-container">
      {/* Visual background decorative blobs */}
      <div className="bg-blur-blob blob-1"></div>
      <div className="bg-blur-blob blob-2"></div>
      <div className="bg-blur-blob blob-3"></div>

      <header className="app-header glass-card">
        <div className="header-main">
          <div className="title-area">
            <span className="logo-badge-icon">💠</span>
            <div>
              <h1>{t.appTitle}</h1>
              <p className="subtitle">{t.appSubtitle}</p>
            </div>
          </div>
          <div className="header-actions">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} lang={lang} />
            <LanguageToggle lang={lang} setLang={setLang} />
          </div>
        </div>
      </header>

      <main className="app-layout">
        <div className="layout-left">
          {/* Inputs Section */}
          <QRForm
            key={formKey}
            lang={lang}
            initialData={formData}
            initialType={formType}
            onDataChange={handleDataChange}
          />

          {/* Customizer Options */}
          <Customizer
            lang={lang}
            config={designConfig}
            updateConfig={handleConfigUpdate}
            onLogoChange={handleLogoChange}
            onLogoRemove={handleLogoRemove}
          />

          {/* Presets and History */}
          <History
            lang={lang}
            historyList={historyList}
            onLoadHistory={handleLoadHistory}
            onClearHistory={handleClearHistory}
            onApplyPreset={handleApplyPreset}
          />
        </div>

        <div className="layout-right">
          <QRPreview
            lang={lang}
            rawValue={rawValue}
            designConfig={designConfig}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p className="copyright-love">
          <span className="heart-icon">♥</span> {lang === 'en' ? 'Developed with love by' : 'تم التطوير بكل حب بواسطة'}{' '}
          <a href="https://alamine.me?utm_source=qr-code" target="_blank" rel="noopener noreferrer" className="copyright-link">
            Mohamed Al Amine
          </a>
        </p>
      </footer>
    </div>
  );
}

