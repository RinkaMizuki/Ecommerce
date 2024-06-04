import { forwardRef } from "react";
import styles from "./ViewTitle.module.scss";
import classNames from "classnames/bind";
import { useTranslation } from "react-i18next";
import Button from "../Button";

const cx = classNames.bind(styles);

const NavigateBtn = forwardRef(({ btnView = false, emptyBtn = false, hiddenArrow = false, className, refs }, ref) => {
  const { t } = useTranslation();
  const { prevRef, nextRef } = refs || {};
  return (
    !hiddenArrow ? (!btnView ? <div className={cx("title-navigate")}>
      <i className={cx("icon-arrow-left", "fa-solid fa-arrow-left-long")} ref={prevRef}></i>
      <i className={cx("icon-arrow-right", "fa-solid fa-arrow-right-long")} ref={nextRef}></i>
    </div> : !emptyBtn ? <Button small={true} className={className} >{t('view')}</Button> : null) : null
  )
});

export default NavigateBtn;
