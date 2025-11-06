import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getProducts, getProduct, getProductsCategories } from '../src/api/products.js';

global.fetch = vi.fn();

describe('GET products API tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('GET Products', () => {
    let mockProducts;

    beforeEach(() => {
      mockProducts = [
        { id: 1, title: 'Product 1', price: 100 },
        { id: 2, title: 'Product 2', price: 200 },
      ];
    });

    it('should successfully return an array of products on a 200 OK response', async () => {
      fetch.mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue(mockProducts),
      });

      const products = await getProducts();

      expect(fetch).toHaveBeenCalledWith('https://fakestoreapi.com/products');
      expect(products).toEqual(mockProducts);
      expect(Array.isArray(products)).toBe(true);
      expect(products[0]).toHaveProperty('id');
      expect(products[0]).toHaveProperty('title');
      expect(products[0]).toHaveProperty('price');
    });

    it('should throw an error when the fetch call fails', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(getProducts()).rejects.toThrow('Network error');
    });
  });

  describe('GET Product', () => {
    let productId;
    let mockProduct;

    beforeEach(() => {
      productId = 1;
      mockProduct = { id: productId, title: 'Product 1', price: 100, category: 'electronics' };
    });

    it('should fetch a single product by ID', async () => {
      fetch.mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue(mockProduct),
      });

      const product = await getProduct(productId);

      expect(fetch).toHaveBeenCalledWith(`https://fakestoreapi.com/products/${productId}`);
      expect(product).toEqual(mockProduct);
      expect(product).toHaveProperty('id', productId);
      expect(product).toHaveProperty('title');
      expect(product).toHaveProperty('price');
    });

    it('should throw an error when fetching a product by ID fails', async () => {
      const productId = 999;
      fetch.mockRejectedValueOnce(new Error('Product not found'));

      await expect(getProduct(productId)).rejects.toThrow('Product not found');
    });
  });

  describe('GET Products Categories', () => {
    let mockCategories;

    beforeEach(() => {
      mockCategories = ['electronics', 'jewelery', "men's clothing", "women's clothing"];
    });

    it('should return a list of product categories when successful', async () => {
      fetch.mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue(mockCategories),
      });

      const categories = await getProductsCategories();

      expect(fetch).toHaveBeenCalledWith('https://fakestoreapi.com/products/categories');
      expect(categories).toEqual(mockCategories);
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
      expect(typeof categories[0]).toBe('string');
    });

    it('should throw an error when fetching categories fails', async () => {
      fetch.mockRejectedValueOnce(new Error('Failed to fetch categories'));

      await expect(getProductsCategories()).rejects.toThrow('Failed to fetch categories');
    });
  });
});
