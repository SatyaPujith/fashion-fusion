// frontend/api.ts
const API_URL = 'http://localhost:5000/api';

export const login = async (username: string, password: string) => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};

export const register = async (username: string, password: string) => {
  const response = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};

export const createPost = async (content: string, image: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token || '',
    },
    body: JSON.stringify({ content, image }),
  });
  if (!response.ok) {
    throw new Error('Failed to create post');
  }
  return response.json();
};

export const getPosts = async () => {
  const response = await fetch(`${API_URL}/posts`);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
};