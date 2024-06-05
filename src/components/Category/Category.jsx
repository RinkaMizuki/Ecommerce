import classNames from "classnames/bind";
import styles from "./Category.module.scss";
import ViewTitle from "../ViewTitle";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles)

const Category = ({ categories }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleNavigateCate = (title) => {
    navigate(`/category/${title}`)
  }
  return (
    <div className={cx("container")}>
      <ViewTitle
        label={t("category")}
        title={t("category-list")}
        hiddenArrow={true}
      />
      <div className={cx("category-container")}>
        {categories.map(category => (
          <div className={cx("category-item")} onClick={() => handleNavigateCate(category.title)}>
            <i className="icons-cate" style={{
              backgroundImage: `url(${category.icon})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}></i>
            <span>{category.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
export default Category;