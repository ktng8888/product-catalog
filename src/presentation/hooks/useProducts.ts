import {useCallback, useEffect, useState} from 'react';
import type {Product} from '../../data/models/Product';
import {fetchProducts} from '../../data/api/productsApi';

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProducts = useCallback(async (signal?: AbortSignal) => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await fetchProducts(20, 0, signal);

            if (!signal?.aborted) {
                setProducts(data.products);
            }
        } catch (error: unknown) {
            if (!signal?.aborted) {
            setError(
                error instanceof Error
                ? error.message
                : 'Unable to load products. Please try again.'
            );
            }
        } finally {
            if (!signal?.aborted) {
            setIsLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        void loadProducts(controller.signal);

        return () => {
            controller.abort();
        };
    }, [loadProducts]);

    return { products, isLoading, error };
}