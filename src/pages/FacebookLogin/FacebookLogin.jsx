import { useLayoutEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import useCustomFetch from "../../hooks/useCustomFetch";
import Loading from "../Loading";
import tokenService from "../../services/tokenService";
import { loginSuccess } from "../../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";

const FacebookLogin = () => {

  const userLogin = useSelector(state => state.auth.login.currentUser?.user)
  const [, postUserLinked] = useCustomFetch();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  useLayoutEffect(() => {

    const fetchData = async () => {
      try {
        const type = JSON.parse(localStorage.getItem("authType"));
        const userAuth = await postUserLinked("/Auth/facebook-auth", null, {
          params: {
            facebookAccessToken: location.state.accessToken,
            type,
            userId: userLogin?.id
          }
        })
        tokenService.setToken({
          token: userAuth.data.accessToken,
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
        if (error?.response?.status === 409) {
          navigate("/login", {
            replace: true,
            state: error?.response?.data
          })
        }
        console.log(error);
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
