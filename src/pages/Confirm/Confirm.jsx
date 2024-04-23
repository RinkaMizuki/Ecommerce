import styles from "./Confirm.module.scss";
import classNames from "classnames/bind";
import emailImage from "../../assets/images/email.svg.png";
import Button from "../../components/Button";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { getRefreshToken as getConfirm } from "../../services/ssoService";

const cx = classNames.bind(styles);

const toastOptions = {
  position: "top-right",
  autoClose: 1200,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
}

const Confirm = () => {

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    const fetchData = async () => {
      try {
        const response = await getConfirm(`/auth/confirm-email?email=${email}&token=${token}`);
        if (response?.data?.statusCode === 200) {
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
