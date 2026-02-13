'use client';

import React from 'react';
import { useNode } from '@craftjs/core';

interface ContainerProps {
  children?: React.ReactNode;
  backgroundColor?: string;
  padding?: string;
}

export const Container = ({
  children,
  backgroundColor = '#ffffff',
  padding = '16px',
}: ContainerProps) => {
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
      style={{ backgroundColor, padding }}
      className="w-full"
    >
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
    </div>
  );
};

Container.craft = {
  displayName: 'Container',
  props: {
    backgroundColor: '#ffffff',
    padding: '16px',
  },
  related: {
    toolbar: ContainerSettings,
  },
};
