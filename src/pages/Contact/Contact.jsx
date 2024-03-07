import styles from "./Contact.module.scss";
import classNames from "classnames/bind";
import Button from "../../components/Button";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
import useCustomFetch from "../../hooks/useCustomFetch"
import { Breadcrumbs } from "@mui/material";
import Link from '@mui/material/Link';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const cx = classNames.bind(styles)

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

const Contact = () => {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const userLogin = useSelector(state => state.auth.login.currentUser);
  const [, postContact] = useCustomFetch();

  const validatePhoneNumber = (phone) => {
    const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
    return phone.match(regexPhoneNumber) ? true : false;
  }
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  const handleSendContact = async () => {
    if (!phone || !name || !email) {
      toast.error("Please enter complete information", toastOptions);
      return;
    }
    if (!validatePhoneNumber(phone) && phone) {
      toast.error("Please enter a valid phone number", toastOptions);
      return;
    }
    if (!validateEmail(email) && email) {
      toast.error("Please enter a valid email", toastOptions);
      return;
    }

    const formData = new FormData();
    const userId = userLogin.user.id;
    formData.append("UserId", userId)
    formData.append("Content", message)
    formData.append("Name", name)
    formData.append("Phone", phone)
    formData.append("Email", email)
    await postContact("/Admin/contacts/post", formData);
    setName("")
    setPhone("")
    setMessage("")
    setEmail("")
    toast.success("Send contact successfully", toastOptions);
  }

  function handleClick(event) {
    event.preventDefault();
    if (!event.target.href?.split("/")[3]) {
      navigate("/")
    }
  }

  return (
    <div className={cx("main-container")}>
      <div role="presentation" onClick={handleClick} className={cx("breadcrumb")}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link
            underline="hover"
            color="text.primary"
            href="/contact"
            aria-current="page"
          >
            Contact
          </Link>
        </Breadcrumbs>
      </div>
      <ToastContainer style={{
        marginTop: "120px"
      }}></ToastContainer>
      <div className={cx("left-container")}>
        <div className={cx("call-wrapper")}>
          <div className={cx("call-title")}>
            <span className={cx("icon-wrapper")}>
              <i className="fa-solid fa-phone"></i>
            </span>
            <span>Call To Us</span>
          </div>
          <p className={cx("call-description")}>We are available 24/7, 7 days a week.</p>
          <p>Phone: +84867706538</p>
        </div>
        <div className={cx("line-spacing")}></div>
        <div className={cx("write-wrapper")}>
          <div className={cx("write-title")}>
            <span className={cx("icon-wrapper")}>
              <i className="fa-solid fa-envelope"></i>
            </span>
            <span>Write To Us</span>
          </div>
          <p className={cx("write-description")}>Fill out our form and we will contact you within 24 hours.</p>
          <p className={cx("write-email")}>Emails: support@sunstore.com</p>
        </div>
      </div>
      <div className={cx("right-container")}>
        <div className={cx("input-wrapper")}>
          <div className={cx("input-info")}>
            <input type="text" placeholder="Your Name" required onChange={(e) => setName(e.target.value)} value={name} />
            <input type="email" placeholder="Your Email" required onChange={(e) => setEmail(e.target.value)} value={email} />
            <input type="text" placeholder="Your Phone" required onChange={(e) => setPhone(e.target.value)} value={phone} />
          </div>
          <textarea name="message" id="message" cols="20" rows="10" placeholder="Your Message" className={cx("input-message")}
            onChange={(e) => setMessage(e.target.value)} value={message} >
          </textarea>
        </div>
        <Button className={cx("btn-send")}
          onClick={handleSendContact}
        >Send Message</Button>
      </div>
    </div >
  )
};

export default Contact;
