import { httpRequestAddress } from "../utils/httpRequests";

httpRequestAddress.interceptors.request.use(
  async (config) => {
    const token = import.meta.env.VITE_ECOMMERCE_TOKEN_GHN;
    config.headers["Token"] = token;
    return config;
  },(error) => {
    return Promise.reject(error);
  }
);

export const getAddress = async (path, options = {}) => {
  const res = await httpRequestAddress.get(path, options);
  return res.data;
}