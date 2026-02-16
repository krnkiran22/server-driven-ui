'use client';

import React from 'react';
import { useNode } from '@craftjs/core';

interface ButtonProps {
    text?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: string;
}

export const Button = ({
    text = 'Click Me',
    variant = 'primary',
    size = 'md',
    backgroundColor = '',
    textColor = '',
    borderRadius = '8px',
}: ButtonProps) => {
    const {
        connectors: { connect, drag },
    } = useNode();

    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return 'bg-blue-600 text-white hover:bg-blue-700';
            case 'secondary':
                return 'bg-gray-100 text-gray-900 hover:bg-gray-200';
            case 'outline':
                return 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50';
            case 'ghost':
                return 'text-gray-600 hover:bg-gray-100';
            default:
                return 'bg-blue-600 text-white';
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'sm':
                return 'px-3 py-1.5 text-xs';
            case 'md':
                return 'px-6 py-2.5 text-sm';
            case 'lg':
                return 'px-8 py-3.5 text-lg';
            default:
                return 'px-6 py-2.5 text-sm';
        }
    };

    const customStyle = {
        backgroundColor: backgroundColor || undefined,
        color: textColor || undefined,
        borderRadius: borderRadius,
    };

    return (
        <button
            ref={(ref: HTMLButtonElement | null) => {
                if (ref) connect(drag(ref));
            }}
            style={customStyle}
            className={`font-semibold transition-all duration-200 ${getVariantStyles()} ${getSizeStyles()}`}
        >
            {text}
        </button>
    );
};

export const ButtonSettings = () => {
    const {
        actions: { setProp },
        props,
    } = useNode((node) => ({
        props: node.data.props,
    }));

    return (
        <div className="p-4 space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Text</label>
                <input
                    type="text"
                    value={props.text}
                    onChange={(e) => setProp((p: any) => (p.text = e.target.value))}
                    className="w-full px-3 py-2 border rounded text-sm"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Variant</label>
                <select
                    value={props.variant}
                    onChange={(e) => setProp((p: any) => (p.variant = e.target.value))}
                    className="w-full px-3 py-2 border rounded text-sm"
                >
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="outline">Outline</option>
                    <option value="ghost">Ghost</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Size</label>
                <select
                    value={props.size}
                    onChange={(e) => setProp((p: any) => (p.size = e.target.value))}
                    className="w-full px-3 py-2 border rounded text-sm"
                >
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Border Radius</label>
                <input
                    type="text"
                    value={props.borderRadius}
                    onChange={(e) => setProp((p: any) => (p.borderRadius = e.target.value))}
                    className="w-full px-3 py-2 border rounded text-sm"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Custom Background Color</label>
                <input
                    type="color"
                    value={props.backgroundColor}
                    onChange={(e) => setProp((p: any) => (p.backgroundColor = e.target.value))}
                    className="w-full h-10 rounded cursor-pointer"
                />
            </div>
        </div>
    );
};

Button.craft = {
    displayName: 'Button',
    props: {
        text: 'Click Me',
        variant: 'primary',
        size: 'md',
        borderRadius: '8px',
    },
    related: {
        toolbar: ButtonSettings,
    },
};
