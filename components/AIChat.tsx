'use client';

import React, { useState } from 'react';
import { useEditor } from '@craftjs/core';
import { Bot, Send, X, Sparkles, MessageSquare } from 'lucide-react';
import * as aiApi from '@/lib/api/ai.api';
import { toast } from 'sonner';
import { ComponentMapper } from './renderer/ComponentMapper';

export const AIChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [mode, setMode] = useState<'command' | 'design'>('command');
    const { actions, query } = useEditor();

    const handleSend = async () => {
        if (!prompt.trim()) return;

        const userMessage = prompt.trim();
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
        setPrompt('');
        setIsTyping(true);

        try {
            if (mode === 'design') {
                const response = await aiApi.generateComponent(userMessage);
                if (response.success && response.data) {
                    window.dispatchEvent(new CustomEvent('customComponentGenerated'));
                    setMessages((prev) => [...prev, {
                        role: 'ai',
                        content: `I've created a new component: **${response.data.name}**. I've added it to the "AI Generated" section in your component library on the left. You can now drag it onto the page!`
                    }]);
                    toast.success('New component generated!');
                } else {
                    setMessages((prev) => [...prev, { role: 'ai', content: response.error || 'Failed to generate component.' }]);
                }
            } else {
                // Get current page context for AI
                const context = query.serialize();
                const response = await aiApi.processCommand(userMessage, JSON.parse(context));

                if (response.success && response.data) {
                    setMessages((prev) => [...prev, { role: 'ai', content: 'Sure! I have generated the component for you. I\'m adding it to the page now.' }]);

                    const operation = response.data;
                    // Execute the operation
                    if (operation.action === 'insert' && operation.component) {
                        const { type, props } = operation.component;

                        // Case-insensitive lookup
                        const typeKey = Object.keys(ComponentMapper).find(
                            k => k.toLowerCase() === type.toLowerCase()
                        );
                        const Component = typeKey ? ComponentMapper[typeKey] : null;

                        if (Component) {
                            actions.add(
                                query.createNode(React.createElement(Component, props)),
                                'ROOT'
                            );
                            toast.success(`Added ${type} component!`);
                        } else {
                            console.warn(`Component type ${type} not found in mapper`);
                            toast.error(`Unknown component type: ${type}`);
                        }
                    }
                } else {
                    setMessages((prev) => [...prev, { role: 'ai', content: response.error || 'Sorry, I couldn\'t process that request.' }]);
                }
            }
        } catch (error: any) {
            console.error('AI error:', error);
            const errorMessage = error.response?.data?.error?.message || 'Failed to connect to AI service';
            toast.error(errorMessage);
            setMessages((prev) => [...prev, { role: 'ai', content: `Error: ${errorMessage}. Please try again.` }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60]">
            {isOpen ? (
                <div className="bg-white rounded-3xl shadow-2xl w-96 h-[500px] flex flex-col overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-5 duration-300">
                    <div className="bg-blue-600 p-4 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bot className="w-6 h-6" />
                            <div>
                                <h3 className="font-bold text-sm">AI Design Assistant</h3>
                                <div className="flex gap-2 mt-1">
                                    <button
                                        onClick={() => setMode('command')}
                                        className={`text-[10px] px-2 py-0.5 rounded-full transition ${mode === 'command' ? 'bg-white text-blue-600 font-bold' : 'bg-blue-500/50 text-white'}`}
                                    >
                                        Edit Page
                                    </button>
                                    <button
                                        onClick={() => setMode('design')}
                                        className={`text-[10px] px-2 py-0.5 rounded-full transition ${mode === 'design' ? 'bg-white text-blue-600 font-bold' : 'bg-blue-500/50 text-white'}`}
                                    >
                                        New Design
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-blue-500 rounded-full transition">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                                <div className="p-4 bg-blue-100 text-blue-600 rounded-full">
                                    <Sparkles className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">
                                        {mode === 'command' ? "What can I build for you?" : "Describe your new component"}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {mode === 'command'
                                            ? 'Try: "Add a faculty grid with 4 cards" or "Make the hero title blue"'
                                            : 'Try: "Create a modern testimonial slider with 3 cards" or "A pricing table with 3 tiers"'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 rounded-tl-none flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150"></span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t bg-white">
                        <div className="relative">
                            <input
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask AI to design..."
                                className="w-full pl-4 pr-12 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 transition"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!prompt.trim() || isTyping}
                                className="absolute right-2 top-1.5 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center gap-2 group"
                >
                    <div className="bg-white/20 p-1.5 rounded-full">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-sm pr-2">Ask AI Assistant</span>
                </button>
            )}
        </div>
    );
};
