export const API_BASE_URL = 'http://localhost:3004/api';

export const apiRoutes = {
  auth: {
    login: `${API_BASE_URL}/user/login`,
    profile: `${API_BASE_URL}/user/profile`,
    logout: `${API_BASE_URL}/user/logout`,
    refresh: `${API_BASE_URL}/user/refresh`,
  },
};
