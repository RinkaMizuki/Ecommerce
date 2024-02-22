import classNames from "classnames/bind";
import styles from "./Category.module.scss";
import ViewTitle from "../ViewTitle";
import { useState } from "react";

const cx = classNames.bind(styles)

const Category = () => {
  const [isWhite, setIsWhite] = useState(false);
  const handleMouseEnter = () => {
    setIsWhite(true);
  };
  const handleMouseLeave = () => {
    setIsWhite(false);
  };
  return (
    <div className={cx("container")}>
      <ViewTitle label="Categories" title="Browser By Category" />
      <div className={cx("category-container")}>
        <div className={cx("category-item")}>
          <i className="fa-solid fa-mobile-screen"></i>
          <span>Phones</span>
        </div>
        <div className={cx("category-item")}>
          <i className="fa-solid fa-display"></i>
          <span>Computers</span>
        </div>
        <div className={cx("category-item")} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {!isWhite ? <img src="https://img.icons8.com/material-rounded/24/watches-front-view--v1.png" alt="watches-front-view--v1" />
            : <img width="24" height="24" src="https://img.icons8.com/material-rounded/24/FFFFFF/watches-front-view--v1.png" alt="watches-front-view--v1" />}
          <span>Watches</span>
        </div>
        <div className={cx("category-item")}>
          <i className="fa-solid fa-camera"></i>
          <span>Cameras</span>
        </div>
        <div className={cx("category-item")}>
          <i className="fa-solid fa-headphones"></i>
          <span>HeadPhones</span>
        </div>
        <div className={cx("category-item")}>
          <i className="fa-solid fa-gamepad"></i>
          <span>Gamings</span>
        </div>
      </div>
    </div>
  )
}
export default Category;