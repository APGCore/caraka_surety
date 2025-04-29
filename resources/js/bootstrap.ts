import axios from "axios";

window.axios = axios;

window.axios.defaults.withCredentials = true;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// import axios from "axios";
// import Cookies from "js-cookie";

// axios.defaults.withCredentials = true;
// axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// // Optional: Add this only if CSRF still not working
// axios.interceptors.request.use((config) => {
//   const token = Cookies.get("XSRF-TOKEN");
//   if (token) {
//     config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
//   }
//   return config;
// });
