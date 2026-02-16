import apiClient from './client';
import { Page, CreatePageData, UpdatePageData } from '../types/page.types';

export const getAllPages = async (): Promise<Page[]> => {
  const response = await apiClient.get('/pages');
  return response.data.data;
};

export const getPage = async (id: string): Promise<Page> => {
  const response = await apiClient.get(`/pages/${id}`);
  return response.data.data;
};

export const createPage = async (data: CreatePageData): Promise<Page> => {
  const response = await apiClient.post('/pages', data);
  return response.data.data;
};

export const updatePage = async (id: string, data: UpdatePageData): Promise<Page> => {
  const response = await apiClient.put(`/pages/${id}`, data);
  return response.data.data;
};

export const publishPage = async (id: string): Promise<Page> => {
  const response = await apiClient.post(`/pages/${id}/publish`);
  return response.data.data;
};

export const unpublishPage = async (id: string): Promise<Page> => {
  const response = await apiClient.post(`/pages/${id}/unpublish`);
  return response.data.data;
};

export const deletePage = async (id: string): Promise<void> => {
  await apiClient.delete(`/pages/${id}`);
};

export const duplicatePage = async (id: string, name: string, slug: string): Promise<Page> => {
  const response = await apiClient.post(`/pages/${id}/duplicate`, { name, slug });
  return response.data.data;
};

export const getPageBySlug = async (slug: string, institutionId: string): Promise<Page> => {
  const response = await apiClient.get(`/pages/slug/${slug}`, {
    headers: { 'x-institution-id': institutionId }
  });
  return response.data.data;
};

export const getPublishedPages = async (institutionId?: string): Promise<Page[]> => {
  const url = institutionId
    ? `/public/pages?institutionId=${institutionId}`
    : '/public/pages';
  const response = await apiClient.get(url);
  return response.data.data;
};

export const getPublishedPageBySlug = async (slug: string, institutionId?: string): Promise<Page> => {
  const url = institutionId
    ? `/public/pages/${slug}?institutionId=${institutionId}`
    : `/public/pages/${slug}`;
  const response = await apiClient.get(url);
  return response.data.data;
};
