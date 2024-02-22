import { useRef, useState } from "react"
import styles from "./Cart.module.scss"
import classNames from "classnames/bind";
import { useSpring, animated, config } from "@react-spring/web"
import StarRatings from "react-star-ratings";
const cx = classNames.bind(styles);

const Cart = ({ onCloseLightBox, data, img = null }) => {
  const cartRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const [springs, api] = useSpring(() => (
    {
      from: { y: 43 },
      config: config.slow
    }
  ));
  const handleImageLoad = () => {
    // Sự kiện này được gọi khi hình ảnh đã được load xong
    setIsLoading(false);
  };
  const handleMouseEnter = () => {
    api.start({
      from: { y: 43 },
      to: { y: 0 },
    });
  }

  const handleMouseLeave = () => {
    api.start({
      from: { y: 0 },
      to: { y: 60 },
    })
  }

  return (
    <div className={cx("cart-container")}>
      <animated.div className={cx("cart-img")}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={img ?? data?.url}
          alt={data?.image}
          onLoad={handleImageLoad}
        />
        <span
          className={cx("cart-sale")}
        >-40%</span>
        <span
          className={cx("cart-like")}
        >
          <i className="fa-regular fa-heart">
          </i>
        </span>
        <span className={cx("cart-review")} onClick={() => onCloseLightBox(data.id)}><i className="fa-regular fa-eye"></i></span>
        <animated.div className={cx("add-cart")}
          style={{ ...springs }}
          ref={cartRef}
        >Add To Cart</animated.div>
      </animated.div>
      <div className={cx("cart-content")}>
        <h2 className={cx("cart-title")}>{data?.title}</h2>
        <div className={cx("cart-price-wrapper")}>
          <span className={cx("cart-price-sale")}>{data?.price * (1 - data?.discount / 100)} VND</span>
          <span className={cx("cart-price")}>{data?.price} VND</span>
        </div>
        <div className={cx("cart-feedback")}>
          <StarRatings
            rating={isNaN(data?.productRates?.reduce((sum, rate) => sum + rate.star, 0) / data?.productRates?.length) ? 5 : data?.productRates?.reduce((sum, rate) => sum + rate.star, 0) / data?.productRates?.length}
            starRatedColor="gold"
            numberOfStars={5}
            starDimension="20px"
            starSpacing="1px"
            name='rating'
          />
          <span>({data?.productRates?.length})</span>
        </div>
      </div>
    </div>
  )
};

export default Cart;
