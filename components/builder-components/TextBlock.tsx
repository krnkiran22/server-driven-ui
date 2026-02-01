'use client';

import { useNode } from '@craftjs/core';

interface TextBlockProps {
  content?: string;
  fontSize?: string;
  textAlign?: 'left' | 'center' | 'right';
}

export const TextBlock = ({
  content = 'Enter your text here...',
  fontSize = '16px',
  textAlign = 'left',
}: TextBlockProps) => {
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
      style={{ fontSize, textAlign }}
      className="p-4"
    >
      {content}
    </div>
  );
};

export const TextBlockSettings = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Content</label>
        <textarea
          value={props.content}
          onChange={(e) => setProp((props: any) => (props.content = e.target.value))}
          className="w-full px-3 py-2 border rounded"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Font Size</label>
        <select
          value={props.fontSize}
          onChange={(e) => setProp((props: any) => (props.fontSize = e.target.value))}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="12px">Small</option>
          <option value="16px">Medium</option>
          <option value="20px">Large</option>
          <option value="24px">Extra Large</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Text Align</label>
        <select
          value={props.textAlign}
          onChange={(e) => setProp((props: any) => (props.textAlign = e.target.value))}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
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
  },
  related: {
    toolbar: TextBlockSettings,
  },
};
