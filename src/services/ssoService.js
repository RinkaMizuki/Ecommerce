import { httpRequestSso } from "../utils/httpRequests";

const post = async (path, data = {}, options = {}) => {
  const res = await httpRequestSso.post(path, data, options)
  return res;
}
const get = async (path, options = {}) => {
  const res = await httpRequestSso.get(path, options);
  return res;
}

const remove = async (path, options = {}) => {
  const res = await httpRequestSso.delete(path, options);
  return res;
}

export { post, get, remove }