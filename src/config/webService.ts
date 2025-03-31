import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { debounce, get } from 'lodash';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const debouncedToastInfo = debounce(toast.info, 250);
const debouncedToastError = debounce(toast.error, 250);

// Set Base URL and Defaults
axios.defaults.baseURL = import.meta.env.VITE_WS_BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Request Interceptor
axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = Cookies.get('token');

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Response Interceptor
axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const errorMessage: any = get(error, 'response.data.errors[0].message') || get(error, 'response.data.message');
    const errorCode = error?.response?.status;

    if (['Token expired.', 'Token has expired.'].includes(errorMessage)) {
      debouncedToastInfo('Please re-login to continue.');
      Cookies.remove('auth_status');
      Cookies.remove('token');
      Cookies.remove('role');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (errorCode === 400) {
      debouncedToastError(errorMessage || 'Bad Request!');
    } else if (errorCode === 401) {
      debouncedToastError(errorMessage || 'Unauthorized');
      Cookies.remove('auth_status');
      Cookies.remove('token');
      Cookies.remove('role');
      window.location.href = '/login';
    } else if (errorCode === 422) {
      debouncedToastError(errorMessage || 'Unprocessable Entity!');
    } else if (errorCode === 500) {
      debouncedToastError('Internal Server Error!');
    } else {
      debouncedToastError('Unable to connect to web service');
    }

    return Promise.reject(error);
  }
);
