'use client';

const CARDS = [
  { key: 'blog',     icon: '📝', label: 'Blog Post',         iconClass: 'blog' },
  { key: 'twitter',  icon: '𝕏',  label: 'Twitter/X Thread',  iconClass: 'twitter' },
  { key: 'linkedin', icon: 'in', label: 'LinkedIn Post',      iconClass: 'linkedin' },
  { key: 'email',    icon: '✉',  label: 'Email Newsletter',   iconClass: 'email' },
  { key: 'quotes',   icon: '❝',  label: 'Quotes & Hooks',     iconClass: 'quotes' },
  { key: 'reels',    icon: '▶',  label: 'TikTok / Reels',     iconClass: 'reels' },
];

export default function OutputGrid({ outputs, label, notionUrl, onCardClick, revealed }) {
  return (
    <div className={`output-section${outputs ? ' visible' : ''}`} id="outputSection">
      <div className="output-header">
        <div className="output-title">{label || 'Generated Content'}</div>
        <div className="output-count">6 pieces ready</div>
      </div>

      <div className="output-grid">
        {CARDS.map(({ key, icon, label: cardLabel, iconClass }, i) => (
          <div
            key={key}
            className={`output-card${revealed[i] ? ' revealed' : ''}`}
            onClick={() => outputs?.[key] && onCardClick(key, outputs[key].content, outputs[key].meta)}
          >
            <div className={`output-icon ${iconClass}`}>{icon}</div>
            <div className="output-info">
              <div className="output-name">{cardLabel}</div>
              <div className="output-meta">
                {outputs?.[key]?.meta || '—'}
              </div>
            </div>
            <div className="output-arrow">→</div>
          </div>
        ))}
      </div>

      <div className="notion-cta">
        <a
          href={notionUrl || '#'}
          className="notion-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          View all in Notion →
        </a>
      </div>
    </div>
  );
}
