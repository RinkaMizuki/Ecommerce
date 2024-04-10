import { useTranslation } from "react-i18next";
import styles from "./ProductService.module.scss"
import classNames from "classnames/bind"

const cx = classNames.bind(styles);

const ProductService = ({ className }) => {

  const { t } = useTranslation();

  return (
    <div className={cx("product-service-wrapper", {
      [className]: className
    })}>
      <div className={cx("product-service-item")}>
        <span><i className="fa-solid fa-truck"></i></span>
        <h1>{t('delivery')}</h1>
        <p>{t('free-ship')}</p>
      </div>
      <div className={cx("product-service-item")}>
        <span><i className="fa-solid fa-phone-volume"></i></span>
        <h1>{t('service-care')}</h1>
        <p>{t('service-customer')}</p>
      </div>
      <div className={cx("product-service-item")}>
        <span>
          <i className="fa-solid fa-shield"></i>
          <i className={cx("fa-solid fa-check", "icon-check")}></i>
        </span>
        <h1>{t('return-money')}</h1>
        <p>{t('return-day')}</p>
      </div>
    </div>
  )
};

export default ProductService;
