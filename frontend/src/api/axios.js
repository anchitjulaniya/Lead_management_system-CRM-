import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000"
});

// attach token automatically to every request
API.interceptors.request.use((req) => {

  const token = sessionStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;

});


API.interceptors.response.use(

  (res) => res,

  (err) => {

    if (err.response?.status === 401) {

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      window.location.href = "/login";

    }

    return Promise.reject(err);

  }

);

export default API;