'use client';

import React from 'react';
import { useEditor } from '@craftjs/core';
import { Save, Plus, Play, Pause, RotateCcw } from 'lucide-react';
import Button from '../ui/Button';

interface EditorToolbarProps {
    onSave: () => void;
    isSaving?: boolean;
    slug?: string;
}

export const EditorToolbar = ({ onSave, isSaving, slug }: EditorToolbarProps) => {
    const { actions, query, enabled } = useEditor((state) => ({
        enabled: state.options.enabled,
    }));

    return (
        <div className="flex items-center justify-between bg-white border-b px-6 py-3 sticky top-0 z-50 shadow-sm">
            <div className="flex items-center gap-4">
                <h2 className="font-bold text-gray-800">Visual Editor</h2>
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => actions.setOptions((options) => (options.enabled = true))}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${enabled ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Edit Mode
                    </button>
                    <button
                        onClick={() => actions.setOptions((options) => (options.enabled = false))}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${!enabled ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Preview Mode
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {slug && (
                    <a
                        href={`/${slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mr-4 text-xs font-bold text-gray-400 hover:text-blue-600 transition flex items-center gap-1"
                    >
                        View Live Website
                        <Plus className="w-3 h-3 rotate-45" />
                    </a>
                )}
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => actions.history.undo()}
                    className="flex items-center gap-1"
                >
                    <RotateCcw className="w-4 h-4" />
                    Undo
                </Button>
                <Button
                    variant="primary"
                    size="sm"
                    onClick={onSave}
                    disabled={isSaving}
                    className="flex items-center gap-1"
                >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>
    );
};
