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

import { generatePageHTML } from '@/lib/api/ai.api';

// Inner component to access CraftJS context
const EditorWrapper = ({ pageData, onSave, saving, slug, onUpdatePageData }: { 
    pageData: any, 
    onSave: (query: any) => void, 
    saving: boolean, 
    slug: string,
    onUpdatePageData: (data: any) => void
}) => {
    const { query } = useEditor();
    const [isGenerating, setIsGenerating] = useState(false);

    const handleAIGenerate = async (customPrompt?: string) => {
        let promptToUse = customPrompt;
        
        if (!promptToUse) {
            promptToUse = window.prompt("Describe the website/page you want to build in a single prompt (e.g., 'A modern engineering college home page with sections for research and admissions'):") || undefined;
        }
        
        if (!promptToUse) return;

        setIsGenerating(true);
        try {
            const result = await generatePageHTML(promptToUse);
            if (result.success) {
                onUpdatePageData({
                    ...pageData,
                    useHtml: true,
                    htmlContent: result.html
                });
                toast.success("AI successfully constructed your page!");
            }
        } catch (error) {
            console.error("AI Generation failed:", error);
            toast.error("Failed to generate page with AI");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
            <EditorToolbar 
                onSave={() => onSave(query)} 
                onAIGenerate={() => handleAIGenerate()} 
                isSaving={saving} 
                isGenerating={isGenerating}
                slug={slug} 
            />

            <div className="flex flex-1 overflow-hidden h-full">
                {!pageData?.useHtml && <ComponentLibrary />}

                <main className="flex-1 overflow-y-auto bg-gray-100 p-8 scrollbar-hide">
                    <div className="bg-white shadow-xl min-h-[800px] w-full max-w-5xl mx-auto rounded-lg overflow-hidden relative">
                        {pageData?.useHtml ? (
                            <div className="p-0 prose prose-slate max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: pageData.htmlContent }} />
                                <div className="absolute top-4 right-4 z-50">
                                    <button 
                                        onClick={() => onUpdatePageData({...pageData, useHtml: false})}
                                        className="bg-red-600 text-white text-[10px] font-black px-4 py-2 rounded-lg shadow-lg"
                                    >
                                        Back to Visual Editor
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Frame data={pageData?.jsonConfig?.ROOT ? JSON.stringify(pageData.jsonConfig) : undefined}>
                                <Element is={Container} canvas minHeight="800px" padding="40px">
                                    {/* Components will be rendered here */}
                                </Element>
                            </Frame>
                        )}
                    </div>
                </main>

                {!pageData?.useHtml && <PropertyPanel />}
            </div>

            <AIChat onFullBuild={handleAIGenerate} />
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
            await pagesApi.updatePage(pageData._id, { 
                jsonConfig: JSON.parse(json),
                htmlContent: pageData.htmlContent,
                useHtml: pageData.useHtml 
            });
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
            <EditorWrapper 
                pageData={pageData} 
                onSave={handleSave} 
                saving={saving} 
                slug={slug} 
                onUpdatePageData={setPageData}
            />
        </Editor>
    );
}
