import React from "react"
import styles from "./LayoutDefault.module.scss";
import classNames from "classnames/bind";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import Slider from "../components/Slider/Slider";
import Footer from "../components/Footer";

const cx = classNames.bind(styles);

const LayoutDefault = ({children}) => {
  return (
    <div>
      <Header />
      <div className={cx("wrapper")}>
        <Sidebar />
        <Slider />
      </div>
      <div className={cx("content-wrapper")}>
        {children}
      </div>
      <Footer />
    </div>
  )
};

export default LayoutDefault;
