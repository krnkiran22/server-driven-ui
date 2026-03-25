'use client';

import React, { useRef, useCallback } from 'react';

interface SafeHTMLRendererProps {
  html: string;
  className?: string;
  fullPage?: boolean;
  style?: React.CSSProperties;
}

export const SafeHTMLRenderer = ({
  html,
  className = '',
  fullPage = false,
  style,
}: SafeHTMLRendererProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Detect if AI returned a full document or just body content
  const isFullDocument =
    html.toLowerCase().includes('<!doctype') ||
    html.toLowerCase().trimStart().startsWith('<html');

  // Build the srcDoc
  const srcDoc = isFullDocument
    ? html
    : `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; padding: 0; min-height: 100vh; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #f1f5f9; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  </style>
</head>
<body class="bg-white">
  ${html}
</body>
</html>`;

  // Auto-resize iframe to fit its content height (for non-fullPage use)
  const handleLoad = useCallback(() => {
    if (!iframeRef.current || fullPage) return;
    try {
      const doc = iframeRef.current.contentDocument;
      if (doc?.body) {
        const h = doc.body.scrollHeight;
        if (h > 0) {
          iframeRef.current.style.height = `${h}px`;
        }
      }
    } catch {
      // cross-origin – ignore
    }
  }, [fullPage]);

  if (fullPage) {
    // In full-page mode we want the iframe to fill whatever container it's in.
    // Use explicit inline style for both width AND height so it is never 0.
    return (
      <iframe
        ref={iframeRef}
        srcDoc={srcDoc}
        title="Full Page Preview"
        sandbox="allow-scripts allow-popups allow-forms allow-same-origin"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',          // fills parent when parent has a real height
          border: 'none',
          ...style,                 // caller can override with explicit px / vh
        }}
        className={className}
      />
    );
  }

  return (
    <iframe
      ref={iframeRef}
      srcDoc={srcDoc}
      title="Safe HTML Renderer"
      sandbox="allow-scripts allow-popups allow-forms allow-same-origin"
      onLoad={handleLoad}
      style={{
        display: 'block',
        width: '100%',
        minHeight: '800px',
        border: 'none',
        ...style,
      }}
      className={className}
    />
  );
};
