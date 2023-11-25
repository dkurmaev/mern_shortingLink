import { useState, useCallback } from "react";


export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true);

        try {
            if (body) {
                body = JSON.stringify(body);
                headers['Content-Type'] = 'application/json';
            }

            const response = await Promise.race([
                fetch(url, { method, body, headers }),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Request timeout')), 10000) // Установите таймаут (в миллисекундах)
                ),
            ]);

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Server error:', errorData);
                throw new Error(errorData || 'Something went wrong');
            }

            const data = await response.json();
            setLoading(false);
            return data;
        } catch (e) {
            setLoading(false);
            setError(e.message);
            throw e;
        }
    }, []);


    const clearError = useCallback(() => setError(null), []);

    return { loading, request, error, clearError };
};
