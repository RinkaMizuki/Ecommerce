import httpRequests from "../utils/httpRequests";
import tokenService from "../services/tokenService"

const useCustomFetch = () => {

  const refreshToken = async () => {
    try {
      const res = await httpRequests.post(`/Auth/refresh-token`);
      return res;
    } catch (error) {
      return error;
    }
  }
  //nếu có token thì trước khi request sẽ đính kèm vào headers
  httpRequests.interceptors.request.use(
    async (config) => {
      const token = tokenService.getLocalAccessToken()?.token;
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    }
  )

  //nếu response trả về có lỗi và nếu lỗi là do unauthorize thì gửi một request yêu cầu refresh token sau khi có token sẽ thực hiện lại request origin với token mới.
  httpRequests.interceptors.response.use(
    (response) => {
      return response;
    },
    async function (error) {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const respRt = await refreshToken();
        const accessToken = respRt.data.accessToken;

        tokenService.updateLocalAccessToken({
          token: accessToken,
        });
        return httpRequests(originalRequest);
      }
      return Promise.reject(error);
    }
  );

  const get = async (path, options = {}) => {
    const res = await httpRequests.get(path, options);
    return res;
  }

  const post = async (path, data = {}, options = {}) => {
    const res = await httpRequests.post(path, data, options);
    return res;
  }

  return [get, post];
};

export default useCustomFetch;
