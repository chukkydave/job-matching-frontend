import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

interface UseApiOptions {
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
    successMessage?: string;
}

export const useApi = <T = unknown>(options: UseApiOptions = {}) => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        showSuccessToast = true,
        showErrorToast = true,
        successMessage = 'Operation completed successfully',
    } = options;

    const execute = useCallback(async (
        apiCall: () => Promise<Response>,
        onSuccess?: (data: T) => void,
        onError?: (error: string) => void
    ) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await apiCall();
            const responseData = await response.json();

            if (response.ok) {
                setData(responseData);
                if (showSuccessToast) {
                    toast.success(responseData.message || successMessage);
                }
                onSuccess?.(responseData);
            } else {
                const errorMessage = responseData.message || 'An error occurred';
                setError(errorMessage);
                if (showErrorToast) {
                    toast.error(errorMessage);
                }
                onError?.(errorMessage);
            }
        } catch (err) {
            const errorMessage = 'Network error. Please try again.';
            setError(errorMessage);
            if (showErrorToast) {
                toast.error(errorMessage);
            }
            onError?.(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [showSuccessToast, showErrorToast, successMessage]);

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setIsLoading(false);
    }, []);

    return {
        data,
        isLoading,
        error,
        execute,
        reset,
    };
};
