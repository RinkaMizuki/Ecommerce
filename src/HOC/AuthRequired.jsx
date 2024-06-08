import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom"

const AuthRequired = (OrignalComponent) => {
  function ExtendComponent(props) {

    const location = useLocation();
    const userLogin = useSelector(state => state.auth.login.currentUser);
    return (userLogin ? <OrignalComponent {...props} /> : <Navigate to="/login" state={{ from: location }} replace />)

  }
  return ExtendComponent;
};

export default AuthRequired;
