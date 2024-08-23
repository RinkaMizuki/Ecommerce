import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [location.pathname]);

  return null;
};

export default useToTop;
