
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:3000/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default api;

import axios from "axios";

/*
|--------------------------------------------------------------------------
| Central API Client
|--------------------------------------------------------------------------
|
| All frontend requests to the backend go through this Axios instance.
|
| Backend:
| http://localhost:3000
|
| API:
| http://localhost:3000/api
|
*/

const api = axios.create({
  // In development, proxy through Vite so requests share the page origin and
  // don't depend on the backend's fixed localhost:5173 CORS allowance.
  baseURL: import.meta.env.DEV ? "/api" : "http://localhost:3000/api",

  headers: {
    "Content-Type": "application/json",
  },
});

/*
|--------------------------------------------------------------------------
| Request Interceptor
|--------------------------------------------------------------------------
|
| If a JWT exists in localStorage, automatically attach it to requests.
|
| Result:
|
| Authorization: Bearer <token>
|
| This is required for protected backend routes.
|
*/

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/*
|--------------------------------------------------------------------------
| Response Interceptor
|--------------------------------------------------------------------------
|
| For now we keep this simple.
|
| Individual services/components can handle their own errors.
|
*/

api.interceptors.response.use(
  (response) => response,

  (error) => {
    return Promise.reject(error);
  }
);

export default api;
