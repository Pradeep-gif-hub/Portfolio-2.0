// API utility functions for making authenticated requests

const API_URL = import.meta.env.VITE_API_URL || '/api';
const IS_DEVELOPMENT = import.meta.env.DEV;

// Get auth token from sessionStorage
const getAuthToken = (): string | null => {
  return sessionStorage.getItem('admin_token');
};

// Mock data for development mode
const mockData: { [key: string]: any[] } = {
  blogs: [],
  projects: [],
  experience: [],
  certifications: []
};

// Generic fetch wrapper with auth
async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  // In development mode, use mock data only when there's no admin token
  // This lets the admin UI use the real backend (MongoDB) when signed in.
  if (IS_DEVELOPMENT) {
    const token = getAuthToken();
    if (!token) {
      return handleDevRequest(endpoint, options);
    }
    // if token exists, fall through to real API behavior so admin CRUD works
  }

  // Production mode: use real API
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 401) {
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_expiry');
    window.location.href = '/admin/login';
  }

  return response;
}

// Development mode request handler with mock data
function handleDevRequest(endpoint: string, options: RequestInit): Promise<Response> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const method = options.method || 'GET';
      const body = options.body ? JSON.parse(options.body as string) : null;
      
      // Parse endpoint
      const [path, queryString] = endpoint.split('?');
      const pathParts = path.split('/').filter(Boolean);
      
      // Determine resource type (blogs, projects, experience, certifications)
      let resource = pathParts[pathParts.length - 1];
      if (!mockData[resource]) resource = 'blogs';
      
      let responseData: any;
      let status = 200;
      
      if (method === 'GET') {
        if (queryString) {
          // Get single item by ID or slug
          const params = new URLSearchParams(queryString);
          const id = params.get('id') || params.get('slug');
          responseData = mockData[resource].find((item: any) => 
            item._id === id || item.slug === id
          ) || null;
          if (!responseData) status = 404;
        } else {
          // Get all items
          responseData = mockData[resource];
        }
      } else if (method === 'POST') {
        // Create new item
        const newItem = {
          _id: Date.now().toString(),
          ...body,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        mockData[resource].push(newItem);
        responseData = newItem;
        status = 201;
      } else if (method === 'PUT') {
        // Update item
        const index = mockData[resource].findIndex((item: any) => item._id === body.id);
        if (index >= 0) {
          mockData[resource][index] = {
            ...mockData[resource][index],
            ...body,
            updatedAt: new Date().toISOString()
          };
          responseData = mockData[resource][index];
        } else {
          status = 404;
          responseData = { error: 'Not found' };
        }
      } else if (method === 'DELETE') {
        // Delete item
        const params = new URLSearchParams(queryString || '');
        const id = params.get('id');
        const index = mockData[resource].findIndex((item: any) => item._id === id);
        if (index >= 0) {
          mockData[resource].splice(index, 1);
          responseData = { success: true };
        } else {
          status = 404;
          responseData = { error: 'Not found' };
        }
      }
      
      resolve(new Response(JSON.stringify(responseData), {
        status,
        headers: { 'Content-Type': 'application/json' }
      }));
    }, 300); // Simulate network delay
  });
}

// Blog API functions
export const blogApi = {
  // Get all blogs
  getAll: async () => {
    const response = await fetchWithAuth('/admin/content?type=blogs');
    if (!response.ok) {
      throw new Error('Failed to fetch blogs: ' + response.status);
    }
    const data = await response.json();
    return data.data || data;
  },

  // Create new blog
  create: async (blog: any) => {
    const response = await fetchWithAuth('/admin/content?type=blogs', {
      method: 'POST',
      body: JSON.stringify(blog),
    });
    if (!response.ok) throw new Error('Failed to create blog');
    return response.json();
  },

  // Update blog
  update: async (id: string, updates: any) => {
    const response = await fetchWithAuth('/admin/content?type=blogs', {
      method: 'PUT',
      body: JSON.stringify({ id, ...updates }),
    });
    if (!response.ok) throw new Error('Failed to update blog');
    return response.json();
  },

  // Delete blog
  delete: async (id: string) => {
    const response = await fetchWithAuth(`/admin/content?type=blogs&id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete blog');
    return response.json();
  },
};

// Project API functions
export const projectApi = {
  getAll: async () => {
    const response = await fetchWithAuth('/admin/content?type=projects');
    if (!response.ok) throw new Error('Failed to fetch projects');
    const result = await response.json();
    return result.data || result;
  },

  create: async (project: any) => {
    const response = await fetchWithAuth('/admin/content?type=projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
    if (!response.ok) throw new Error('Failed to create project');
    const result = await response.json();
    return result.data || result;
  },

  update: async (id: string, updates: any) => {
    const response = await fetchWithAuth('/admin/content?type=projects', {
      method: 'PUT',
      body: JSON.stringify({ id, ...updates }),
    });
    if (!response.ok) throw new Error('Failed to update project');
    const result = await response.json();
    return result.data || result;
  },

  delete: async (id: string) => {
    const response = await fetchWithAuth(`/admin/content?type=projects&id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete project');
    const result = await response.json();
    return result.data || result;
  },
};

// Experience API functions
export const experienceApi = {
  getAll: async () => {
    const response = await fetchWithAuth('/admin/content?type=experience');
    if (!response.ok) throw new Error('Failed to fetch experience');
    const result = await response.json();
    return result.data || result;
  },

  create: async (experience: any) => {
    const response = await fetchWithAuth('/admin/content?type=experience', {
      method: 'POST',
      body: JSON.stringify(experience),
    });
    if (!response.ok) throw new Error('Failed to create experience');
    const result = await response.json();
    return result.data || result;
  },

  update: async (id: string, updates: any) => {
    const response = await fetchWithAuth('/admin/content?type=experience', {
      method: 'PUT',
      body: JSON.stringify({ id, ...updates }),
    });
    if (!response.ok) throw new Error('Failed to update experience');
    const result = await response.json();
    return result.data || result;
  },

  delete: async (id: string) => {
    const response = await fetchWithAuth(`/admin/content?type=experience&id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete experience');
    const result = await response.json();
    return result.data || result;
  },
};

// Certification API functions
export const certificationApi = {
  getAll: async () => {
    const response = await fetchWithAuth('/admin/content?type=certifications');
    if (!response.ok) throw new Error('Failed to fetch certifications');
    const result = await response.json();
    return result.data || result;
  },

  create: async (certification: any) => {
    const response = await fetchWithAuth('/admin/content?type=certifications', {
      method: 'POST',
      body: JSON.stringify(certification),
    });
    if (!response.ok) throw new Error('Failed to create certification');
    const result = await response.json();
    return result.data || result;
  },

  update: async (id: string, updates: any) => {
    const response = await fetchWithAuth('/admin/content?type=certifications', {
      method: 'PUT',
      body: JSON.stringify({ id, ...updates }),
    });
    if (!response.ok) throw new Error('Failed to update certification');
    const result = await response.json();
    return result.data || result;
  },

  delete: async (id: string) => {
    const response = await fetchWithAuth(`/admin/content?type=certifications&id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete certification');
    const result = await response.json();
    return result.data || result;
  },
};

// Public API functions (no auth required)
export const fetchExperiences = async () => {
  const response = await fetch(`${API_URL}/public-data?type=experience`);
  if (!response.ok) throw new Error('Failed to fetch experiences');
  const result = await response.json();
  return result.data || result;
};

export const fetchBlogs = async () => {
  const response = await fetch(`${API_URL}/public-data?type=blogs`);
  if (!response.ok) throw new Error('Failed to fetch blogs');
  const result = await response.json();
  return result.data || result;
};

export const fetchProjects = async () => {
  const response = await fetch(`${API_URL}/public-data?type=projects`);
  if (!response.ok) throw new Error('Failed to fetch projects');
  const result = await response.json();
  return result.data || result;
};

export const fetchCertifications = async () => {
  const response = await fetch(`${API_URL}/public-data?type=certifications`);
  if (!response.ok) throw new Error('Failed to fetch certifications');
  const result = await response.json();
  return result.data || result;
};
