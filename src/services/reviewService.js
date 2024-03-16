import httpRequests from "../utils/httpRequests";

const postReivew = async (path, data, options = {}) => {
  const res = await httpRequests.post(path, data, options);
  return res.data;
}

const getReivews = async (path, options = {}) => {
  const res = await httpRequests.get(path, options);
  return res.data;
}

export { getReivews, postReivew } 