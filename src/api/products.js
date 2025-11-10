const BASE_URL = 'https://fakestoreapi.com';

//  This function fetches all products from the fake store API
export async function getProducts() {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// This function fetches a single product by its ID from the fake store API
export async function getProduct(id) {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
}

// This function fetches product categories from the fake store API
export async function getProductsCategories() {
  try {
    const response = await fetch(`${BASE_URL}/products/categories`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products categories:', error);
    throw error;
  }
}

// This function creates product on fake store API
export async function createProduct(productData) {
  try {
    const response = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to create product:', error);
    return null;
  }
}
