'use client';

import { useNode } from '@craftjs/core';

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
}

export const HeroBanner = ({
  title = 'Welcome to Our Institution',
  subtitle = 'Excellence in Education',
  backgroundImage = '',
  ctaText = 'Learn More',
  ctaLink = '#',
}: HeroBannerProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div
      ref={(ref: HTMLDivElement | null) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      className="relative h-96 flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-5xl font-bold mb-4">{title}</h1>
        <p className="text-xl mb-6">{subtitle}</p>
        <a
          href={ctaLink}
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
  } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          value={props.title}
          onChange={(e) => setProp((props: any) => (props.title = e.target.value))}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Subtitle</label>
        <input
          type="text"
          value={props.subtitle}
          onChange={(e) => setProp((props: any) => (props.subtitle = e.target.value))}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Background Image URL</label>
        <input
          type="text"
          value={props.backgroundImage}
          onChange={(e) => setProp((props: any) => (props.backgroundImage = e.target.value))}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">CTA Text</label>
        <input
          type="text"
          value={props.ctaText}
          onChange={(e) => setProp((props: any) => (props.ctaText = e.target.value))}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">CTA Link</label>
        <input
          type="text"
          value={props.ctaLink}
          onChange={(e) => setProp((props: any) => (props.ctaLink = e.target.value))}
          className="w-full px-3 py-2 border rounded"
        />
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
  },
  related: {
    toolbar: HeroBannerSettings,
  },
};
