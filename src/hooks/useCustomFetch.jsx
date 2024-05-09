import httpRequests from "../utils/httpRequests";
import tokenService from "../services/tokenService"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutFailed, logoutStart, logoutSuccess } from "../redux/authSlice";
import { get as refreshToken, post as postLogout } from "../services/ssoService";

const useCustomFetch = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const typeLogin = useSelector(state => state.auth.login.type);
  const userLogin = useSelector(state => state.auth.login.currentUser);
  // const refreshToken = async (type) => {
  //   try {
  //     // const res = await httpRequests.post(`/Auth/refresh-token`);
  //     const res = await refreshTokenGoogle('/auth/refresh-token', {
  //       params: {
  //         type
  //       }
  //     });
  //     return res;
  //   } catch (error) {
  //     if (error?.response?.status === 403 || error?.response?.status === 401) {
  //       tokenService.removeToken();
  //       dispatch(logoutSuccess({
  //         message: "Logout successfully"
  //       }))
  //       navigate("/login")
  //       return;
  //     }
  //   }
  // }
  //nếu có token thì trước khi request sẽ đính kèm vào headers
  httpRequests.interceptors.request.use(
    async (config) => {
      if (typeLogin === "google") {
        const token = tokenService.getLocalAccessToken()?.token;
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    }
  )

  //nếu response trả về có lỗi và nếu lỗi là do unauthorize thì gửi một request yêu cầu refresh token sau khi có token sẽ thực hiện lại request origin với token mới chỉ 1 lần.
  httpRequests.interceptors.response.use(
    (response) => {
      return response;
    },
    async function (error) {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        await refreshToken('/auth/refresh-token', {
          params: {
            type: typeLogin,
            remember: JSON.parse(localStorage.getItem("remember") || "false")
          }
        });
        return httpRequests(originalRequest);
      }
      if (error.response?.status === 403 || error.response?.status === 401) {
        dispatch(logoutStart())
        let res
        try {
          res = await postLogout(`/auth/logout`, {
            userId: userLogin?.user?.id
          }, {})
          dispatch(logoutSuccess(res?.data))
        } catch (error) {
          dispatch(logoutFailed(res?.data))
        } finally {
          //window.location.reload();
          navigate("/login")
        }
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

  const put = async (path, data = {}, options = {}) => {
    const res = await httpRequests.put(path, data, options);
    return res;
  }

  const deleted = async (path, options = {}) => {
    const res = await httpRequests.delete(path, options);
    return res;
  }

  return [get, post, put, deleted];
};

export default useCustomFetch;
