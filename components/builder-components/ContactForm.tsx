'use client';

import React from 'react';
import { useNode } from '@craftjs/core';
import { Send, MapPin, Phone, Mail } from 'lucide-react';
import Button from '../ui/Button';

interface ContactFormProps {
    title?: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
}

export const ContactForm = ({
    title = 'Get in Touch',
    description = 'We would love to hear from you. Fill out the form and we will get back to you soon.',
    address = '123 Education Lane, Academic City, State 45678',
    phone = '+91 1234567890',
    email = 'info@institution.edu.in'
}: ContactFormProps) => {
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
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
                    <p className="text-gray-600 mb-10 leading-relaxed text-lg">{description}</p>

                    <div className="space-y-8">
                        <div className="flex gap-4 items-start">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 mb-1">Our Location</h4>
                                <p className="text-gray-500">{address}</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 mb-1">Phone Number</h4>
                                <p className="text-gray-500">{phone}</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 mb-1">Email Address</h4>
                                <p className="text-gray-500">{email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-8 rounded-3xl shadow-sm border border-gray-100">
                    <form className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">First Name</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-white" placeholder="John" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Last Name</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-white" placeholder="Doe" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
                            <input type="email" className="w-full px-4 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-white" placeholder="john@example.com" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Subject</label>
                            <select className="w-full px-4 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-white">
                                <option>Admission Inquiry</option>
                                <option>Campus Visit</option>
                                <option>Course Information</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Message</label>
                            <textarea rows={4} className="w-full px-4 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-white" placeholder="How can we help you?"></textarea>
                        </div>

                        <Button size="lg" className="w-full gap-2 rounded-xl h-14 translate-y-2">
                            <Send className="w-4 h-4" />
                            Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export const ContactFormSettings = () => {
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
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                    type="text"
                    value={props.email}
                    onChange={(e) => setProp((p: any) => (p.email = e.target.value))}
                    className="w-full px-3 py-2 border rounded"
                />
            </div>
        </div>
    );
};

ContactForm.craft = {
    displayName: 'Contact Form',
    props: {
        title: 'Get in Touch',
        description: 'We would love to hear from you. Fill out the form and we will get back to you soon.',
        address: '123 Education Lane, Academic City, State 45678',
        phone: '+91 1234567890',
        email: 'info@institution.edu.in'
    },
    related: {
        toolbar: ContactFormSettings,
    },
};
