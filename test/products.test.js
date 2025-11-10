import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getProducts,
  getProduct,
  getProductsCategories,
  createProduct,
} from '../src/api/products.js';

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

describe('POST products API tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('POST product', () => {
    let mockNewProductInput;
    let mockNewProductResponse;
    let mockPostSuccess;
    let mockPostFailure;

    beforeEach(() => {
      mockNewProductInput = {
        title: 'Super Test Gadget',
        price: 999.99,
        description: 'A revolutionary device.',
        image: 'https://i.pravatar.cc/150',
        category: 'electronics',
      };

      mockNewProductResponse = {
        ...mockNewProductInput,
        id: 21,
      };

      mockPostSuccess = () => {
        return global.fetch.mockResolvedValue({
          ok: true,
          json: async () => mockNewProductResponse,
        });
      };

      mockPostFailure = (status = 400) => {
        return global.fetch.mockResolvedValue({
          ok: false,
          status: status,
          json: async () => ({ message: 'Validation failed' }),
        });
      };
    });

    it('hould successfully create a new product and return the object with an ID', async () => {
      const productData = mockNewProductInput;
      mockPostSuccess();

      const createdProduct = await createProduct(productData);

      expect(global.fetch).toHaveBeenCalledWith('https://fakestoreapi.com/products', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(productData),
      });
      expect(createdProduct).toEqual(mockNewProductResponse);
      expect(createdProduct).toHaveProperty('id');
    });

    it('should throw an error when creating product fails', async () => {
      const productData = { title: 'Missing Price Data' };
      mockPostFailure(400);

      const createdProduct = await createProduct(productData);

      expect(createdProduct).toBeNull();
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});
