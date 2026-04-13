'use client';

import React from 'react';
import { useNode } from '@craftjs/core';
import { Link, ExternalLink } from 'lucide-react';

interface ButtonProps {
    text?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: string;
    href?: string;
    target?: '_self' | '_blank';
}

export const Button = ({
    text = 'Click Me',
    variant = 'primary',
    size = 'md',
    backgroundColor = '',
    textColor = '',
    borderRadius = '8px',
    href = '',
    target = '_self',
}: ButtonProps) => {
    const {
        connectors: { connect, drag },
    } = useNode();

    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':   return 'bg-blue-600 text-white hover:bg-blue-700';
            case 'secondary': return 'bg-gray-100 text-gray-900 hover:bg-gray-200';
            case 'outline':   return 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50';
            case 'ghost':     return 'text-gray-600 hover:bg-gray-100';
            default:          return 'bg-blue-600 text-white';
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'sm': return 'px-3 py-1.5 text-xs';
            case 'lg': return 'px-8 py-3.5 text-lg';
            default:   return 'px-6 py-2.5 text-sm';
        }
    };

    const customStyle = {
        backgroundColor: backgroundColor || undefined,
        color: textColor || undefined,
        borderRadius,
    };

    const className = `inline-block font-semibold transition-all duration-200 ${getVariantStyles()} ${getSizeStyles()}`;

    if (href) {
        return (
            <a
                ref={(ref: HTMLAnchorElement | null) => { if (ref) connect(drag(ref)); }}
                href={href}
                target={target}
                rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                style={customStyle}
                className={className}
            >
                {text}
            </a>
        );
    }

    return (
        <button
            ref={(ref: HTMLButtonElement | null) => { if (ref) connect(drag(ref)); }}
            style={customStyle}
            className={className}
        >
            {text}
        </button>
    );
};

export const ButtonSettings = () => {
    const {
        actions: { setProp },
        props,
    } = useNode((node) => ({ props: node.data.props }));

    return (
        <div className="p-4 space-y-4">
            {/* Text */}
            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Button Text</label>
                <input
                    type="text"
                    value={props.text ?? ''}
                    onChange={(e) => setProp((p: any) => (p.text = e.target.value))}
                    className="w-full px-3 py-2 border rounded text-sm"
                />
            </div>

            {/* Variant */}
            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Variant</label>
                <select
                    value={props.variant ?? 'primary'}
                    onChange={(e) => setProp((p: any) => (p.variant = e.target.value))}
                    className="w-full px-3 py-2 border rounded text-sm"
                >
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="outline">Outline</option>
                    <option value="ghost">Ghost</option>
                </select>
            </div>

            {/* Size */}
            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Size</label>
                <select
                    value={props.size ?? 'md'}
                    onChange={(e) => setProp((p: any) => (p.size = e.target.value))}
                    className="w-full px-3 py-2 border rounded text-sm"
                >
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                </select>
            </div>

            {/* Border Radius */}
            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Border Radius</label>
                <input
                    type="text"
                    value={props.borderRadius ?? '8px'}
                    onChange={(e) => setProp((p: any) => (p.borderRadius = e.target.value))}
                    className="w-full px-3 py-2 border rounded text-sm"
                    placeholder="e.g. 8px or 9999px"
                />
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">BG Color</label>
                    <input
                        type="color"
                        value={props.backgroundColor || '#2563eb'}
                        onChange={(e) => setProp((p: any) => (p.backgroundColor = e.target.value))}
                        className="w-full h-9 rounded cursor-pointer border"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Text Color</label>
                    <input
                        type="color"
                        value={props.textColor || '#ffffff'}
                        onChange={(e) => setProp((p: any) => (p.textColor = e.target.value))}
                        className="w-full h-9 rounded cursor-pointer border"
                    />
                </div>
            </div>

            {/* ── LINK SECTION ── */}
            <div className="border-t pt-4 space-y-3">
                <div className="flex items-center gap-2 mb-2">
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
                    <p className="text-[10px] text-gray-400 mt-1">Leave empty to keep as a plain button.</p>
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

Button.craft = {
    displayName: 'Button',
    props: {
        text: 'Click Me',
        variant: 'primary',
        size: 'md',
        borderRadius: '8px',
        backgroundColor: '',
        textColor: '',
        href: '',
        target: '_self',
    },
    related: {
        toolbar: ButtonSettings,
    },
};
