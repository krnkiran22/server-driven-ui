'use client';

import React from 'react';
import { useNode } from '@craftjs/core';
import { Users, GraduationCap, Building2, Trophy } from 'lucide-react';

interface StatItem {
    label: string;
    value: string;
    icon: string;
}

interface StatisticsProps {
    stats?: StatItem[];
    backgroundColor?: string;
    textColor?: string;
}

export const Statistics = ({
    stats = [
        { label: 'Students', value: '5000+', icon: 'Users' },
        { label: 'Courses', value: '40+', icon: 'GraduationCap' },
        { label: 'Campuses', value: '3', icon: 'Building2' },
        { label: 'Awards', value: '15+', icon: 'Trophy' },
    ],
    backgroundColor = '#f8fafc',
    textColor = '#1e293b',
}: StatisticsProps) => {
    const {
        connectors: { connect, drag },
    } = useNode();

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Users': return <Users className="w-8 h-8" />;
            case 'GraduationCap': return <GraduationCap className="w-8 h-8" />;
            case 'Building2': return <Building2 className="w-8 h-8" />;
            case 'Trophy': return <Trophy className="w-8 h-8" />;
            default: return <Users className="w-8 h-8" />;
        }
    };

    return (
        <div
            ref={(ref: HTMLDivElement | null) => {
                if (ref) connect(drag(ref));
            }}
            className="py-16 px-4"
            style={{ backgroundColor }}
        >
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                    <div key={index} className="text-center group" style={{ color: textColor }}>
                        <div className="mb-4 inline-flex items-center justify-center p-4 bg-white rounded-2xl shadow-sm text-blue-600 group-hover:scale-110 transition-transform duration-300">
                            {getIcon(stat.icon)}
                        </div>
                        <div className="text-3xl font-bold mb-1">{stat.value}</div>
                        <div className="text-sm font-medium opacity-80">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const StatisticsSettings = () => {
    const {
        actions: { setProp },
        props,
    } = useNode((node) => ({
        props: node.data.props,
    }));

    return (
        <div className="p-4 space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Background Color</label>
                <input
                    type="color"
                    value={props.backgroundColor}
                    onChange={(e) => setProp((p: any) => (p.backgroundColor = e.target.value))}
                    className="w-full h-10 rounded"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Text Color</label>
                <input
                    type="color"
                    value={props.textColor}
                    onChange={(e) => setProp((p: any) => (p.textColor = e.target.value))}
                    className="w-full h-10 rounded"
                />
            </div>
        </div>
    );
};

Statistics.craft = {
    displayName: 'Statistics',
    props: {
        stats: [
            { label: 'Students', value: '5000+', icon: 'Users' },
            { label: 'Courses', value: '40+', icon: 'GraduationCap' },
            { label: 'Campuses', value: '3', icon: 'Building2' },
            { label: 'Awards', value: '15+', icon: 'Trophy' },
        ],
        backgroundColor: '#f8fafc',
        textColor: '#1e293b',
    },
    related: {
        toolbar: StatisticsSettings,
    },
};
