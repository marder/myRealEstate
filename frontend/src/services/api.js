const API_URL = import.meta.env.VITE_API_URL || '/api';
export const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || '/uploads';

export const getFrontpageData = async () => {
  try {
    const response = await fetch(`${API_URL}/frontpage`);
    if (!response.ok) {
      throw new Error('Failed to fetch frontpage data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching frontpage data:', error);
    return null;
  }
};

export const getPageData = async (slug) => {
  try {
    const response = await fetch(`${API_URL}/pages/${slug}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch page data');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching page data for ${slug}:`, error);
    return null;
  }
};

export const getBlogPosts = async () => {
  try {
    const response = await fetch(`${API_URL}/posts`);
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};

export const getPaginatedBlogPosts = async (page = 1, limit = 6) => {
  try {
    const response = await fetch(`${API_URL}/posts/pages?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch paginated blog posts');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching paginated blog posts:', error);
    return { results: [], totalPages: 0 };
  }
};

export const getBlogPostById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/posts/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch blog post');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
};

export const getOrderStatus = async (orderNumber) => {
  try {
    const response = await fetch(`${API_URL}/order-status/${encodeURIComponent(orderNumber)}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch order status');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching order status:', error);
    return null;
  }
};

export const getProperties = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/properties/list?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
};

export const getPropertyById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/properties/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch property');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching property ${id}:`, error);
    return null;
  }
};

export const getStats = async () => {
  try {
    const response = await fetch(`${API_URL}/properties/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
};
