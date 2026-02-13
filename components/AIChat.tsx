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
    const { actions, query } = useEditor();

    const handleSend = async () => {
        if (!prompt.trim()) return;

        const userMessage = prompt.trim();
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
        setPrompt('');
        setIsTyping(true);

        try {
            // Get current page context for AI
            const context = query.serialize();

            const response = await aiApi.processCommand(userMessage, JSON.parse(context));

            if (response.success && response.operation) {
                setMessages((prev) => [...prev, { role: 'ai', content: 'Sure! I have generated the component for you. I\'m adding it to the page now.' }]);

                // Execute the operation
                if (response.operation.action === 'insert' && response.operation.component) {
                    const { type, props } = response.operation.component;
                    const Component = ComponentMapper[type];

                    if (Component) {
                        // Add to the bottom of the ROOT node
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
        } catch (error) {
            console.error('AI error:', error);
            toast.error('Failed to connect to AI service');
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
                                <p className="text-[10px] opacity-80">Online & ready to help</p>
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
                                    <h4 className="font-bold text-gray-800">What can I build for you?</h4>
                                    <p className="text-xs text-gray-500 mt-1">Try: "Add a faculty grid with 4 cards" or "Make the hero title blue"</p>
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
