'use client';

import React from 'react';
import { useEditor, Element } from '@craftjs/core';
import { Layout, Type, Image, Plus, Box, Info, Users, HelpCircle, Mail } from 'lucide-react';
import { HeroBanner } from '../builder-components/HeroBanner';
import { TextBlock } from '../builder-components/TextBlock';
import { Container } from '../builder-components/Container';
import { AboutSection } from '../builder-components/AboutSection';
import { Statistics } from '../builder-components/Statistics';
import { FacultyGrid } from '../builder-components/FacultyGrid';
import { FAQAccordion } from '../builder-components/FAQAccordion';
import { ContactForm } from '../builder-components/ContactForm';

export const ComponentLibrary = () => {
    const { connectors } = useEditor();

    const components = [
        {
            name: 'Hero Banner',
            icon: <Image className="w-5 h-5 text-purple-500" />,
            component: <HeroBanner />,
            description: 'Main landing section with title and background.'
        },
        {
            name: 'Text Block',
            icon: <Type className="w-5 h-5 text-blue-500" />,
            component: <TextBlock />,
            description: 'Simple text section with title and description.'
        },
        {
            name: 'Container',
            icon: <Box className="w-5 h-5 text-green-500" />,
            component: (
                <Element is={Container} canvas>
                    <div className="p-10 text-center text-gray-400 border border-dashed rounded italic">
                        Drop components here
                    </div>
                </Element>
            ),
            description: 'A layout container to hold other components.'
        },
        {
            name: 'About Section',
            icon: <Info className="w-5 h-5 text-orange-500" />,
            component: <AboutSection />,
            description: 'About us section with image and text.'
        },
        {
            name: 'Statistics',
            icon: <Layout className="w-5 h-5 text-indigo-500" />,
            component: <Statistics />,
            description: 'Display institution numbers and achievements.'
        },
        {
            name: 'Faculty Grid',
            icon: <Users className="w-5 h-5 text-rose-500" />,
            component: <FacultyGrid />,
            description: 'Display faculty members in a grid.'
        },
        {
            name: 'FAQ Accordion',
            icon: <HelpCircle className="w-5 h-5 text-amber-500" />,
            component: <FAQAccordion />,
            description: 'Expandable list of questions and answers.'
        },
        {
            name: 'Contact Form',
            icon: <Mail className="w-5 h-5 text-cyan-500" />,
            component: <ContactForm />,
            description: 'Contact section with details and a form.'
        }
    ];

    return (
        <div className="w-72 border-r bg-white h-[calc(100vh-64px)] overflow-y-auto p-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Layout className="w-3.5 h-3.5" />
                Components
            </h3>

            <div className="space-y-3">
                {components.map((item, index) => (
                    <div
                        key={index}
                        ref={(ref: HTMLDivElement | null) => {
                            if (ref) {
                                connectors.create(ref, item.component);
                            }
                        }}
                        className="group p-3 border rounded-xl hover:border-blue-300 hover:bg-blue-50 cursor-grab transition active:cursor-grabbing shadow-sm"
                    >
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-white transition">
                                {item.icon}
                            </div>
                            <span className="text-sm font-semibold text-gray-700">{item.name}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed px-1">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="text-xs font-bold text-blue-700 mb-1 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Tip
                </h4>
                <p className="text-[10px] text-blue-600 leading-relaxed">
                    Drag and drop components directly onto the canvas or into containers.
                </p>
            </div>
        </div>
    );
};
