'use client';

import React from 'react';
import { useNode } from '@craftjs/core';
import { Mail, Linkedin, Github } from 'lucide-react';

interface FacultyMember {
    name: string;
    role: string;
    image: string;
    description: string;
}

interface FacultyGridProps {
    title?: string;
    members?: FacultyMember[];
    columns?: number;
}

export const FacultyGrid = ({
    title = 'Our Expert Faculty',
    members = [
        {
            name: 'Dr. Sarah Johnson',
            role: 'Head of Department',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
            description: 'Ph.D. in Computer Science with 15 years of experience.'
        },
        {
            name: 'Prof. Michael Chen',
            role: 'Associate Professor',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
            description: 'Expert in AI and Machine Learning.'
        },
        {
            name: 'Dr. Emily Brown',
            role: 'Assistant Professor',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200',
            description: 'Focuses on Data Structures and Algorithms.'
        }
    ],
    columns = 3
}: FacultyGridProps) => {
    const {
        connectors: { connect, drag },
    } = useNode();

    return (
        <div
            ref={(ref: HTMLDivElement | null) => {
                if (ref) connect(drag(ref));
            }}
            className="py-16 px-6 bg-white"
        >
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{title}</h2>
                <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-10`}>
                    {members.map((member, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="relative w-40 h-40 mb-6 rounded-full overflow-hidden shadow-lg border-4 border-gray-50 group-hover:border-blue-100 transition-colors">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                            <p className="text-blue-600 font-medium text-sm mb-3 uppercase tracking-wider">{member.role}</p>
                            <p className="text-gray-500 text-sm mb-6 leading-relaxed max-w-xs">{member.description}</p>
                            <div className="flex gap-4">
                                <button className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition">
                                    <Mail className="w-4 h-4" />
                                </button>
                                <button className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition">
                                    <Linkedin className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const FacultyGridSettings = () => {
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
                <label className="block text-sm font-medium mb-1">Columns</label>
                <select
                    value={props.columns}
                    onChange={(e) => setProp((p: any) => (p.columns = parseInt(e.target.value)))}
                    className="w-full px-3 py-2 border rounded"
                >
                    <option value={2}>2 Columns</option>
                    <option value={3}>3 Columns</option>
                    <option value={4}>4 Columns</option>
                </select>
            </div>
        </div>
    );
};

FacultyGrid.craft = {
    displayName: 'Faculty Grid',
    props: {
        title: 'Our Expert Faculty',
        members: [
            {
                name: 'Dr. Sarah Johnson',
                role: 'Head of Department',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
                description: 'Ph.D. in Computer Science with 15 years of experience.'
            },
            {
                name: 'Prof. Michael Chen',
                role: 'Associate Professor',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
                description: 'Expert in AI and Machine Learning.'
            },
            {
                name: 'Dr. Emily Brown',
                role: 'Assistant Professor',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200',
                description: 'Focuses on Data Structures and Algorithms.'
            }
        ],
        columns: 3
    },
    related: {
        toolbar: FacultyGridSettings,
    },
};
