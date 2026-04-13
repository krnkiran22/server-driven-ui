'use client';

import React, { useState } from 'react';
import { useEditor } from '@craftjs/core';
import { Bot, Send, X, Sparkles, MessageSquare, FileCode, Layers, Wand2 } from 'lucide-react';
import * as aiApi from '@/lib/api/ai.api';
import { toast } from 'sonner';
import { ComponentMapper } from './renderer/ComponentMapper';

export type ChatMode = 'command' | 'design' | 'full';

export const AIChat = ({ 
    onFullBuild, 
    onModeChange 
}: { 
    onFullBuild?: (prompt: string) => void,
    onModeChange?: (mode: ChatMode) => void
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [mode, setMode] = useState<ChatMode>('command');
    const { actions, query } = useEditor();

    const handleModeChange = (newMode: ChatMode) => {
        setMode(newMode);
        onModeChange?.(newMode);
    };

    const handleSend = async () => {
        if (!prompt.trim()) return;

        const userMessage = prompt.trim();
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
        setPrompt('');
        setIsTyping(true);

        try {
            if (mode === 'full' && onFullBuild) {
                setMessages((prev) => [...prev, { role: 'ai', content: 'Architecting your full website now. I am compiling the HTML and styling it with Tailwind. Please check the Code Editor view.' }]);
                onFullBuild(userMessage);
                setIsTyping(false);
                return;
            }

            if (mode === 'design') {
                const response = await aiApi.generateComponent(userMessage);
                if (response.success && response.data) {
                    window.dispatchEvent(new CustomEvent('customComponentGenerated'));
                    setMessages((prev) => [...prev, {
                        role: 'ai',
                        content: `I've created a new component: **${response.data.name}**. I've added it to the "AI Generated" section. You can now drag it onto the page!`
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
                    const operation = response.data;
                    console.log('AI Operation received:', operation);

                    if (operation.action === 'generate_full_html') {
                        console.log('Action is generate_full_html, onFullBuild is:', !!onFullBuild);
                        if (onFullBuild) {
                            setMessages((prev) => [...prev, { role: 'ai', content: 'You requested a full page. I am generating the complete HTML now. Switching you to Code mode...' }]);
                            handleModeChange('full'); 
                            onFullBuild(operation.prompt || userMessage);
                            setIsTyping(false);
                            return;
                        } else {
                            console.error('onFullBuild callback is missing!');
                        }
                    }

                    // For specific block modifications
                    if (operation.action === 'insert' || operation.action === 'update' || operation.action === 'delete') {
                        console.log('Action is block modification:', operation.action);
                        setMessages((prev) => [...prev, { role: 'ai', content: 'Updating your design now...' }]);
                    }

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
                            // Fallback: If it's a "template" or "page" request that the AI misclassified as insert
                            if ((type.toLowerCase().includes('template') || type.toLowerCase().includes('page')) && onFullBuild) {
                                setMessages((prev) => [...prev, { 
                                    role: 'ai', 
                                    content: `I don't have a specific "${type}" component, but I can build a full page for you using that theme. Building your page now...` 
                                }]);
                                onFullBuild(userMessage);
                            } else {
                                console.warn(`Component type ${type} not found in mapper`);
                                toast.error(`Unknown component type: ${type}`);
                                setMessages((prev) => [...prev, { role: 'ai', content: `Sorry, I don't know how to create a "${type}" component yet. Try asking for a HeroBanner or TextBlock.` }]);
                            }
                        }
                    }
                }
 else {
                    setMessages((prev) => [...prev, { role: 'ai', content: response.error || 'Sorry, I couldn\'t process that request.' }]);
                }
            }
        } catch (error: any) {
            console.error('AI error:', error);
            const responseData = error.response?.data;
            let errorMessage = responseData?.error?.message || 'Failed to connect to AI service';
            
            // Check for validation errors and show details
            if (responseData?.error?.code === 'VALIDATION_ERROR' && responseData.error.details) {
                const details = responseData.error.details.map((d: any) => `${d.field}: ${d.message}`).join(', ');
                errorMessage = `Validation error - ${details}`;
            }
            
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
                                <div className="flex gap-1.5 mt-2">
                                    <button
                                        onClick={() => handleModeChange('command')}
                                        className={`text-[9px] px-2 py-1 rounded-full border transition-all flex items-center gap-1 ${mode === 'command' ? 'bg-white text-blue-600 border-white font-black' : 'bg-transparent text-white/70 border-white/20'}`}
                                    >
                                        <Layers className="w-2.5 h-2.5" /> Edit Blocks
                                    </button>
                                    <button
                                        onClick={() => handleModeChange('design')}
                                        className={`text-[9px] px-2 py-1 rounded-full border transition-all flex items-center gap-1 ${mode === 'design' ? 'bg-white text-blue-600 border-white font-black' : 'bg-transparent text-white/70 border-white/20'}`}
                                    >
                                        <Wand2 className="w-2.5 h-2.5" /> New Component
                                    </button>
                                    <button
                                        onClick={() => handleModeChange('full')}
                                        className={`text-[9px] px-2 py-1 rounded-full border transition-all flex items-center gap-1 ${mode === 'full' ? 'bg-white text-blue-600 border-white font-black' : 'bg-transparent text-white/70 border-white/20'}`}
                                    >
                                        <FileCode className="w-2.5 h-2.5" /> Full Build
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-full transition">
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
                                        {mode === 'command' ? "Block Editor Mode" : mode === 'design' ? "Component Architect Mode" : "Full Page Build Mode"}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {mode === 'command'
                                            ? 'Ask to subheadings, change colors, or add existing blocks.'
                                            : mode === 'design'
                                            ? 'Describe a new component to build from scratch (e.g. Testimonial Slider).'
                                            : 'Ask for a complete website page. The AI will write the full HTML code.'}
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
