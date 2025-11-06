import { describe, expect, it } from 'vitest';
import { getProducts, getProduct, getProductsCategories } from '../src/api/products.js';

describe('GET products API tests', () => {
  it('should fetch all products', async () => {
    const products = await getProducts();
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toHaveProperty('id');
    expect(products[0]).toHaveProperty('title');
    expect(products[0]).toHaveProperty('price');
  });

  it('should fetch a single product by ID', async () => {
    const productId = 1;
    const product = await getProduct(productId);
    expect(product).toBeDefined();
    expect(typeof product).toBe('object');
    expect(Array.isArray(product)).toBe(false);
    expect(product.id).toBe(productId);
    expect(product).toHaveProperty('title');
    expect(product).toHaveProperty('category');
    expect(product).toHaveProperty('image');
  });

  it('should fetch product categories', async () => {
    const categories = await getProductsCategories();
    expect(categories).toBeDefined();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    expect(typeof categories[0]).toBe('string');
  });
});
