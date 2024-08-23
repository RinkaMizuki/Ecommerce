import classNames from "classnames/bind";
import styles from "./LayoutManagement.module.scss";
import { Breadcrumbs } from "@mui/material";
import Link from "@mui/material/Link";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AccountMenu from "../../components/AccountMenu";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";
import AuthRequired from "../../HOC/AuthRequired";
import useToTop from "../../hooks/useToTop";

const cx = classNames.bind(styles);

const LayoutManagement = AuthRequired(({ toggleTopHeader, children }) => {
  useToTop();
  const userLogin = useSelector((state) => state.auth.login.currentUser);
  const navigate = useNavigate();

  function handleClick(event) {
    event.preventDefault();
    if (!event.target.href?.split("/")[3]) {
      navigate("/");
    }
  }

  return (
    <>
      <Header toggleTopHeader={toggleTopHeader} />
      <Helmet>
        <meta charSet="utf-8" />
        <title>MT Store - Account</title>
        <link
          rel="canonical"
          href={`${window.location.origin}/manager/profile`}
        />
      </Helmet>
      <div
        className={cx("main-container")}
        style={{
          marginTop: toggleTopHeader ? "76px" : "unset",
        }}
      >
        <div
          role="presentation"
          onClick={handleClick}
          className={cx("breadcrumb")}
        >
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/">
              Home
            </Link>
            <Link
              underline="hover"
              color="text.primary"
              href="/manager"
              aria-current="page"
            >
              Account
            </Link>
          </Breadcrumbs>
          <div className={cx("username")}>
            <span>Welcome!</span>
            <span> {userLogin?.user?.userName}</span>
          </div>
        </div>
        <div className={cx("manager-container")}>
          <AccountMenu />
          {children}
        </div>
      </div>
      <Footer />
    </>
  );
});

export default LayoutManagement;
