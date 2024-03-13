import httpRequests from "../utils/httpRequests";

const getListUserAddress = async (path, options = {}) => {
  const res = await httpRequests.get(path, options);
  return res;
}

const postUserAddress = async (path, data, options = {}) => {
  const res = await httpRequests.post(path, data, options);
  return res;
}

const deleteUserAddress = async (path, options = {}) => {
  const res = await httpRequests.delete(path, options);
  return res;
}

const updateUserAddress = async (path, data, options = {}) => {
  const res = await httpRequests.put(path, data, options);
  return res;
}

export {
  getListUserAddress,
  postUserAddress,
  deleteUserAddress,
  updateUserAddress,
}