import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
  config: AxiosRequestConfig;
}[] = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      resolve(api(config)); // replay the request
    }
  });

  failedQueue = [];
};

const api: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  withCredentials: true, // 🚨 required for sending cookies
});

// No Authorization headers needed since tokens are in cookies
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Handle 401s by triggering refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call your refresh endpoint — it will read the refresh token from cookies
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
          withCredentials: true,
        });

        processQueue(null);

        return api(originalRequest);
      } catch (err) {
        processQueue(err as AxiosError);
        // Redirect to login page if refresh fails
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
