import {useCallback, useEffect, useState, useRef} from 'react';
import type {Product} from '../../data/models/Product';
import {fetchProducts} from '../../data/api/productsApi';

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    const [total, setTotal] = useState(0);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
    
    const hasMore = products.length < total;
    
    const loadMoreController = useRef<AbortController | null>(null);

    const loadProducts = useCallback(async (signal?: AbortSignal) => {
        setIsLoading(true);
        setError(null);
        setIsLoadingMore(false);
        setLoadMoreError(null);

        try {
            const data = await fetchProducts(20, 0, signal);

            if (!signal?.aborted) {
                setProducts(data.products);
                setTotal(data.total);
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
            loadMoreController.current?.abort();
            loadMoreController.current = null;
        };
    }, [loadProducts, retryCount]);

    function retry() {
        setRetryCount((prevCount) => prevCount + 1);
    }

    async function loadMore() {
        if (
            isLoading ||
            error !== null ||
            !hasMore ||
            loadMoreController.current !== null
        ) {
            return;
        }

        const controller = new AbortController();
        loadMoreController.current = controller;

        setIsLoadingMore(true);
        setLoadMoreError(null);

        try{
            const data = await fetchProducts(20, products.length, controller.signal);
            if (!controller.signal.aborted) {
                setProducts((prevProducts) => [...prevProducts, ...data.products]);
                setTotal(data.total);
            }
        }catch(error: unknown){
            if (!controller.signal.aborted) {
                setLoadMoreError(
                    error instanceof Error
                        ? error.message
                        : 'Unable to load more products. Please try again.'
                );
            }
        }finally{
            if (!controller.signal.aborted) {
                setIsLoadingMore(false);
                loadMoreController.current = null;
            }
        }
   }

    return { products, isLoading, error, retry, loadMore, hasMore, isLoadingMore, loadMoreError };
}