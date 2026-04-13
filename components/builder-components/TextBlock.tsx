'use client';

import { useNode } from '@craftjs/core';
import { Link } from 'lucide-react';

interface TextBlockProps {
  content?: string;
  fontSize?: string;
  textAlign?: 'left' | 'center' | 'right';
  href?: string;
  target?: '_self' | '_blank';
}

export const TextBlock = ({
  content = 'Enter your text here...',
  fontSize = '16px',
  textAlign = 'left',
  href = '',
  target = '_self',
}: TextBlockProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  const inner = (
    <div
      ref={(ref: HTMLDivElement | null) => { if (ref) connect(drag(ref)); }}
      style={{ fontSize, textAlign }}
      className="p-4"
    >
      {content}
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className="block no-underline text-inherit"
      >
        {inner}
      </a>
    );
  }

  return inner;
};

export const TextBlockSettings = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({ props: node.data.props }));

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Content</label>
        <textarea
          value={props.content ?? ''}
          onChange={(e) => setProp((p: any) => (p.content = e.target.value))}
          className="w-full px-3 py-2 border rounded text-sm"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Font Size</label>
        <select
          value={props.fontSize ?? '16px'}
          onChange={(e) => setProp((p: any) => (p.fontSize = e.target.value))}
          className="w-full px-3 py-2 border rounded text-sm"
        >
          <option value="12px">Small (12px)</option>
          <option value="16px">Medium (16px)</option>
          <option value="20px">Large (20px)</option>
          <option value="24px">Extra Large (24px)</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Text Align</label>
        <select
          value={props.textAlign ?? 'left'}
          onChange={(e) => setProp((p: any) => (p.textAlign = e.target.value))}
          className="w-full px-3 py-2 border rounded text-sm"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>

      {/* ── LINK SECTION ── */}
      <div className="border-t pt-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Link className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Link / Redirect</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Link URL</label>
          <input
            type="text"
            value={props.href ?? ''}
            onChange={(e) => setProp((p: any) => (p.href = e.target.value))}
            placeholder="https://... or /page-slug"
            className="w-full px-3 py-2 border rounded text-sm font-mono"
          />
          <p className="text-[10px] text-gray-400 mt-1">Wraps the text block in a clickable link.</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Open In</label>
          <select
            value={props.target ?? '_self'}
            onChange={(e) => setProp((p: any) => (p.target = e.target.value))}
            className="w-full px-3 py-2 border rounded text-sm"
          >
            <option value="_self">Same Tab</option>
            <option value="_blank">New Tab</option>
          </select>
        </div>
      </div>
    </div>
  );
};

TextBlock.craft = {
  displayName: 'Text Block',
  props: {
    content: 'Enter your text here...',
    fontSize: '16px',
    textAlign: 'left',
    href: '',
    target: '_self',
  },
  related: {
    toolbar: TextBlockSettings,
  },
};
