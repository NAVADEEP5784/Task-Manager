import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL ||
  (window.location.port === '3000' ? 'http://localhost:5000/api' : '/api');

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (username, email, password) =>
    api.post('/auth/register', { username, email, password }),
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
};

export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  getUser: (userId) => api.get(`/users/${userId}`),
  getUsers: () => api.get('/users'),
  updateUser: (userId, data) => api.put(`/users/${userId}`, data),
};

export const projectsAPI = {
  getProjects: () => api.get('/projects'),
  getProject: (projectId) => api.get(`/projects/${projectId}`),
  createProject: (name, description) =>
    api.post('/projects', { name, description }),
  updateProject: (projectId, data) =>
    api.put(`/projects/${projectId}`, data),
  deleteProject: (projectId) => api.delete(`/projects/${projectId}`),
};

export const tasksAPI = {
  getProjectTasks: (projectId) =>
    api.get(`/tasks/project/${projectId}`),
  getTask: (taskId) => api.get(`/tasks/${taskId}`),
  createTask: (projectId, title, description, priority, dueDate) =>
    api.post('/tasks', {
      project_id: projectId,
      title,
      description,
      priority,
      due_date: dueDate,
    }),
  updateTask: (taskId, data) => api.put(`/tasks/${taskId}`, data),
  deleteTask: (taskId) => api.delete(`/tasks/${taskId}`),
};

export default api;
