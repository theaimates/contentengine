'use client';

import { useState, useEffect, useCallback } from 'react';
import SetupBanner from '../components/SetupBanner';
import ProcessingBar from '../components/ProcessingBar';
import OutputGrid from '../components/OutputGrid';
import ViewerPanel from '../components/ViewerPanel';
import FooterStatus from '../components/FooterStatus';
import { isConfigured } from '../lib/config';
import { DEMO_DATA } from '../lib/demo-data';

const SESSION_KEY = 'ce_last_output';

function isValidYouTubeUrl(url) {
  return /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)/.test(url);
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState(false);
  const [tone, setTone] = useState('default');

  const [processingState, setProcessingState] = useState('idle'); // idle | running | done
  const [submitting, setSubmitting] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const [outputs, setOutputs] = useState(null);
  const [outputLabel, setOutputLabel] = useState('Generated Content');
  const [notionUrl, setNotionUrl] = useState(null);
  const [revealed, setRevealed] = useState(Array(6).fill(false));

  const [errorMsg, setErrorMsg] = useState(null);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [footerRefreshKey, setFooterRefreshKey] = useState(0);

  // Viewer state
  const [viewer, setViewer] = useState({ open: false, type: '', content: '', meta: '' });

  // Restore last session on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (!saved) return;
      const data = JSON.parse(saved);
      showOutputs(data, 'Generated Content · last session', false);
    } catch {}

    if (!isConfigured()) setBannerVisible(true);
  }, []);

  function showOutputs(data, label, persist = true) {
    setOutputs(data);
    setOutputLabel(label || 'Generated Content');
    setNotionUrl(data.notionUrl || null);
    setRevealed(Array(6).fill(false));
    if (persist) {
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(data)); } catch {}
    }
    // Stagger card reveal
    Array(6).fill(null).forEach((_, i) => {
      setTimeout(() => {
        setRevealed(prev => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, i * 100);
    });
  }

  function clearOutputs() {
    setOutputs(null);
    setRevealed(Array(6).fill(false));
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}
  }

  function showError(msg) {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 6000);
  }

  async function handleSubmit() {
    const trimmed = url.trim();
    if (!trimmed) { setUrlError(true); return; }
    if (!isValidYouTubeUrl(trimmed)) { setUrlError(true); return; }
    if (!isConfigured()) { setBannerVisible(true); return; }

    clearOutputs();
    setErrorMsg(null);
    setUrlError(false);
    setSubmitting(true);
    setProcessingState('running');

    try {
      const res = await fetch('/api/repurpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed, tone }),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok || body.success === false) {
        const code = body.errorCode || ('HTTP_' + res.status);
        if (code === 'TRANSCRIPT_TOO_SHORT') {
          showError(body.message || 'Captions are disabled or unavailable for this video.');
        } else if (res.status === 0) {
          showError('Could not reach the server. Check your connection.');
          setBannerVisible(true);
        } else {
          showError(body.message || 'Something went wrong. Check the browser console for details.');
        }
        setProcessingState('idle');
        setSubmitting(false);
        return;
      }

      setProcessingState('done');
      setTimeout(() => {
        setSubmitting(false);
        showOutputs(body, 'Generated Content');
        setTimeout(() => setProcessingState('idle'), 1000);
      }, 500);

    } catch {
      setProcessingState('idle');
      setSubmitting(false);
      showError('Could not reach the server. Check your connection.');
      setBannerVisible(true);
    }
  }

  function loadDemo() {
    clearOutputs();
    setErrorMsg(null);
    setDemoLoading(true);
    setSubmitting(true);
    setProcessingState('running');

    setTimeout(() => {
      setProcessingState('done');
      setTimeout(() => {
        setDemoLoading(false);
        setSubmitting(false);
        showOutputs(DEMO_DATA, 'Generated Content · demo', false);
        setTimeout(() => setProcessingState('idle'), 1000);
      }, 400);
    }, 1200);
  }

  const openViewer = useCallback((type, content, meta) => {
    setViewer({ open: true, type, content, meta });
  }, []);

  const closeViewer = useCallback(() => {
    setViewer(v => ({ ...v, open: false }));
  }, []);

  function handleBannerSaved() {
    setFooterRefreshKey(k => k + 1);
  }

  return (
    <>
      <div className="container">
        <SetupBanner
          visible={bannerVisible}
          onDismiss={() => setBannerVisible(false)}
          onSaved={handleBannerSaved}
        />

        <div className="header">
          <div className="badge">
            <div className="badge-dot" />
            Content Engine v1.1
          </div>
          <h1>One URL.<br /><span>Six content pieces.</span></h1>
          <p className="subtitle">
            Paste a YouTube link and get a blog post, Twitter thread, LinkedIn post, email newsletter,
            key quotes, and TikTok/Reels content — in under 60 seconds.
          </p>
        </div>

        <div className="input-section">
          <div className="input-label">YouTube URL</div>
          <div className="input-wrapper">
            <input
              type="text"
              className="url-input"
              placeholder="https://youtube.com/watch?v=..."
              autoComplete="off"
              spellCheck="false"
              value={url}
              disabled={submitting}
              style={urlError ? { borderColor: '#ef4444' } : {}}
              onChange={(e) => {
                setUrl(e.target.value);
                if (urlError) setUrlError(false);
              }}
              onInput={(e) => {
                const val = e.target.value.trim();
                if (val && !isValidYouTubeUrl(val)) setUrlError(true);
                else setUrlError(false);
              }}
              onKeyDown={(e) => { if (e.key === 'Enter' && !submitting) handleSubmit(); }}
            />
            <button
              className={`submit-btn${submitting ? ' loading' : ''}`}
              disabled={submitting}
              onClick={handleSubmit}
            >
              <span className="btn-text">Repurpose →</span>
              <div className="spinner"><div className="spinner-ring" /></div>
            </button>
            <button
              className="demo-btn"
              disabled={submitting}
              onClick={loadDemo}
            >
              {demoLoading ? 'Loading...' : 'Try Demo'}
            </button>
          </div>
          <div className="input-hint">Supports YouTube videos with captions. Podcast support coming soon.</div>

          <div className="tone-selector">
            <span className="tone-label">Tone</span>
            <div className="tone-options">
              {['default', 'professional', 'casual', 'bold'].map((t) => (
                <label key={t} className="tone-option">
                  <input
                    type="radio"
                    name="tone"
                    value={t}
                    checked={tone === t}
                    onChange={() => setTone(t)}
                  />
                  <span>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          <ProcessingBar state={processingState} />
        </div>

        {errorMsg && (
          <div className="error-message">{errorMsg}</div>
        )}

        {outputs && (
          <OutputGrid
            outputs={outputs}
            label={outputLabel}
            notionUrl={notionUrl}
            onCardClick={openViewer}
            revealed={revealed}
          />
        )}
      </div>

      <div className="footer">
        Built by <a href="https://theaimates.com" target="_blank" rel="noopener noreferrer">AImates</a>
        <br />
        <FooterStatus
          onOpenBanner={() => setBannerVisible(true)}
          refreshKey={footerRefreshKey}
        />
      </div>

      <ViewerPanel
        open={viewer.open}
        type={viewer.type}
        content={viewer.content}
        meta={viewer.meta}
        onClose={closeViewer}
      />
    </>
  );
}
