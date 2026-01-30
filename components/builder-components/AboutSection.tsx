'use client';

import { useNode } from '@craftjs/core';

interface AboutSectionProps {
  title?: string;
  content?: string;
  imageUrl?: string;
}

export const AboutSection = ({
  title = 'About Us',
  content = 'Our institution has been a beacon of excellence...',
  imageUrl = '',
}: AboutSectionProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      className="py-16 px-4 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-6 text-gray-900">{title}</h2>
          <p className="text-lg text-gray-700 leading-relaxed">{content}</p>
        </div>
        {imageUrl && (
          <div className="rounded-lg overflow-hidden">
            <img src={imageUrl} alt={title} className="w-full h-auto" />
          </div>
        )}
      </div>
    </div>
  );
};

export const AboutSectionSettings = () => {
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
        <label className="block text-sm font-medium mb-2">Content</label>
        <textarea
          value={props.content}
          onChange={(e) => setProp((props: any) => (props.content = e.target.value))}
          className="w-full px-3 py-2 border rounded"
          rows={6}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Image URL</label>
        <input
          type="text"
          value={props.imageUrl}
          onChange={(e) => setProp((props: any) => (props.imageUrl = e.target.value))}
          className="w-full px-3 py-2 border rounded"
        />
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
  },
  related: {
    toolbar: AboutSectionSettings,
  },
};
