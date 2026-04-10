'use client';

import { isConfigured } from '../lib/config';
import { useEffect, useState } from 'react';

export default function FooterStatus({ onOpenBanner, refreshKey }) {
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    setConfigured(isConfigured());
  }, [refreshKey]);

  return (
    <button className="footer-webhook-status" onClick={onOpenBanner}>
      <span
        className="footer-status-dot"
        style={{ background: configured ? 'var(--success)' : '#ef4444' }}
      />
      <span>
        {configured ? 'Webhook: configured' : 'Webhook: not set — click to configure'}
      </span>
    </button>
  );
}
