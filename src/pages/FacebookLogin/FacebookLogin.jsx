import { useLayoutEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import useCustomFetch from "../../hooks/useCustomFetch";
import Loading from "../Loading";
import tokenService from "../../services/tokenService";
import { loginSuccess } from "../../redux/authSlice";
import { useDispatch } from "react-redux";

const FacebookLogin = () => {

  const [, postUserLinked] = useCustomFetch();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  useLayoutEffect(() => {

    const fetchData = async () => {
      try {
        const userLinked = await postUserLinked("/Auth/facebook-auth", null, {
          params: {
            facebookAccessToken: location.state.accessToken,
          }
        })
        tokenService.setToken({
          token: userLinked.data.accessToken,
        })
        dispatch(loginSuccess({
          ...userLinked?.data,
          type: "facebook"
        }))
        navigate("/", {
          replace: true,
        })
      }
      catch (error) {
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
