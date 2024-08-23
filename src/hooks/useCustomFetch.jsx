import httpRequests from "../utils/httpRequests";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutFailed, logoutStart } from "../redux/authSlice";
import {
  get as refreshToken,
  post as postLogout,
} from "../services/ssoService";

let isRefreshing = false;
let refreshSubscribers = [];
let refreshPromise = null;
let isLoggingOut = false;

//subscribe all request error 401 when refreshtoken is fetching
const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

//call all request error 401 when response newToken
const onRefreshed = () => {
  refreshSubscribers.map((cb) => cb());
};
export const getRefreshToken = async () => {
  if (isRefreshing) {
    await refreshPromise;
    return;
  }
  isRefreshing = true;
  await refreshToken("/auth/refresh-token", {
    params: {
      remember: JSON.parse(localStorage.getItem("remember") || "false"),
    },
  });
  isRefreshing = false;
};

const useCustomFetch = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.auth.login.currentUser);

  //nếu có token thì trước khi request sẽ đính kèm vào headers
  httpRequests.interceptors.request.use(
    async (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  //nếu response trả về có lỗi và nếu lỗi là do unauthorize thì gửi một request yêu cầu refresh token sau khi có token sẽ thực hiện lại request origin với token mới chỉ 1 lần, nếu lỗi thì gọi api logout
  httpRequests.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        if (!isLoggingOut) {
          isLoggingOut = true;
          dispatch(logoutStart());
          try {
            await postLogout(`/auth/logout`, {
              userId: userLogin?.user?.id,
            });
            dispatch(logoutFailed(error.response.data));
          } catch (err) {
            dispatch(logoutFailed(err.response.data));
            console.log(err);
          } finally {
            navigate("/login");
          }
        }
      } else if (error.response?.status === 401 && !originalRequest._retry) {
        if (!isRefreshing) {
          originalRequest._retry = true;
          try {
            refreshPromise = await getRefreshToken();
            onRefreshed(); // Notify all subscribers with new token
            refreshSubscribers = [];
            return httpRequests(originalRequest);
          } catch (err) {
            dispatch(logoutStart());
            try {
              await postLogout(`/auth/logout`, {
                userId: userLogin?.user?.id,
              });
              dispatch(logoutFailed(err.response.data));
            } catch (error) {
              dispatch(logoutFailed(error.response.data));
              console.log(error);
            } finally {
              navigate("/login");
            }
          }
        } else {
          //return new promise and call when callback is called with newToken to resolve it
          return new Promise((resolve) => {
            subscribeTokenRefresh(() => {
              resolve(httpRequests(originalRequest));
            });
          });
        }
      }
      return Promise.reject(error);
    }
  );

  const get = async (path, options = {}) => {
    const res = await httpRequests.get(path, options);
    return res;
  };

  const post = async (path, data = {}, options = {}) => {
    const res = await httpRequests.post(path, data, options);
    return res;
  };

  const put = async (path, data = {}, options = {}) => {
    const res = await httpRequests.put(path, data, options);
    return res;
  };

  const deleted = async (path, options = {}) => {
    const res = await httpRequests.delete(path, options);
    return res;
  };

  return [get, post, put, deleted];
};

export default useCustomFetch;
