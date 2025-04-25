import axios from "axios";

window.axios = axios;

window.axios.defaults.withCredentials = true

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

const token = document.head.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;

if (token) {
  axios.defaults.headers.common["X-CSRF-TOKEN"] = token.content;
}
