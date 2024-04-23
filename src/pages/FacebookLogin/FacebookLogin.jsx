import { useLayoutEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import useCustomFetch from "../../hooks/useCustomFetch";
import Loading from "../Loading";
import tokenService from "../../services/tokenService";
import { loginSuccess } from "../../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { postAuth } from "../../services/ssoService";

const FacebookLogin = () => {

  const userLogin = useSelector(state => state.auth.login.currentUser?.user)
  //const [, postUserLinked] = useCustomFetch();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  useLayoutEffect(() => {

    const fetchData = async () => {
      const type = JSON.parse(localStorage.getItem("authType"));
      try {
        // const userAuth = await postUserLinked("/Auth/facebook-auth", null, {
        //   params: {
        //     facebookAccessToken: location.state.accessToken,
        //     type,
        //     userId: userLogin?.id
        //   }
        // })
        const userAuth = await postAuth("/auth/facebook-login", null, {
          params: {
            facebookAccessToken: location.state.accessToken,
            type,
            userId: userLogin?.id,
            serviceName: import.meta.env.VITE_ECOMMERCE_SERVICE_NAME
          }
        })

        dispatch(loginSuccess({
          ...userAuth?.data,
          type: "facebook"
        }))
        navigate(`${type === "login" ? "/" : "/manager/links"}`, {
          replace: true,
        })
      }
      catch (error) {
        console.log(error);
        navigate(`${type === "login" ? "/login" : "/manager/links"}`, {
          replace: true,
          state: error?.response?.data
        })
      }
    }
    fetchData();
  }, [])

  if (!location.state) {
    return <Navigate to="/" replace={true} />
  } else if (location.state.status === "unknown") {
    return <Navigate to="/login" replace={true} />
  }

  return (
    <>
      <Loading />
    </>
  )
};

export default FacebookLogin;
