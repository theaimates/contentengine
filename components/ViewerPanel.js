'use client';

import { useState, useEffect, useRef } from 'react';

const LABELS = {
  blog:     '📝 Blog Post',
  twitter:  '𝕏 Twitter/X Thread',
  linkedin: 'in LinkedIn Post',
  email:    '✉ Email Newsletter',
  quotes:   '❝ Quotes & Hooks',
  reels:    '🎬 TikTok / Reels',
};

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderMarkdown(text) {
  return text.split('\n').map(line => {
    if (line.startsWith('## ')) {
      return '<span class="md-h2">' + escapeHtml(line.slice(3)) + '</span>';
    }
    return escapeHtml(line);
  }).join('<br>');
}

function renderThread(content) {
  const tweets = (/\n\n\d+\//.test(content)
    ? content.split(/\n\n(?=\d+\/)/)
    : content.split(/\n\n+/)
  ).filter(t => t.trim());
  const total = tweets.length;

  const engagements = tweets.map((_, i) => ({
    replies:  3  + ((i * 7  + 11) % 19),
    retweets: 8  + ((i * 13 + 5)  % 47),
    likes:    31 + ((i * 17 + 3)  % 89),
  }));

  return tweets.map((tweet, i) => {
    const e = engagements[i];
    const isLast = i === total - 1;
    const escaped = escapeHtml(tweet).replace(/\n/g, '<br>');
    return `<div class="tweet-card${isLast ? ' tweet-card--last' : ''}">
  <div class="tweet-left">
    <div class="tweet-avatar">CE</div>
    <div class="tweet-connector"></div>
  </div>
  <div class="tweet-right">
    <div class="tweet-user-row">
      <span class="tweet-name">Content Engine</span>
      <span class="tweet-handle">@contentengine</span>
      <span class="tweet-counter">${i + 1}/${total}</span>
    </div>
    <div class="tweet-text">${escaped}</div>
    <div class="tweet-actions">
      <span class="tweet-action tweet-action--reply">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        ${e.replies}
      </span>
      <span class="tweet-action tweet-action--retweet">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
        ${e.retweets}
      </span>
      <span class="tweet-action tweet-action--like">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        ${e.likes}
      </span>
    </div>
  </div>
</div>`;
  }).join('');
}

export default function ViewerPanel({ open: isOpen, type, content, meta, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [copyLabel, setCopyLabel] = useState('Copy');
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = useRef(null);

  // Animate open — trigger CSS transition on next tick
  useEffect(() => {
    if (isOpen) {
      setIsVisible(false);
      setTimeout(() => setIsVisible(true), 0);
      setIsEditing(false);
      setEditedContent(content || '');
      setCopyLabel('Copy');
    } else {
      setIsVisible(false);
    }
  }, [isOpen, content]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ESC key
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape' && isOpen) onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Render content HTML
  useEffect(() => {
    if (!contentRef.current || isEditing) return;
    if (type === 'twitter') {
      contentRef.current.classList.add('viewer-content--thread');
      contentRef.current.innerHTML = renderThread(editedContent);
    } else {
      contentRef.current.classList.remove('viewer-content--thread');
      contentRef.current.innerHTML = renderMarkdown(editedContent);
    }
    contentRef.current.scrollTop = 0;
  }, [isOpen, isEditing, editedContent, type]);

  function handleCopy() {
    const text = editedContent;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(succeed).catch(fallback);
    } else {
      fallback();
    }
    function succeed() {
      setCopyLabel('Copied!');
      setTimeout(() => setCopyLabel('Copy'), 2000);
    }
    function fallback() {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      try { document.execCommand('copy'); succeed(); } catch {}
      document.body.removeChild(ta);
    }
  }

  function toggleEdit() {
    if (isEditing) {
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }

  if (!isOpen && !isVisible) return null;

  return (
    <div
      className="viewer-panel"
      style={{ display: 'block' }}
      aria-hidden={!isOpen}
    >
      <div className="viewer-overlay" onClick={onClose} />
      <div className={`viewer-drawer${isVisible ? ' open' : ''}`} style={{ transform: isVisible ? 'translateX(0)' : 'translateX(100%)' }}>
        <div className="viewer-header">
          <div className={`viewer-type-badge viewer-badge-${type}`}>
            {LABELS[type] || type}
          </div>
          <div className="viewer-actions">
            <button className="viewer-edit-btn" onClick={toggleEdit}>
              {isEditing ? 'Done' : 'Edit'}
            </button>
            <button
              className={`viewer-copy-btn${copyLabel === 'Copied!' ? ' copied' : ''}`}
              onClick={handleCopy}
            >
              {copyLabel}
            </button>
            <button className="viewer-close-btn" aria-label="Close" onClick={onClose}>✕</button>
          </div>
        </div>
        <div className="viewer-meta">{meta || ''}</div>
        <div className="viewer-content" ref={contentRef}>
          {isEditing && (
            <textarea
              className="viewer-edit-textarea"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              autoFocus
            />
          )}
        </div>
      </div>
    </div>
  );
}
