import {useCallback, useEffect, useState} from 'react';
import type {Product} from '../../data/models/Product';
import {fetchProductById} from '../../data/api/productsApi';

export function useProductDetail(productId: number) {
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    
    const loadProduct = useCallback(async (signal?: AbortSignal) => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await fetchProductById(productId, signal);

            if (!signal?.aborted) {
                setProduct(data);
            }
        } catch (error: unknown) {
            if (!signal?.aborted) {
            setError(
                error instanceof Error
                ? error.message
                : 'Unable to load product. Please try again.'
            );
            }
        } finally {
            if (!signal?.aborted) {
            setIsLoading(false);
            }
        }
    }, [productId]);

    useEffect(() => {
        const controller = new AbortController();

        void loadProduct(controller.signal);

        return () => {
            controller.abort();
        };
    }, [loadProduct, retryCount]);

    function retry() {
        setRetryCount((prevCount) => prevCount + 1);
    }

    return { product, isLoading, error, retry };
}