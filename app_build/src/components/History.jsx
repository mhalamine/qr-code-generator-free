import { translations } from '../utils/translations';
import { PRESETS } from '../utils/presets';

export default function History({ lang, historyList, onLoadHistory, onClearHistory, onApplyPreset }) {
  const t = translations[lang];

  const presetsList = [
    { id: 'neonCyan', name: t.presetNeonCyan, colors: ['#00ffff', '#8a2be2'], bg: '#0b0d19' },
    { id: 'midnightViolet', name: t.presetMidnightViolet, colors: ['#8a2be2', '#da70d6'], bg: '#07050d' },
    { id: 'sunsetGlow', name: t.presetSunsetOrange, colors: ['#ff3d00', '#ffea00'], bg: '#0f0500' },
    { id: 'forestEmerald', name: t.presetForestEmerald, colors: ['#00e676', '#00b0ff'], bg: '#02120b' },
    { id: 'monochrome', name: t.presetMonochrome, colors: ['#000000', '#000000'], bg: '#ffffff' },
  ];

  const formatDate = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  const getTruncatedContent = (item) => {
    if (item.type === 'link') return item.url;
    if (item.type === 'text') return item.text;
    if (item.type === 'wifi') return `SSID: ${item.wifiSsid}`;
    if (item.type === 'vcard') return `${item.firstName || ''} ${item.lastName || ''}`;
    return '';
  };

  const getTypeIcon = (type) => {
    if (type === 'link') return '🔗';
    if (type === 'wifi') return '📶';
    if (type === 'text') return '📝';
    if (type === 'vcard') return '📇';
    return '🌀';
  };

  return (
    <div className="history-container glass-card">
      {/* Preset Section */}
      <div className="presets-section">
        <h3 className="panel-title">{t.presetTitle}</h3>
        <div className="presets-grid">
          {presetsList.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="preset-card"
              onClick={() => onApplyPreset(PRESETS[preset.id])}
              style={{ backgroundColor: preset.bg }}
            >
              <div className="preset-preview-color-dots">
                <span style={{ background: preset.colors[0] }} />
                {preset.colors[0] !== preset.colors[1] && <span style={{ background: preset.colors[1] }} />}
              </div>
              <span className="preset-name" style={{ color: preset.bg === '#ffffff' ? '#0b0d19' : '#ffffff' }}>
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <hr className="divider" />

      {/* History List Section */}
      <div className="history-list-section">
        <div className="history-header">
          <h3 className="panel-title">{t.historyTitle}</h3>
          {historyList.length > 0 && (
            <button type="button" className="clear-history-btn" onClick={onClearHistory}>
              {t.clearHistory}
            </button>
          )}
        </div>

        {historyList.length === 0 ? (
          <p className="no-history-text">{t.noHistory}</p>
        ) : (
          <div className="history-list scrollbar-custom">
            {historyList.map((item) => (
              <div key={item.id} className="history-item glass-card-nested">
                <div className="history-item-info">
                  <div className="history-item-top">
                    <span className="history-type-badge">
                      {getTypeIcon(item.type)} {t[item.type]}
                    </span>
                    <span className="history-date">{formatDate(item.timestamp)}</span>
                  </div>
                  <div className="history-content-preview">
                    {getTruncatedContent(item)}
                  </div>
                </div>
                <button
                  type="button"
                  className="load-history-btn"
                  onClick={() => onLoadHistory(item)}
                >
                  {t.loadHistory}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

