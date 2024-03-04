import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom"

const AuthRequired = (OrignalComponent) => {
  function ExtendComponent() {

    const location = useLocation();

    const useLogin = useSelector(state => state.auth.login.currentUser);

    return (useLogin ? <OrignalComponent /> : <Navigate to="/login" state={{ from: location }} replace />)
    
  }
  return ExtendComponent;
};

export default AuthRequired;
