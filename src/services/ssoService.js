import { httpRequestSso } from "../utils/httpRequests";

const postAuth = async (path, data = {}, options = {}) => {
  const res = await httpRequestSso.post(path, data, options)
  return res;
}
const getRefreshToken = async (path, options = {}) => {
  const res = await httpRequestSso.get(path, options);
  return res;
}

export { postAuth, getRefreshToken }