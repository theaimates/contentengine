'use client';

import { useState, useEffect } from 'react';
import { getWebhookUrl, setWebhookUrl } from '../lib/config';

export default function SetupBanner({ visible, onDismiss, onSaved }) {
  const [inputVal, setInputVal] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (visible) {
      setInputVal(getWebhookUrl());
      setError(false);
      setSuccess(false);
    }
  }, [visible]);

  function handleSave() {
    const url = inputVal.trim();
    if (!url.startsWith('http')) {
      setError(true);
      return;
    }
    setError(false);
    setWebhookUrl(url);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 1500);
    onSaved();
    onDismiss();
  }

  if (!visible) return null;

  return (
    <div className="setup-banner" style={{ display: 'block' }}>
      <div className="setup-banner-inner">
        <span className="setup-icon">⚙</span>
        <div className="setup-text">
          <strong>Webhook not configured.</strong>{' '}
          Paste your n8n production webhook URL to activate the engine.
        </div>
        <input
          type="url"
          className="webhook-input"
          placeholder="https://your-n8n.com/webhook/content-engine"
          autoComplete="off"
          spellCheck="false"
          value={inputVal}
          onChange={(e) => { setInputVal(e.target.value); setError(false); }}
          style={error ? { borderColor: '#ef4444' } : success ? { borderColor: 'var(--success)' } : {}}
        />
        <button className="save-webhook-btn" onClick={handleSave}>Save</button>
        <button className="dismiss-btn" onClick={onDismiss}>✕</button>
      </div>
    </div>
  );
}
