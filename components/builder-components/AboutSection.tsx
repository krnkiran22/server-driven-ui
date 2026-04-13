'use client';

import { useNode } from '@craftjs/core';
import { Link } from 'lucide-react';

interface AboutSectionProps {
  title?: string;
  content?: string;
  imageUrl?: string;
  imageLink?: string;
  imageLinkTarget?: '_self' | '_blank';
  ctaText?: string;
  ctaLink?: string;
  ctaTarget?: '_self' | '_blank';
}

export const AboutSection = ({
  title = 'About Us',
  content = 'Our institution has been a beacon of excellence...',
  imageUrl = '',
  imageLink = '',
  imageLinkTarget = '_self',
  ctaText = '',
  ctaLink = '',
  ctaTarget = '_self',
}: AboutSectionProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  const imageEl = imageUrl ? (
    <div className="rounded-lg overflow-hidden">
      <img src={imageUrl} alt={title} className="w-full h-auto" />
    </div>
  ) : null;

  return (
    <div
      ref={(ref: HTMLDivElement | null) => { if (ref) connect(drag(ref)); }}
      className="py-16 px-4 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-6 text-gray-900">{title}</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">{content}</p>
          {ctaText && ctaLink && (
            <a
              href={ctaLink}
              target={ctaTarget}
              rel={ctaTarget === '_blank' ? 'noopener noreferrer' : undefined}
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              {ctaText}
            </a>
          )}
        </div>
        {imageEl && (
          imageLink ? (
            <a
              href={imageLink}
              target={imageLinkTarget}
              rel={imageLinkTarget === '_blank' ? 'noopener noreferrer' : undefined}
            >
              {imageEl}
            </a>
          ) : imageEl
        )}
      </div>
    </div>
  );
};

export const AboutSectionSettings = () => {
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
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Content</label>
        <textarea
          value={props.content ?? ''}
          onChange={(e) => setProp((p: any) => (p.content = e.target.value))}
          className="w-full px-3 py-2 border rounded text-sm"
          rows={5}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Image URL</label>
        <input
          type="text"
          value={props.imageUrl ?? ''}
          onChange={(e) => setProp((p: any) => (p.imageUrl = e.target.value))}
          className="w-full px-3 py-2 border rounded text-sm font-mono"
          placeholder="https://..."
        />
      </div>

      {/* ── IMAGE LINK ── */}
      <div className="border-t pt-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Link className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Image Link</span>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Image Link URL</label>
          <input
            type="text"
            value={props.imageLink ?? ''}
            onChange={(e) => setProp((p: any) => (p.imageLink = e.target.value))}
            className="w-full px-3 py-2 border rounded text-sm font-mono"
            placeholder="https://... or /page-slug"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Open In</label>
          <select
            value={props.imageLinkTarget ?? '_self'}
            onChange={(e) => setProp((p: any) => (p.imageLinkTarget = e.target.value))}
            className="w-full px-3 py-2 border rounded text-sm"
          >
            <option value="_self">Same Tab</option>
            <option value="_blank">New Tab</option>
          </select>
        </div>
      </div>

      {/* ── CTA BUTTON ── */}
      <div className="border-t pt-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Link className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">CTA Button</span>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Button Text</label>
          <input
            type="text"
            value={props.ctaText ?? ''}
            onChange={(e) => setProp((p: any) => (p.ctaText = e.target.value))}
            className="w-full px-3 py-2 border rounded text-sm"
            placeholder="e.g. Learn More (leave empty to hide)"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Button Link URL</label>
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

AboutSection.craft = {
  displayName: 'About Section',
  props: {
    title: 'About Us',
    content: 'Our institution has been a beacon of excellence...',
    imageUrl: '',
    imageLink: '',
    imageLinkTarget: '_self',
    ctaText: '',
    ctaLink: '',
    ctaTarget: '_self',
  },
  related: {
    toolbar: AboutSectionSettings,
  },
};
