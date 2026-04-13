'use client';

import { useNode } from '@craftjs/core';
import { Link } from 'lucide-react';

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
  ctaTarget?: '_self' | '_blank';
}

export const HeroBanner = ({
  title = 'Welcome to Our Institution',
  subtitle = 'Excellence in Education',
  backgroundImage = '',
  ctaText = 'Learn More',
  ctaLink = '#',
  ctaTarget = '_self',
}: HeroBannerProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div
      ref={(ref: HTMLDivElement | null) => { if (ref) connect(drag(ref)); }}
      className="relative h-96 flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-40" />
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-5xl font-bold mb-4">{title}</h1>
        <p className="text-xl mb-6">{subtitle}</p>
        <a
          href={ctaLink}
          target={ctaTarget}
          rel={ctaTarget === '_blank' ? 'noopener noreferrer' : undefined}
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
        >
          {ctaText}
        </a>
      </div>
    </div>
  );
};

export const HeroBannerSettings = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({ props: node.data.props }));

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Title</label>
        <input
          type="text"
          value={props.title ?? ''}
          onChange={(e) => setProp((p: any) => (p.title = e.target.value))}
          className="w-full px-3 py-2 border rounded text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Subtitle</label>
        <input
          type="text"
          value={props.subtitle ?? ''}
          onChange={(e) => setProp((p: any) => (p.subtitle = e.target.value))}
          className="w-full px-3 py-2 border rounded text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Background Image URL</label>
        <input
          type="text"
          value={props.backgroundImage ?? ''}
          onChange={(e) => setProp((p: any) => (p.backgroundImage = e.target.value))}
          className="w-full px-3 py-2 border rounded text-sm font-mono"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">CTA Button Text</label>
        <input
          type="text"
          value={props.ctaText ?? ''}
          onChange={(e) => setProp((p: any) => (p.ctaText = e.target.value))}
          className="w-full px-3 py-2 border rounded text-sm"
        />
      </div>

      {/* ── LINK SECTION ── */}
      <div className="border-t pt-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Link className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">CTA Link / Redirect</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Link URL</label>
          <input
            type="text"
            value={props.ctaLink ?? ''}
            onChange={(e) => setProp((p: any) => (p.ctaLink = e.target.value))}
            className="w-full px-3 py-2 border rounded text-sm font-mono"
            placeholder="https://... or /page-slug"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Open In</label>
          <select
            value={props.ctaTarget ?? '_self'}
            onChange={(e) => setProp((p: any) => (p.ctaTarget = e.target.value))}
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

HeroBanner.craft = {
  displayName: 'Hero Banner',
  props: {
    title: 'Welcome to Our Institution',
    subtitle: 'Excellence in Education',
    backgroundImage: '',
    ctaText: 'Learn More',
    ctaLink: '#',
    ctaTarget: '_self',
  },
  related: {
    toolbar: HeroBannerSettings,
  },
};
