import apiClient from './client';

export const getInstitutions = async (): Promise<any[]> => {
    const response = await apiClient.get('/public/institutions');
    return response.data.data;
};
