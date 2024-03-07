import styles from "./Confirm.module.scss";
import classNames from "classnames/bind";
import emailImage from "../../assets/images/email.svg.png";
import Button from "../../components/Button";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import useCustomFetch from "../../hooks/useCustomFetch";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/authSlice";

const cx = classNames.bind(styles);

const toastOptions = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
}

const Confirm = () => {

  const [getConfirmed] = useCustomFetch();
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();

  useEffect(() => {
    
    const userId = searchParams.get("userId");
    const token = searchParams.get("token");

    const fetchData = async () => {
      try {
        const response = await getConfirmed(`/Auth/confirm-email?userId=${userId}&token=${token}`);
        if (response?.data?.statusCode === 200) {

          dispatch(loginSuccess(response.data));
          localStorage.setItem("reloadEvent", "profile");

          toast.success(response?.data?.message, toastOptions);

        } else {
          toast.error(response?.data?.message, toastOptions);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message, toastOptions);
      }
    }
    fetchData();
  }, [])

  return (
    <div className={cx("confirm-container")}>
      <ToastContainer></ToastContainer>
      <div className={cx("email-wrapper")}>
        <img src={emailImage} alt="email" />
      </div>
      <h1>Thank you, confirmed !</h1>
      <p>We may send notifications to your email box.</p>
      <Button className={cx("btn-back")} to="/"><i className="fa-solid fa-arrow-left-long"></i>Back Home</Button>
      <p>If have any issues <Link to="/contact" className={cx("contact-us")}>contact us</Link></p>
    </div>
  )
};

export default Confirm;
