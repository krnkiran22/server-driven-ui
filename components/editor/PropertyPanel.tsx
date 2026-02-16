'use client';

import React from 'react';
import { useEditor } from '@craftjs/core';
import { Settings, Trash2, Layers } from 'lucide-react';

export const PropertyPanel = () => {
    const { selected, actions, query } = useEditor((state, query) => {
        const [currentNodeId] = state.events.selected;
        let selected;

        if (currentNodeId) {
            selected = {
                id: currentNodeId,
                name: state.nodes[currentNodeId].data.name,
                settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.toolbar,
                isDeletable: query.node(currentNodeId).isDeletable(),
            };
        }

        return {
            selected,
        };
    });

    if (!selected) {
        return (
            <div className="w-80 border-l bg-gray-50 h-full flex-shrink-0 overflow-y-auto p-8 flex flex-col items-center justify-center text-center">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                    <Layers className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-800 mb-1">No component selected</h3>
                <p className="text-xs text-gray-500">Click on a component to edit its properties.</p>
            </div>
        );
    }

    return (
        <div className="w-80 border-l bg-white h-full flex-shrink-0 overflow-y-auto flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-gray-800">{selected.name}</h3>
                </div>
                {selected.isDeletable && (
                    <button
                        onClick={() => {
                            actions.delete(selected.id);
                        }}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition"
                        title="Delete component"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div className="flex-1">
                {selected.settings ? (
                    React.createElement(selected.settings)
                ) : (
                    <div className="p-8 text-center">
                        <p className="text-xs text-gray-500 italic">No customizable properties for this component.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
