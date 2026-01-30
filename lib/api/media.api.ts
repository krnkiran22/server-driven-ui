import apiClient from './client';
import { Media } from '../types/media.types';

export const uploadMedia = async (file: File): Promise<Media> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/media/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};

export const getAllMedia = async (): Promise<Media[]> => {
  const response = await apiClient.get('/media');
  return response.data.data;
};

export const deleteMedia = async (id: string): Promise<void> => {
  await apiClient.delete(`/media/${id}`);
};
