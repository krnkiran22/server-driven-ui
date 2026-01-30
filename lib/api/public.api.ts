import axios from 'axios';

const publicClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

export const getPublishedPages = async (institutionId: string): Promise<any[]> => {
  const response = await publicClient.get('/public/pages', {
    params: { institutionId },
  });
  return response.data.data;
};

export const getPublishedPageBySlug = async (slug: string, institutionId: string): Promise<any> => {
  const response = await publicClient.get(`/public/pages/${slug}`, {
    params: { institutionId },
  });
  return response.data.data;
};
