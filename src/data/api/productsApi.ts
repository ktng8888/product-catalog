import type { Product, ProductsResponse } from '../models/Product';

export async function fetchProducts(
    limit: number = 20,
    skip: number = 0,
    signal?: AbortSignal
): Promise<ProductsResponse> {
  const response = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`, { signal });
  
  if (!response.ok)
  {
    throw new Error('Request failed with status ' + response.status);
  }

  const data: ProductsResponse = await response.json();
  return data;
}

export async function fetchProductById(
    id: number,
    signal?: AbortSignal
): Promise<Product> {
    const response = await fetch(`https://dummyjson.com/products/${id}`,{ signal });

    if (!response.ok)
    {
        throw new Error('Request failed with status ' + response.status);
    }

    const data: Product = await response.json();
    return data;
}

export async function searchProducts(
    query: string,
    limit: number = 20,
    skip: number = 0,
    signal?: AbortSignal
): Promise<ProductsResponse> {
    const response = await fetch(
    `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`,
    { signal }
    );

    if (!response.ok) {
    throw new Error('Request failed with status ' + response.status);
    }

    const data: ProductsResponse = await response.json();
    return data;
}