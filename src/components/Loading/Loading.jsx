import React from "react"
import styles from "./Loading.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const Loading = ({ className }) => {

  const classCss = cx({
    [className]: className,
    loader: true,
  })

  return (
    <span className={classCss}></span>
  )
};

export default Loading;
