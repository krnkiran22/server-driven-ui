'use client';

import React, { useState } from 'react';
import { useNode } from '@craftjs/core';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQAccordionProps {
    title?: string;
    items?: FAQItem[];
}

export const FAQAccordion = ({
    title = 'Frequently Asked Questions',
    items = [
        { question: 'What are the admission requirements?', answer: 'Admission requirements vary by course. Generally, we require high school transcripts and an entrance exam.' },
        { question: 'How can I apply for a scholarship?', answer: 'Details about scholarships and the application process can be found on our Admissions page.' },
        { question: 'What facilities are available on campus?', answer: 'Our campus features state-of-the-art labs, a library, sports facilities, and high-speed Wi-Fi.' }
    ]
}: FAQAccordionProps) => {
    const {
        connectors: { connect, drag },
    } = useNode();

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div
            ref={(ref: HTMLDivElement | null) => {
                if (ref) connect(drag(ref));
            }}
            className="py-16 px-6 bg-gray-50"
        >
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-8 justify-center">
                    <HelpCircle className="w-8 h-8 text-blue-600" />
                    <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
                </div>

                <div className="space-y-4">
                    {items.map((item, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                            <button
                                onClick={() => toggle(index)}
                                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition"
                            >
                                <span className="font-semibold text-gray-800">{item.question}</span>
                                {openIndex === index ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                            </button>
                            {openIndex === index && (
                                <div className="px-6 py-5 text-gray-600 border-t border-gray-50 bg-gray-50/30 animate-in fade-in slide-in-from-top-1 duration-200">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const FAQAccordionSettings = () => {
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
        </div>
    );
};

FAQAccordion.craft = {
    displayName: 'FAQ Accordion',
    props: {
        title: 'Frequently Asked Questions',
        items: [
            { question: 'What are the admission requirements?', answer: 'Admission requirements vary by course. Generally, we require high school transcripts and an entrance exam.' },
            { question: 'How can I apply for a scholarship?', answer: 'Details about scholarships and the application process can be found on our Admissions page.' },
            { question: 'What facilities are available on campus?', answer: 'Our campus features state-of-the-art labs, a library, sports facilities, and high-speed Wi-Fi.' }
        ]
    },
    related: {
        toolbar: FAQAccordionSettings,
    },
};
