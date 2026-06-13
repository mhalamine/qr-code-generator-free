import { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { translations } from '../utils/translations';

export default function QRPreview({ lang, rawValue, designConfig }) {
  const t = translations[lang];
  const containerRef = useRef(null);
  const qrCodeRef = useRef(null);
  const [copyStatus, setCopyStatus] = useState(false);

  // Initialize qr-code-styling instance once
  useEffect(() => {
    qrCodeRef.current = new QRCodeStyling({
      width: 280,
      height: 280,
      margin: 12,
      dotsOptions: {
        type: 'square',
        color: '#0b0d19',
      },
      backgroundOptions: {
        color: '#ffffff',
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        hideBackgroundDots: true,
      },
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: 'Q', // High error correction level for logo tolerance
      }
    });

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      qrCodeRef.current.append(containerRef.current);
    }
  }, []);

  // Update QR Code options when config or values change
  useEffect(() => {
    if (qrCodeRef.current) {
      const isArabic = lang === 'ar';
      
      // Merge configuration options
      const mergedConfig = {
        ...designConfig,
        data: rawValue || (isArabic ? 'أهلاً بك في مولد رمز الاستجابة السريعة' : 'Welcome to QR Code Generator'),
      };

      // Extract colors for corners/finders
      const dotsColor = designConfig.dotsOptions?.color || '#0b0d19';
      const dotsGradient = designConfig.dotsOptions?.gradient;

      mergedConfig.cornersSquareOptions = {
        ...designConfig.cornersSquareOptions,
        color: designConfig.cornersSquareOptions?.color || dotsColor,
        gradient: designConfig.cornersSquareOptions?.gradient || dotsGradient,
      };

      mergedConfig.cornersDotOptions = {
        ...designConfig.cornersDotOptions,
        color: designConfig.cornersDotOptions?.color || dotsColor,
        gradient: designConfig.cornersDotOptions?.gradient || dotsGradient,
      };

      qrCodeRef.current.update(mergedConfig);
    }
  }, [rawValue, designConfig, lang]);

  const handleDownload = (format) => {
    if (qrCodeRef.current) {
      qrCodeRef.current.download({
        name: `custom-qr-${Date.now()}`,
        extension: format,
      });
    }
  };

  const handleCopy = async () => {
    if (!qrCodeRef.current) return;
    try {
      const canvas = containerRef.current.querySelector('canvas');
      if (!canvas) return;

      canvas.toBlob((blob) => {
        if (!blob) return;
        try {
          const item = new ClipboardItem({ [blob.type]: blob });
          navigator.clipboard.write([item]).then(() => {
            setCopyStatus(true);
            setTimeout(() => setCopyStatus(false), 2000);
          });
        } catch (err) {
          console.error('Clipboard write error:', err);
        }
      }, 'image/png');
    } catch (err) {
      console.error('Failed to copy canvas:', err);
    }
  };

  return (
    <div className="qr-preview-container glass-card sticky-preview animate-scale-in">
      <h3 className="panel-title text-center">{t.livePreview}</h3>
      
      <div className="qr-display-box">
        <div className="qr-border-glow">
          <div ref={containerRef} className="qr-canvas-holder" />
        </div>
        <div className="scan-me-banner">
          <span>✨ {t.scanMe} ✨</span>
        </div>
      </div>

      <div className="action-buttons">
        <button
          type="button"
          className="preview-btn primary-btn"
          onClick={() => handleDownload('png')}
        >
          <span className="btn-icon">💾</span>
          {t.downloadPng}
        </button>
        <button
          type="button"
          className="preview-btn secondary-btn"
          onClick={() => handleDownload('svg')}
        >
          <span className="btn-icon">📐</span>
          {t.downloadSvg}
        </button>
        <button
          type="button"
          className="preview-btn accent-btn"
          onClick={handleCopy}
        >
          <span className="btn-icon">{copyStatus ? '✓' : '📋'}</span>
          {copyStatus ? t.copied : t.copyClipboard}
        </button>
      </div>
    </div>
  );
}
