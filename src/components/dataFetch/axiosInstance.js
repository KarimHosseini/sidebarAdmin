import axios from "axios";
import jwt_decode from "jwt-decode";
import { useEffect } from "react";
import { baseUrl } from "../../helpers/api-routes";

const baseURL = baseUrl;
let auth = localStorage.getItem("auth")
  ? JSON.parse(localStorage.getItem("auth"))
  : null;

const axiosInstance = axios.create({
  baseURL,
/*   headers: { Authorization: `Bearer ${auth?.token}` }, */
});
var loading = false;
axiosInstance.interceptors.request.use(async (req) => {
  return req;
  /* if (!auth) {
    auth = localStorage.getItem("auth")
      ? JSON.parse(localStorage.getItem("auth"))
      : null;
    req.headers.Authorization = `Bearer ${auth?.token}`;
  }

  var currentDateTime = new Date();
  var resultInSeconds = currentDateTime.getTime() / 1000;
  const user = jwt_decode(auth.token);
  const isExpired = user.exp <= resultInSeconds;


  if (!isExpired) return req;
  if (!loading) {
    const formData = new FormData();
    formData.append(
      "accessToken",
      JSON.parse(localStorage.getItem("auth"))?.token
    );
    formData.append(
      "refreshToken",
      localStorage.getItem("auth")
        ? JSON.parse(localStorage.getItem("auth"))?.refreshToken
        : null
    );
    loading = true;
    try {
      const response = await axios.post(`${baseURL}/v1/refreshToken`, formData);

      localStorage.setItem("auth", JSON.stringify(response.data));
      req.headers.Authorization = `Bearer ${response.data.token}`;
      loading = false;
      return req;
    } catch (e) {
      loading = true;
          localStorage.clear();
    document.location.href = "/";
      sessionStorage.setItem("loaded", false);
    }
  } */
});
export default axiosInstance;
