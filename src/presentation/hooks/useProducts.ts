import {useCallback, useEffect, useState, useRef} from 'react';
import type {Product} from '../../data/models/Product';
import {fetchProducts,searchProducts} from '../../data/api/productsApi';

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

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [refreshError, setRefreshError] = useState<string | null>(null);
    const refreshController = useRef<AbortController | null>(null);

    const loadProducts = useCallback(async (signal?: AbortSignal) => {
        setIsLoading(true);
        setError(null);
        setIsLoadingMore(false);
        setLoadMoreError(null);
        setProducts([]);
        setTotal(0);
        setIsRefreshing(false);
        setRefreshError(null);

        try {
            const data = debouncedQuery 
            ? await searchProducts(debouncedQuery, 20, 0, signal) 
            : await fetchProducts(20, 0, signal);

            if (!signal?.aborted) {
                setProducts(data.products);
                setTotal(data.total);
            }
        } catch (error: unknown) {
            if (!signal?.aborted) {
                if (__DEV__) {
                    console.log('Failed to load products:', error);
                }

                setError('Unable to load products. Please try again.');
            }
        } finally {
            if (!signal?.aborted) {
            setIsLoading(false);
            }
        }
    }, [debouncedQuery]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedQuery(searchQuery.trim());
        }, 400);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [searchQuery]);

    useEffect(() => {
        const controller = new AbortController();

        void loadProducts(controller.signal);

        return () => {
            controller.abort();

            loadMoreController.current?.abort();
            loadMoreController.current = null;

            refreshController.current?.abort();
            refreshController.current = null;
        };
    }, [loadProducts, retryCount]);

    function retry() {
        setRetryCount((prevCount) => prevCount + 1);
    }

    async function loadMore() {
        if (
            searchQuery.trim() !== debouncedQuery ||
            isLoading ||
            error !== null ||
            !hasMore ||
            loadMoreController.current !== null ||
            isRefreshing ||
            refreshController.current !== null
        ) {
            return;
        }

        const controller = new AbortController();
        loadMoreController.current = controller;

        setIsLoadingMore(true);
        setLoadMoreError(null);

        try{
            const data = debouncedQuery
                ? await searchProducts(debouncedQuery, 20, products.length, controller.signal)
                : await fetchProducts(20, products.length, controller.signal);

            if (!controller.signal.aborted) {
                setProducts((prevProducts) => [...prevProducts, ...data.products]);
                setTotal(data.total);
            }
        }catch(error: unknown){
            if (!controller.signal.aborted) {
                if (__DEV__) {
                    console.log('Failed to load more products:', error);
                }

                setLoadMoreError('Unable to load more products. Please try again.');
            }
        }finally{
            if (!controller.signal.aborted) {
                setIsLoadingMore(false);
                loadMoreController.current = null;
            }
        }
   }

   async function refresh() {
        if (
            isLoading ||
            error !== null ||
            searchQuery.trim() !== debouncedQuery ||
            refreshController.current !== null
        ) {
            return;
        }

        loadMoreController.current?.abort();
        loadMoreController.current = null;
        setIsLoadingMore(false);
        setLoadMoreError(null);

        const controller = new AbortController();
        refreshController.current = controller;

        setIsRefreshing(true);
        setRefreshError(null);

        try {
            const data = debouncedQuery
            ? await searchProducts(debouncedQuery, 20, 0, controller.signal)
            : await fetchProducts(20, 0, controller.signal);

            if (!controller.signal.aborted) {
            setProducts(data.products);
            setTotal(data.total);
            }
        } catch (error: unknown) {
            if (!controller.signal.aborted) {
                if (__DEV__) {
                    console.log('Failed to refresh products:', error);
                }

                setRefreshError('Unable to refresh. Please try again.');
            }
        } finally {
            if (refreshController.current === controller) {
            refreshController.current = null;
            setIsRefreshing(false);
            }
        }
    }

    return { 
        products, 
        isLoading, 
        error, 
        retry, 
        loadMore, 
        hasMore, 
        isLoadingMore, 
        loadMoreError, 
        searchQuery, 
        setSearchQuery, 
        isRefreshing, 
        refresh, 
        refreshError 
    };
}