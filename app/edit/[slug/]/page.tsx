'use client';

import React, { useEffect, useState, use } from 'react';
import { Editor, Frame, Element, useEditor } from '@craftjs/core';
import { useRouter } from 'next/navigation';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { ComponentLibrary } from '@/components/editor/ComponentLibrary';
import { PropertyPanel } from '@/components/editor/PropertyPanel';
import { ComponentMapper } from '@/components/renderer/ComponentMapper';
import * as pagesApi from '@/lib/api/pages.api';
import { useAuth } from '@/lib/context/AuthContext';
import { toast } from 'sonner';
import { Container } from '@/components/builder-components/Container';
import { AIChat } from '@/components/AIChat';

interface PageProps {
    params: Promise<{ slug: string }>;
}

// Inner component to access CraftJS context
const EditorWrapper = ({ pageData, onSave, saving, slug }: { pageData: any, onSave: (query: any) => void, saving: boolean, slug: string }) => {
    const { query } = useEditor();

    return (
        <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
            <EditorToolbar onSave={() => onSave(query)} isSaving={saving} slug={slug} />

            <div className="flex flex-1 overflow-hidden h-full">
                <ComponentLibrary />

                <main className="flex-1 overflow-y-auto bg-gray-100 p-8 scrollbar-hide">
                    <div className="bg-white shadow-xl min-h-[800px] w-full max-w-5xl mx-auto rounded-lg overflow-hidden relative">
                        <Frame data={pageData?.jsonConfig?.ROOT ? JSON.stringify(pageData.jsonConfig) : undefined}>
                            <Element is={Container} canvas minHeight="800px" padding="40px">
                                {/* Components will be rendered here */}
                            </Element>
                        </Frame>
                    </div>
                </main>

                <PropertyPanel />
            </div>

            <AIChat />
        </div>
    );
};

export default function EditPage({ params }: PageProps) {
    const { slug } = use(params);
    const { user, isLoading: authLoading } = useAuth();
    const [pageData, setPageData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

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

        if (!authLoading && user) {
            fetchPage();
        }
    }, [slug, user, authLoading, router]);

    const handleSave = async (query: any) => {
        if (!pageData?._id) {
            toast.error('No page ID found to save');
            return;
        }

        setSaving(true);
        try {
            const json = query.serialize();
            await pagesApi.updatePage(pageData._id, { jsonConfig: JSON.parse(json) });
            toast.success('Page saved successfully');
        } catch (error) {
            console.error('Failed to save page:', error);
            toast.error('Failed to save page');
        } finally {
            setSaving(false);
        }
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-500 font-medium">Opening Editor...</p>
                </div>
            </div>
        );
    }

    if (!user || (user.role !== 'admin' && user.role !== 'editor' && user.role !== 'super-admin')) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-500 mb-6">You don't have permission to edit this page.</p>
                    <a href={`/${slug}`} className="text-blue-600 font-bold">View Public Page Instead</a>
                </div>
            </div>
        );
    }

    return (
        <Editor
            resolver={ComponentMapper}
            onRender={({ render }) => {
                return <div className="relative">{render}</div>;
            }}
        >
            <EditorWrapper pageData={pageData} onSave={handleSave} saving={saving} slug={slug} />
        </Editor>
    );
}
