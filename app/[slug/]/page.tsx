'use client';

import React, { useEffect, useState, use } from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import { ComponentMapper } from '@/components/renderer/ComponentMapper';
import * as pagesApi from '@/lib/api/pages.api';
import * as institutionsApi from '@/lib/api/institutions.api';
import { useAuth } from '@/lib/context/AuthContext';
import { toast } from 'sonner';
import { Container } from '@/components/builder-components/Container';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default function PublicPage({ params }: PageProps) {
    const { slug } = use(params);
    const { user, isLoading: authLoading } = useAuth();
    const [pageData, setPageData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                let data = null;
                if (user?.institutionId) {
                    // Authenticated user (Admin/Editor/Viewer)
                    // Viewers will get the published version, others get draft
                    data = await pagesApi.getPageBySlug(slug, user.institutionId);
                } else {
                    // Public Guest
                    data = await pagesApi.getPublishedPageBySlug(slug, '');
                }
                setPageData(data);
            } catch (error) {
                console.error('Failed to fetch page:', error);
                if (!authLoading) {
                    toast.error('Page not found or not published');
                }
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchPage();
        }
    }, [slug, user, authLoading]);

    if (loading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-500 font-medium">Loading website...</p>
                </div>
            </div>
        );
    }

    if (!pageData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-8 text-xl">Oops! This page has sailed away.</p>
                <a href="/" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100">
                    Back to Home
                </a>
            </div>
        );
    }

    // Public View - Fixed (No Editor controls ever)
    return (
        <div className="min-h-screen bg-white">
            <Editor
                enabled={false}
                resolver={ComponentMapper}
            >
                <Frame data={pageData?.jsonConfig?.ROOT ? JSON.stringify(pageData.jsonConfig) : undefined}>
                    <Element is={Container} canvas />
                </Frame>
            </Editor>

            {/* Minimalist Login link for admins at the bottom */}
            {user && (user.role === 'admin' || user.role === 'editor' || user.role === 'super-admin') && (
                <div className="fixed bottom-4 left-4 opacity-0 hover:opacity-100 transition-opacity">
                    <a
                        href={`/edit/${slug}`}
                        className="bg-black/80 backdrop-blur-sm text-white text-[10px] px-3 py-2 rounded-full font-bold uppercase tracking-widest border border-white/10"
                    >
                        Switch to Editor
                    </a>
                </div>
            )}
        </div>
    );
}
