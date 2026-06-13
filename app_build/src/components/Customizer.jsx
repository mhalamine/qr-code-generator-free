import { translations } from '../utils/translations';


export default function Customizer({ lang, config, updateConfig, onLogoChange, onLogoRemove }) {
  const t = translations[lang];

  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/png');
        onLogoChange(compressedBase64);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleNestedChange = (section, key, value) => {
    updateConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleColorTypeChange = (section, isGradient) => {
    updateConfig((prev) => {
      const current = prev[section] || {};
      if (isGradient) {
        return {
          ...prev,
          [section]: {
            ...current,
            color: undefined,
            gradient: current.gradient || {
              type: 'linear',
              rotation: 0,
              colorStops: [
                { offset: 0, color: section === 'dotsOptions' ? '#8a2be2' : '#ffffff' },
                { offset: 1, color: section === 'dotsOptions' ? '#00ffff' : '#f0f0f0' },
              ],
            },
          },
        };
      } else {
        return {
          ...prev,
          [section]: {
            ...current,
            gradient: null,
            color: current.color || (section === 'dotsOptions' ? '#0b0d19' : '#ffffff'),
          },
        };
      }
    });
  };

  const handleGradientStopChange = (section, index, colorValue) => {
    updateConfig((prev) => {
      const current = prev[section] || {};
      const gradient = current.gradient || { type: 'linear', rotation: 0, colorStops: [{ offset: 0, color: '' }, { offset: 1, color: '' }] };
      const nextStops = [...gradient.colorStops];
      nextStops[index] = { ...nextStops[index], color: colorValue };
      return {
        ...prev,
        [section]: {
          ...current,
          gradient: {
            ...gradient,
            colorStops: nextStops,
          },
        },
      };
    });
  };

  const handleGradientPropChange = (section, prop, value) => {
    updateConfig((prev) => {
      const current = prev[section] || {};
      const gradient = current.gradient || { type: 'linear', rotation: 0, colorStops: [{ offset: 0, color: '' }, { offset: 1, color: '' }] };
      return {
        ...prev,
        [section]: {
          ...current,
          gradient: {
            ...gradient,
            [prop]: value,
          },
        },
      };
    });
  };

  const shapeOptions = [
    { value: 'square', label: t.shapeSquare },
    { value: 'dots', label: t.shapeDots },
    { value: 'rounded', label: t.shapeRounded },
    { value: 'extra-rounded', label: t.shapeExtraRounded },
    { value: 'classy', label: t.shapeClassy },
    { value: 'classy-rounded', label: t.shapeClassyRounded },
  ];

  const cornersFrameOptions = [
    { value: 'square', label: t.shapeSquare },
    { value: 'dot', label: t.shapeDots },
    { value: 'rounded', label: t.shapeRounded },
  ];

  const cornersEyeOptions = [
    { value: 'square', label: t.shapeSquare },
    { value: 'dot', label: t.shapeDots },
  ];

  const isFgGradient = !!config.dotsOptions?.gradient;
  const isBgGradient = !!config.backgroundOptions?.gradient;

  return (
    <div className="customizer-container glass-card">
      <h3 className="panel-title">{t.designSettings}</h3>

      {/* Colors Section */}
      <div className="customizer-section">
        <h4 className="section-title">🎨 {t.colorSection}</h4>
        
        {/* Foreground (Dots) Configuration */}
        <div className="sub-section">
          <h5>{t.foregroundColor}</h5>
          <div className="toggle-group">
            <button
              type="button"
              className={`toggle-btn ${!isFgGradient ? 'active' : ''}`}
              onClick={() => handleColorTypeChange('dotsOptions', false)}
            >
              {t.solid}
            </button>
            <button
              type="button"
              className={`toggle-btn ${isFgGradient ? 'active' : ''}`}
              onClick={() => handleColorTypeChange('dotsOptions', true)}
            >
              {t.gradient}
            </button>
          </div>

          {!isFgGradient ? (
            <div className="picker-group">
              <label>{t.foregroundColor}</label>
              <div className="color-picker-wrapper">
                <input
                  type="color"
                  value={config.dotsOptions?.color || '#000000'}
                  onChange={(e) => handleNestedChange('dotsOptions', 'color', e.target.value)}
                />
                <span className="hex-value">{config.dotsOptions?.color || '#000000'}</span>
              </div>
            </div>
          ) : (
            <div className="gradient-fields animate-fade-in">
              <div className="form-row">
                <div className="picker-group">
                  <label>{t.colorStart}</label>
                  <div className="color-picker-wrapper">
                    <input
                      type="color"
                      value={config.dotsOptions?.gradient?.colorStops[0]?.color || '#8a2be2'}
                      onChange={(e) => handleGradientStopChange('dotsOptions', 0, e.target.value)}
                    />
                    <span className="hex-value">{config.dotsOptions?.gradient?.colorStops[0]?.color || '#8a2be2'}</span>
                  </div>
                </div>
                <div className="picker-group">
                  <label>{t.colorEnd}</label>
                  <div className="color-picker-wrapper">
                    <input
                      type="color"
                      value={config.dotsOptions?.gradient?.colorStops[1]?.color || '#00ffff'}
                      onChange={(e) => handleGradientStopChange('dotsOptions', 1, e.target.value)}
                    />
                    <span className="hex-value">{config.dotsOptions?.gradient?.colorStops[1]?.color || '#00ffff'}</span>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>{t.gradientType}</label>
                  <select
                    className="form-input form-select"
                    value={config.dotsOptions?.gradient?.type || 'linear'}
                    onChange={(e) => handleGradientPropChange('dotsOptions', 'type', e.target.value)}
                  >
                    <option value="linear">{t.linear}</option>
                    <option value="radial">{t.radial}</option>
                  </select>
                </div>

                {config.dotsOptions?.gradient?.type === 'linear' && (
                  <div className="form-group flex-1">
                    <label>{t.gradientAngle}</label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      className="form-range"
                      value={config.dotsOptions?.gradient?.rotation || 0}
                      onChange={(e) => handleGradientPropChange('dotsOptions', 'rotation', parseFloat(e.target.value))}
                    />
                    <span className="slider-value">{config.dotsOptions?.gradient?.rotation || 0}°</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Background Configuration */}
        <div className="sub-section">
          <h5>{t.backgroundColor}</h5>
          <div className="toggle-group">
            <button
              type="button"
              className={`toggle-btn ${!isBgGradient ? 'active' : ''}`}
              onClick={() => handleColorTypeChange('backgroundOptions', false)}
            >
              {t.solid}
            </button>
            <button
              type="button"
              className={`toggle-btn ${isBgGradient ? 'active' : ''}`}
              onClick={() => handleColorTypeChange('backgroundOptions', true)}
            >
              {t.gradient}
            </button>
          </div>

          {!isBgGradient ? (
            <div className="picker-group">
              <label>{t.backgroundColor}</label>
              <div className="color-picker-wrapper">
                <input
                  type="color"
                  value={config.backgroundOptions?.color || '#ffffff'}
                  onChange={(e) => handleNestedChange('backgroundOptions', 'color', e.target.value)}
                />
                <span className="hex-value">{config.backgroundOptions?.color || '#ffffff'}</span>
              </div>
            </div>
          ) : (
            <div className="gradient-fields animate-fade-in">
              <div className="form-row">
                <div className="picker-group">
                  <label>{t.colorStart}</label>
                  <div className="color-picker-wrapper">
                    <input
                      type="color"
                      value={config.backgroundOptions?.gradient?.colorStops[0]?.color || '#ffffff'}
                      onChange={(e) => handleGradientStopChange('backgroundOptions', 0, e.target.value)}
                    />
                    <span className="hex-value">{config.backgroundOptions?.gradient?.colorStops[0]?.color || '#ffffff'}</span>
                  </div>
                </div>
                <div className="picker-group">
                  <label>{t.colorEnd}</label>
                  <div className="color-picker-wrapper">
                    <input
                      type="color"
                      value={config.backgroundOptions?.gradient?.colorStops[1]?.color || '#f0f0f0'}
                      onChange={(e) => handleGradientStopChange('backgroundOptions', 1, e.target.value)}
                    />
                    <span className="hex-value">{config.backgroundOptions?.gradient?.colorStops[1]?.color || '#f0f0f0'}</span>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>{t.gradientType}</label>
                  <select
                    className="form-input form-select"
                    value={config.backgroundOptions?.gradient?.type || 'linear'}
                    onChange={(e) => handleGradientPropChange('backgroundOptions', 'type', e.target.value)}
                  >
                    <option value="linear">{t.linear}</option>
                    <option value="radial">{t.radial}</option>
                  </select>
                </div>

                {config.backgroundOptions?.gradient?.type === 'linear' && (
                  <div className="form-group flex-1">
                    <label>{t.gradientAngle}</label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      className="form-range"
                      value={config.backgroundOptions?.gradient?.rotation || 0}
                      onChange={(e) => handleGradientPropChange('backgroundOptions', 'rotation', parseFloat(e.target.value))}
                    />
                    <span className="slider-value">{config.backgroundOptions?.gradient?.rotation || 0}°</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Shapes Section */}
      <div className="customizer-section">
        <h4 className="section-title">📐 {t.shapesSection}</h4>

        <div className="form-group">
          <label htmlFor="dots-shape-select">{t.modulesShape}</label>
          <select
            id="dots-shape-select"
            className="form-input form-select"
            value={config.dotsOptions?.type || 'square'}
            onChange={(e) => handleNestedChange('dotsOptions', 'type', e.target.value)}
          >
            {shapeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label htmlFor="finder-frame-select">{t.finderOuterShape}</label>
            <select
              id="finder-frame-select"
              className="form-input form-select"
              value={config.cornersSquareOptions?.type || 'square'}
              onChange={(e) => handleNestedChange('cornersSquareOptions', 'type', e.target.value)}
            >
              {cornersFrameOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group flex-1">
            <label htmlFor="finder-eye-select">{t.finderInnerShape}</label>
            <select
              id="finder-eye-select"
              className="form-input form-select"
              value={config.cornersDotOptions?.type || 'square'}
              onChange={(e) => handleNestedChange('cornersDotOptions', 'type', e.target.value)}
            >
              {cornersEyeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Logo Overlay Section */}
      <div className="customizer-section">
        <h4 className="section-title">🖼️ {t.logoSection}</h4>
        
        <div className="file-upload-wrapper">
          <input
            id="logo-file-input"
            type="file"
            accept="image/*"
            className="file-input-hidden"
            onChange={handleLogoFileChange}
          />
          <label htmlFor="logo-file-input" className="file-upload-label">
            <span className="upload-icon">📤</span>
            <span className="upload-text">{t.uploadLogo}</span>
          </label>
        </div>

        {config.image && (
          <div className="logo-controls animate-fade-in">
            <div className="logo-preview-badge">
              <img src={config.image} alt="Logo Preview" />
              <button type="button" className="remove-logo-btn" onClick={onLogoRemove} aria-label={t.clearLogo}>
                ✕
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="logo-size-range">{t.logoSize}</label>
              <input
                id="logo-size-range"
                type="range"
                min="0.1"
                max="0.3"
                step="0.02"
                className="form-range"
                value={config.imageOptions?.imageSize || 0.2}
                onChange={(e) => handleNestedChange('imageOptions', 'imageSize', parseFloat(e.target.value))}
              />
              <span className="slider-value">{Math.round((config.imageOptions?.imageSize || 0.2) * 100)}%</span>
            </div>

            <div className="form-group">
              <label htmlFor="logo-margin-range">{t.logoMargin}</label>
              <input
                id="logo-margin-range"
                type="range"
                min="0"
                max="12"
                step="1"
                className="form-range"
                value={config.imageOptions?.margin || 4}
                onChange={(e) => handleNestedChange('imageOptions', 'margin', parseInt(e.target.value, 10))}
              />
              <span className="slider-value">{config.imageOptions?.margin || 4}px</span>
            </div>
          </div>
        )}

        <p className="help-text">{t.logoHelpText}</p>
      </div>
    </div>
  );
}
