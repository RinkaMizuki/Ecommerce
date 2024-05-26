import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const LoggedIn = (OriginComponent) => {
  return function ExtendComponent(props) {
    const userLogin = useSelector(state => state.auth.login.currentUser);
    const location = useLocation();
    return !userLogin ? <OriginComponent {...props} /> : <Navigate to="/" state={{ from: location }} replace />
  }
};

export default LoggedIn;
