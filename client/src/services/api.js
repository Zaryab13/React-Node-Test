import axios from "axios";
import { constant } from "../constant";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const api = axios.create({
  baseURL: `${BASE_URL}/`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // Make sure token includes 'Bearer '
    config.headers.Authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor to handle 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect to login
      window.location.href = "/auth/sign-in";
    }
    return Promise.reject(error);
  }
);

export const postApi = async (url, data) => {
  try {
    const response = await api.post(url, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putApi = async (path, data) => {
  try {
    const result = await api.put(path, data);
    return result;
  } catch (error) {
    throw error;
  }
};

export const deleteApi = async (path, param) => {
  try {
    const result = await api.delete(`${path}${param}`);
    return result;
  } catch (error) {
    throw error;
  }
};

export const deleteManyApi = async (path, data) => {
  try {
    let result = await axios.post(constant.baseUrl + path, data, {
      headers: {
        Authorization:
          localStorage.getItem("token") || sessionStorage.getItem("token"),
      },
    });
    if (result.data?.token && result.data?.token !== null) {
      localStorage.setItem("token", result.data?.token);
    }
    return result;
  } catch (e) {
    console.error(e);
    return e;
  }
};

export const getApi = async (path, id) => {
  try {
    const url = id ? `${path}${id}` : path;
    const response = await api.get(url);
    
    // Ensure response.data is an array for table endpoints
    if (path.includes('table') || path.includes('list')) {
      return {
        ...response,
        data: Array.isArray(response.data) ? response.data : []
      };
    }
    
    return response;
  } catch (error) {
    console.error(`API Error (${path}):`, error);
    throw error;
  }
};
