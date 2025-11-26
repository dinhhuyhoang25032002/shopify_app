import { useAppBridge } from "@shopify/app-bridge-react";
import { useState } from "react";

export function useFetchApi() {
    const shopify = useAppBridge();
    const [isLoading, setLoading] = useState(false)
    const handleFetchApi = async (endpoint, options = {}) => {
        const baseUrl = import.meta.env.VITE_URL_BACKEND;
        const fullUrl = endpoint.startsWith("/")
            ? `${baseUrl}${endpoint}`
            : `${baseUrl}/${endpoint}`;
        try {
            setLoading(true)
            const token = await shopify.idToken();
            const res = await fetch(fullUrl, {
                ...options,
                headers: {
                    ...(options.headers || {}),
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true',
                    "Content-Type": "application/json",
                },
            })
            if (!res.ok) {
                const data = await res.json()
                shopify.toast.show(data.message || 'Something went wrong')
                throw new Error(`${data.message}`)
            }
            if (res.status === 401) {
                console.warn("Token expired → refetching...");
                throw new Error("UNAUTHORIZED");
            }
            let payload;
            try {
                payload = await res.json();
            } catch {
                payload = null;
                console.log('error from fetch api');
            }

            return payload;
        } catch (error) {
            throw error
        }
        finally {
            setLoading(false)
        }
    }
    return { handleFetchApi, isLoading };
}