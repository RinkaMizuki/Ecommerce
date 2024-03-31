import axios from "axios";
import queryString from "query-string";
import { useLayoutEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useCustomFetch from "../../hooks/useCustomFetch"
import { loginStart, loginSuccess } from "../../redux/authSlice";
import tokenService from "../../services/tokenService";
import Loading from "../Loading";
import { useDispatch, useSelector } from "react-redux";
import { getTokenInfo } from "../../services/googleService";

const GoogleLogin = () => {

  const isFetching = useSelector(state => state.auth.login.isFetching);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [, postUserLinked] = useCustomFetch();

  useLayoutEffect(() => {
    const { error } = queryString.parse(window.location.href.split("?")[1]);
    if (error === 'access_denied') {
      // Xử lý lỗi khi người dùng từ chối quyền truy cập
      window.location.href = `${window.location.origin}/login`
    } else {
      // Xử lý đăng nhập thành công hoặc các lỗi khác
      // Bạn có thể tiếp tục xử lý đăng nhập ở đây hoặc chuyển hướng người dùng đến trang chính của ứng dụng
      const { code } = queryString.parse(window.location.href.split("?")[1]);

      const fetchData = async () => {
        dispatch(loginStart())
        try {
          const { access_token, expires_in, id_token, refresh_token, scope, token_type } = await getTokenInfo("/token", null, {
            params: {
              client_id: import.meta.env.VITE_ECOMMERCE_CLIENT_ID,
              client_secret: import.meta.env.VITE_ECOMMERCE_CLIENT_SECRET,
              code,
              grant_type: "authorization_code",
              redirect_uri: import.meta.env.VITE_ECOMMERCE_GOOGLE_REDIRECT_URI,
            }
          })

          localStorage.setItem("refresh_token", JSON.stringify(refresh_token))

          const res = await axios.get(import.meta.env.VITE_ECOMMERCE_USERINFO_SCOPE_URI, {
            headers: {
              "Authorization": `${token_type} ${access_token}`,
            },
          })
          const data = {
            providerId: res.data.id,
            email: res.data.email,
            providerName: "Google",
            providerDisplayName: "Google",
            picture: res.data.picture,
          }
          const userLinked = await postUserLinked("/Auth/link-account", data, {
            headers: {
              "Content-Type": "application/json"
            }
          })
          tokenService.setToken({
            token: id_token,
          })
          dispatch(loginSuccess({
            ...userLinked?.data,
            type: "google"
          }))
          navigate("/")
        } catch (err) {
          console.log(err)
        }
      }
      fetchData();
    }
  }, []);

  return (
    <>
      {isFetching && <Loading />}
    </>
  )
};

export default GoogleLogin;
