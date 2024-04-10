import { httpRequestGoogle } from "../utils/httpRequests";

const getToken = async (path, data, option = {}) => {
  const res = await httpRequestGoogle.post(path, data, option)
  return res.data;
}

export { getToken }