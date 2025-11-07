import { useAppBridge } from "@shopify/app-bridge-react";

export function useFetchApi() {
    const shopify = useAppBridge();
    const handleFetchApi = async (endpoint, options = {}) => {
        const baseUrl = import.meta.env.VITE_URL_BACKEND;
        const fullUrl = endpoint.startsWith("/")
            ? `${baseUrl}${endpoint}`
            : `${baseUrl}/${endpoint}`;
        const token = await shopify.idToken();
        const res = await fetch(fullUrl, {
            ...options,
            headers: {
                ...(options.headers || {}),
                'Authorization': `Bearer ${token}`,
                'ngrok-skip-browser-warning': 'true'
            },
        })
        if (!res.ok) {
            throw new Error(`Fetch failed with status: ${res.status}`);
        }

        let payload;
        try {
            payload = await res.json();
        } catch {
            payload = null;
            console.log('error from fetch api');
        }

        return payload;
    }
    return { handleFetchApi };
}