import { useState, useEffect } from 'react';
import { translations } from '../utils/translations';
import { generateVCard } from '../utils/vcard';

export default function QRForm({ lang, initialData, initialType, onDataChange }) {
  const t = translations[lang];

  // Types
  const qrTypes = [
    { id: 'link', label: t.link, icon: '🔗' },
    { id: 'wifi', label: t.wifi, icon: '📶' },
    { id: 'text', label: t.text, icon: '📝' },
    { id: 'vcard', label: t.vcard, icon: '📇' },
  ];

  const [activeType, setActiveType] = useState(initialType || 'link');

  // Form states
  const [url, setUrl] = useState(initialData?.url || '');
  const [text, setText] = useState(initialData?.text || '');
  const [wifi, setWifi] = useState({
    ssid: initialData?.wifiSsid || '',
    password: initialData?.wifiPassword || '',
    security: initialData?.wifiSecurity || 'WPA',
    hidden: initialData?.wifiHidden || false,
  });
  const [vcard, setVcard] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    company: initialData?.company || '',
    jobTitle: initialData?.jobTitle || '',
    website: initialData?.website || '',
    address: initialData?.address || '',
  });

  const [showPassword, setShowPassword] = useState(false);

  // Compute final QR raw string & trigger parent callback
  useEffect(() => {
    let rawText = '';
    let metadata = { type: activeType };

    if (activeType === 'link') {
      rawText = url;
      metadata.url = url;
    } else if (activeType === 'text') {
      rawText = text;
      metadata.text = text;
    } else if (activeType === 'wifi') {
      // WPA format: WIFI:S:MySSID;T:WPA;P:MyPass;H:true;;
      const hiddenStr = wifi.hidden ? 'H:true;' : '';
      const escape = (val) => val.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/:/g, '\\:').replace(/,/g, '\\,');
      rawText = `WIFI:S:${escape(wifi.ssid)};T:${wifi.security};P:${escape(wifi.password)};${hiddenStr};`;
      metadata.wifiSsid = wifi.ssid;
      metadata.wifiPassword = wifi.password;
      metadata.wifiSecurity = wifi.security;
      metadata.wifiHidden = wifi.hidden;
    } else if (activeType === 'vcard') {
      rawText = generateVCard(vcard);
      metadata = { ...metadata, ...vcard };
    }

    onDataChange(rawText, metadata);
  }, [activeType, url, text, wifi, vcard, onDataChange]);


  const handleWifiChange = (key, value) => {
    setWifi((prev) => ({ ...prev, [key]: value }));
  };

  const handleVcardChange = (key, value) => {
    setVcard((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="qr-form-container glass-card">
      <div className="qr-type-tabs">
        {qrTypes.map((type) => (
          <button
            key={type.id}
            className={`qr-type-tab ${activeType === type.id ? 'active' : ''}`}
            onClick={() => setActiveType(type.id)}
          >
            <span className="tab-icon">{type.icon}</span>
            <span className="tab-label">{type.label}</span>
          </button>
        ))}
      </div>

      <div className="qr-form-fields">
        {activeType === 'link' && (
          <div className="form-group animate-fade-in">
            <label htmlFor="url-input" className="form-label">{t.website}</label>
            <div className="input-with-icon">
              <span className="input-icon">🔗</span>
              <input
                id="url-input"
                type="url"
                className="form-input"
                placeholder={t.urlPlaceholder}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </div>
        )}

        {activeType === 'text' && (
          <div className="form-group animate-fade-in">
            <label htmlFor="text-input" className="form-label">{t.text}</label>
            <textarea
              id="text-input"
              className="form-input form-textarea"
              placeholder={t.textPlaceholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows="4"
            />
          </div>
        )}

        {activeType === 'wifi' && (
          <div className="wifi-fields animate-fade-in">
            <div className="form-group">
              <label htmlFor="wifi-ssid" className="form-label">{t.wifiSsid}</label>
              <input
                id="wifi-ssid"
                type="text"
                className="form-input"
                placeholder="e.g. Home_Network"
                value={wifi.ssid}
                onChange={(e) => handleWifiChange('ssid', e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group security-group">
                <label htmlFor="wifi-security" className="form-label">{t.wifiSecurity}</label>
                <select
                  id="wifi-security"
                  className="form-input form-select"
                  value={wifi.security}
                  onChange={(e) => handleWifiChange('security', e.target.value)}
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None (Open)</option>
                </select>
              </div>

              {wifi.security !== 'nopass' && (
                <div className="form-group password-group">
                  <label htmlFor="wifi-password" className="form-label">{t.wifiPassword}</label>
                  <div className="input-with-action">
                    <input
                      id="wifi-password"
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      value={wifi.password}
                      onChange={(e) => handleWifiChange('password', e.target.value)}
                    />
                    <button
                      type="button"
                      className="input-action-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="form-checkbox-group">
              <input
                id="wifi-hidden"
                type="checkbox"
                className="form-checkbox"
                checked={wifi.hidden}
                onChange={(e) => handleWifiChange('hidden', e.target.checked)}
              />
              <label htmlFor="wifi-hidden" className="checkbox-label">
                {t.wifiHidden}
              </label>
            </div>
          </div>
        )}

        {activeType === 'vcard' && (
          <div className="vcard-fields animate-fade-in">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="vc-first" className="form-label">{t.firstName}</label>
                <input
                  id="vc-first"
                  type="text"
                  className="form-input"
                  value={vcard.firstName}
                  onChange={(e) => handleVcardChange('firstName', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="vc-last" className="form-label">{t.lastName}</label>
                <input
                  id="vc-last"
                  type="text"
                  className="form-input"
                  value={vcard.lastName}
                  onChange={(e) => handleVcardChange('lastName', e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="vc-phone" className="form-label">{t.phone}</label>
                <input
                  id="vc-phone"
                  type="tel"
                  className="form-input"
                  placeholder="+1 (555) 000-0000"
                  value={vcard.phone}
                  onChange={(e) => handleVcardChange('phone', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="vc-email" className="form-label">{t.email}</label>
                <input
                  id="vc-email"
                  type="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={vcard.email}
                  onChange={(e) => handleVcardChange('email', e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="vc-company" className="form-label">{t.company}</label>
                <input
                  id="vc-company"
                  type="text"
                  className="form-input"
                  value={vcard.company}
                  onChange={(e) => handleVcardChange('company', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="vc-job" className="form-label">{t.jobTitle}</label>
                <input
                  id="vc-job"
                  type="text"
                  className="form-input"
                  value={vcard.jobTitle}
                  onChange={(e) => handleVcardChange('jobTitle', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="vc-web" className="form-label">{t.website}</label>
              <input
                id="vc-web"
                type="url"
                className="form-input"
                placeholder="https://example.com"
                value={vcard.website}
                onChange={(e) => handleVcardChange('website', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="vc-addr" className="form-label">{t.address}</label>
              <input
                id="vc-addr"
                type="text"
                className="form-input"
                value={vcard.address}
                onChange={(e) => handleVcardChange('address', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
