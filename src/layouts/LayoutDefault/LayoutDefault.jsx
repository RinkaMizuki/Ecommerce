import React from "react"
import styles from "./LayoutDefault.module.scss";
import classNames from "classnames/bind";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";

const cx = classNames.bind(styles);

const LayoutDefault = ({ toggleTopHeader, children }) => {

  const location = useLocation();

  return (
    <>
      <Header toggleTopHeader={toggleTopHeader} />
      <div className={cx("content-wrapper")}
        style={{
          minHeight: `${location.pathname.includes("/product-detail") || location.pathname.includes("/favorite") ? "190vh" : "100vh"}`,
          marginTop: !toggleTopHeader ? "unset" : "76px"
        }}
      >
        {children}
      </div>
      <Footer />
    </>
  )
};

export default LayoutDefault;
