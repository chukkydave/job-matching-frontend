// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => {
    return `${API_BASE_URL}${endpoint}`;
};

// Environment configuration
export const config = {
    api: {
        baseUrl: API_BASE_URL,
    },
    app: {
        name: 'Instollar Jobs',
        version: '1.0.0',
    },
};
