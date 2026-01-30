import apiClient from './client';

export const processCommand = async (command: string, context?: any): Promise<any> => {
  const response = await apiClient.post('/ai/command', { command, context });
  return response.data.data;
};

export const generateContent = async (type: string, params: any): Promise<{ content: string }> => {
  const response = await apiClient.post('/ai/generate-content', { type, params });
  return response.data.data;
};

export const getSuggestions = async (pageJSON: any): Promise<any[]> => {
  const response = await apiClient.post('/ai/suggest', { pageJSON });
  return response.data.data;
};

export const validateDesign = async (pageJSON: any): Promise<{ isValid: boolean; issues: any[] }> => {
  const response = await apiClient.post('/ai/validate', { pageJSON });
  return response.data.data;
};
