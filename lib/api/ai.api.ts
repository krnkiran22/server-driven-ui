import apiClient from './client';

export const processCommand = async (command: string, context?: any): Promise<any> => {
  const response = await apiClient.post('/ai/command', { command, context });
  return response.data;
};

export const generateContent = async (type: string, params: any): Promise<any> => {
  const response = await apiClient.post('/ai/generate-content', { type, params });
  return response.data;
};

export const getSuggestions = async (pageJSON: any): Promise<any> => {
  const response = await apiClient.post('/ai/suggest', { pageJSON });
  return response.data;
};

export const validateDesign = async (pageJSON: any): Promise<any> => {
  const response = await apiClient.post('/ai/validate', { pageJSON });
  return response.data;
};

export const generateComponent = async (prompt: string): Promise<any> => {
  const response = await apiClient.post('/ai/generate-component', { prompt });
  return response.data;
};

export const getCustomComponents = async (): Promise<any> => {
  const response = await apiClient.get('/ai/custom-components');
  return response.data;
};
