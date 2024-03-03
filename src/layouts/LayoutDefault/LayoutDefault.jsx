import React from "react"
import styles from "./LayoutDefault.module.scss";
import classNames from "classnames/bind";
import Header from "../components/Header";
import Footer from "../components/Footer";

const cx = classNames.bind(styles);

const LayoutDefault = ({ children }) => {

  return (
    <>
      <Header />
      <div className={cx("content-wrapper")}>
        {children}
      </div>
      <Footer />
    </>
  )
};

export default LayoutDefault;
