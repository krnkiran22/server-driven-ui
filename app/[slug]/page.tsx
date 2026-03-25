'use client';

import React, { useEffect, useState, use, useRef } from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import { ComponentMapper } from '@/components/renderer/ComponentMapper';
import * as pagesApi from '@/lib/api/pages.api';
import { useAuth } from '@/lib/context/AuthContext';
import { toast } from 'sonner';
import { Container } from '@/components/builder-components/Container';
import { Edit3, ExternalLink } from 'lucide-react';

interface PageProps {
    params: Promise<{ slug: string }>;
}

import { SafeHTMLRenderer } from '@/components/editor/SafeHTMLRenderer';

// ── Renders AI-generated HTML in a perfectly isolated full-page viewport ─────
const FullPageRenderer = ({ html, slug, isAdmin }: { html: string; slug: string; isAdmin: boolean }) => {
    return (
        <div className="fixed inset-0 w-screen h-screen bg-white overflow-hidden flex flex-col">
            <SafeHTMLRenderer 
                html={html} 
                fullPage 
                className="flex-1 w-full h-full"
            />

            {/* Admin floating edit button */}
            {isAdmin && (
                <div className="fixed bottom-8 right-8 z-[9999]">
                    <a
                        href={`/edit/${slug}`}
                        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-black uppercase tracking-widest px-6 py-3.5 rounded-2xl shadow-2xl shadow-violet-900/40 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                        <Edit3 className="w-4 h-4" />
                        Edit Page
                    </a>
                </div>
            )}
        </div>
    );
};

export default function DynamicPage({ params }: PageProps) {
    const { slug } = use(params);
    const { user, isLoading: authLoading } = useAuth();
    const [pageData, setPageData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const data = await pagesApi.getPageBySlug(slug, user?.institutionId as string || '');
                setPageData(data);
            } catch (error) {
                console.error('Failed to fetch page:', error);
                toast.error('Page not found');
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchPage();
        }
    }, [slug, user, authLoading]);

    // ── Loading state ─────────────────────────────────────────────────────────
    if (loading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                    <p className="text-gray-500 font-medium">Loading your website...</p>
                </div>
            </div>
        );
    }

    const isAdmin = user && (user.role === 'admin' || user.role === 'editor' || user.role === 'super-admin');

    // ── HTML mode (AI-generated full page) ───────────────────────────────────
    // Both admins and public visitors see the rendered HTML directly in the page.
    if (pageData?.useHtml && pageData?.htmlContent) {
        return (
            <FullPageRenderer
                html={pageData.htmlContent}
                slug={slug}
                isAdmin={!!isAdmin}
            />
        );
    }

    // ── Admin block editor view ───────────────────────────────────────────────
    // Only shown for admins when the page is NOT in HTML mode.
    // In this case we redirect admins to the dedicated /edit/[slug] route
    // which has the full toolbar and AI builder.
    if (isAdmin) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                    <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto">
                        <Edit3 className="w-8 h-8 text-violet-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Open in Editor</h2>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto">
                        This page uses the visual block editor. Click below to open the full editor.
                    </p>
                    <a
                        href={`/edit/${slug}`}
                        className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Open Editor
                    </a>
                </div>
            </div>
        );
    }

    // ── Public CraftJS block view ─────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-white">
            <Editor enabled={false} resolver={ComponentMapper}>
                <Frame data={pageData?.jsonConfig?.ROOT ? JSON.stringify(pageData.jsonConfig) : undefined}>
                    <Element is={Container} canvas />
                </Frame>
            </Editor>
        </div>
    );
}
