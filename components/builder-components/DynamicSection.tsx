'use client';

import React from 'react';
import { useNode } from '@craftjs/core';

interface DynamicSectionProps {
    title?: string;
    subtitle?: string;
    content?: string;
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    alignment?: 'left' | 'center' | 'right';
    className?: string;
}

export const DynamicSection = ({
    title = '',
    subtitle = '',
    content = '',
    backgroundColor = '#ffffff',
    textColor = '#1e293b',
    padding = '64px 24px',
    alignment = 'center',
    className = '',
}: DynamicSectionProps) => {
    const {
        connectors: { connect, drag },
    } = useNode();

    return (
        <div
            ref={(ref: HTMLDivElement | null) => {
                if (ref) connect(drag(ref));
            }}
            style={{ backgroundColor, color: textColor, padding }}
            className={`w-full ${className}`}
        >
            <div className={`max-w-7xl mx-auto flex flex-col items-${alignment === 'left' ? 'start' : alignment === 'right' ? 'end' : 'center'} text-${alignment}`}>
                {title && <h2 className="text-4xl font-bold mb-4">{title}</h2>}
                {subtitle && <p className="text-xl opacity-80 mb-6 max-w-2xl">{subtitle}</p>}
                {content && <div className="text-lg leading-relaxed whitespace-pre-wrap">{content}</div>}
            </div>
        </div>
    );
};

export const DynamicSectionSettings = () => {
    const {
        actions: { setProp },
        props,
    } = useNode((node) => ({
        props: node.data.props,
    }));

    return (
        <div className="p-4 space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                    type="text"
                    value={props.title}
                    onChange={(e) => setProp((p: any) => (p.title = e.target.value))}
                    className="w-full px-3 py-2 border rounded"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Subtitle</label>
                <input
                    type="text"
                    value={props.subtitle}
                    onChange={(e) => setProp((p: any) => (p.subtitle = e.target.value))}
                    className="w-full px-3 py-2 border rounded"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                    value={props.content}
                    onChange={(e) => setProp((p: any) => (p.content = e.target.value))}
                    className="w-full px-3 py-2 border rounded"
                    rows={5}
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Background Color</label>
                <input
                    type="color"
                    value={props.backgroundColor}
                    onChange={(e) => setProp((p: any) => (p.backgroundColor = e.target.value))}
                    className="w-full h-10 rounded"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Text Color</label>
                <input
                    type="color"
                    value={props.textColor}
                    onChange={(e) => setProp((p: any) => (p.textColor = e.target.value))}
                    className="w-full h-10 rounded"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Alignment</label>
                <select
                    value={props.alignment}
                    onChange={(e) => setProp((p: any) => (p.alignment = e.target.value))}
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

DynamicSection.craft = {
    displayName: 'Dynamic Section',
    props: {
        title: 'Your Title Here',
        subtitle: 'Your Subtitle Here',
        content: 'Add your custom content here...',
        backgroundColor: '#ffffff',
        textColor: '#1e293b',
        padding: '64px 24px',
        alignment: 'center',
    },
    related: {
        toolbar: DynamicSectionSettings,
    },
};
