import axios from "axios";
import Cookies from "js-cookie";

window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// Use custom XSRF token name
const csrfCookieName = import.meta.env.VITE_SESSION_XSRF_TOKEN;
const csrf = Cookies.get(csrfCookieName);

if (csrf) {
  window.axios.defaults.headers.common["X-XSRF-TOKEN"] = csrf;
}
