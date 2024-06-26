import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const LoggedIn = (OriginComponent) => {
  return function ExtendComponent(props) {
    const userLogin = useSelector(state => state.auth.login.currentUser);
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    return !userLogin ? <OriginComponent {...props} /> : <Navigate to={from} replace />
  }
};

export default LoggedIn;
