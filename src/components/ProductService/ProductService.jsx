import styles from "./ProductService.module.scss"
import classNames from "classnames/bind"

const cx = classNames.bind(styles);

const ProductService = () => {
  return (
    <div className={cx("product-service-wrapper")}>
      <div className={cx("product-service-item")}>
        <span><i className="fa-solid fa-truck"></i></span>
        <h1>FREE AND FAST DELIVERY</h1>
        <p>Free delivery for all orders over $140</p>
      </div>
      <div className={cx("product-service-item")}>
        <span><i className="fa-solid fa-phone-volume"></i></span>
        <h1>24/7 CUSTOMER SERVICE</h1>
        <p>Friendly 24/7 customer support</p>
      </div>
      <div className={cx("product-service-item")}>
        <span>
          <i className="fa-solid fa-shield"></i>
          <i className={cx("fa-solid fa-check","icon-check")}></i>
        </span>
        <h1>MONEY BACK GUARANTEE</h1>
        <p>We reurn money within 30 days</p>
      </div>
    </div>
  )
};

export default ProductService;
