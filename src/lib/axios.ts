import axios from "axios";

export default axios.create({
  baseURL: `${process.env.API_URL}/api`,
  withCredentials: true,
  headers: {
    Authorization: `bearer ${window.sessionStorage.getItem("token")}`,
  },
});
