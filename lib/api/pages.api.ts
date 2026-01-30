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
