import httpRequests from "../utils/httpRequests";

const getCouponProduct = async (path, options = {}) => {
  const res = await httpRequests.get(path, options);
  return res.data;
}

const applyCouponProduct = async (path, data, options = {}) => {
  const res = await httpRequests.post(path, data, options);
  return res.data;
}

export {
  getCouponProduct,
  applyCouponProduct
}