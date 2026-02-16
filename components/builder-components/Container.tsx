'use client';

import React from 'react';
import { useNode } from '@craftjs/core';

interface ContainerProps {
  children?: React.ReactNode;
  backgroundColor?: string;
  padding?: string;
  minHeight?: string;
}

export const Container = ({
  children,
  backgroundColor = '#ffffff',
  padding = '16px',
  minHeight = 'auto',
}: ContainerProps) => {
  const {
    id,
    nodes,
    connectors: { connect, drag },
  } = useNode((node) => ({
    id: node.id,
    nodes: node.data.nodes,
  }));

  const isEmpty = nodes.length === 0;
  const isRoot = id === 'ROOT';

  return (
    <div
      ref={(ref: HTMLDivElement | null) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      style={{
        backgroundColor,
        padding,
        minHeight: (isEmpty && isRoot) ? '500px' : (isEmpty ? '100px' : minHeight)
      }}
      className={`w-full flex flex-col gap-2 transition-all ${isEmpty ? 'outline-2 outline-dashed outline-blue-200 bg-blue-50/10' : ''
        }`}
    >
      {isEmpty && (
        <div className="flex-1 flex items-center justify-center text-gray-300 text-xs font-medium uppercase tracking-widest pointer-events-none italic">
          Drop Components Here
        </div>
      )}
      {children}
    </div>
  );
};

export const ContainerSettings = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Background Color</label>
        <input
          type="color"
          value={props.backgroundColor}
          onChange={(e) => setProp((props: any) => (props.backgroundColor = e.target.value))}
          className="w-full h-10 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Padding</label>
        <select
          value={props.padding}
          onChange={(e) => setProp((props: any) => (props.padding = e.target.value))}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="0px">None</option>
          <option value="8px">Small</option>
          <option value="16px">Medium</option>
          <option value="24px">Large</option>
          <option value="32px">Extra Large</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Min Height</label>
        <select
          value={props.minHeight}
          onChange={(e) => setProp((props: any) => (props.minHeight = e.target.value))}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="auto">Auto</option>
          <option value="100px">100px</option>
          <option value="300px">300px</option>
          <option value="500px">500px</option>
          <option value="800px">800px</option>
          <option value="100vh">Full Screen</option>
        </select>
      </div>
    </div>
  );
};

Container.craft = {
  displayName: 'Container',
  isCanvas: true,
  props: {
    backgroundColor: '#ffffff',
    padding: '16px',
  },
  related: {
    toolbar: ContainerSettings,
  },
};
