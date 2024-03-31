import { httpRequestGoogle } from "../utils/httpRequests";

const getTokenInfo = async (path, data, option = {}) => {
  const res = await httpRequestGoogle.post(path, data, option)
  return res.data;
}

const refreshTokenGoogle = async (path, data, option = {}) => {
  const res = await httpRequestGoogle.post(path, data, option)
  return res.data;
}

export { getTokenInfo, refreshTokenGoogle }