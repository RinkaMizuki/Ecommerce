import queryString from "query-string";
import { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const GoogleLogin = () => {

  const location = useLocation();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {

    if (location.hash === '#error=access_denied') {
      // Xử lý lỗi khi người dùng từ chối quyền truy cập
      navigate("/login");
    } else {
      // Xử lý đăng nhập thành công hoặc các lỗi khác
      // Bạn có thể tiếp tục xử lý đăng nhập ở đây hoặc chuyển hướng người dùng đến trang chính của ứng dụng
      const token = location.hash.split("#access_token=")[1];
      console.log(queryString.parse("access_token=" + token));
    }
  }, []);

  return (
    <div>
      This is a GoogleLogin page
    </div>
  )
};

export default GoogleLogin;
