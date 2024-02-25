import { useRef, useState } from "react"
import styles from "./Cart.module.scss"
import classNames from "classnames/bind";
import { useSpring, animated, config } from "@react-spring/web"
import StarRatings from "react-star-ratings";
import { setLocalFavoriteProductId } from "../../services/favoriteService";
const cx = classNames.bind(styles);

const Cart = ({ className, onCloseLightBox, data, img = null, hiddenStar = false, isRemove = false, hiddenHeart = false }) => {
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

  const handleSaveFavorite = (id) => {
    setLocalFavoriteProductId(id)
  }

  return (
    <div className={cx("cart-container", {
      [className]: className,
    })}>
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
        {!isRemove ? <>
          {!hiddenHeart && <span
            className={cx("cart-like")}
            onClick={() => { handleSaveFavorite(data.id) }}
          >
            <i className="fa-regular fa-heart">
            </i>
          </span>}

          <span className={cx("cart-review", {
            "hidden-heart": hiddenHeart,
          })} onClick={() => onCloseLightBox(data.id)}><i className="fa-regular fa-eye"></i></span>
        </> : <span
          className={cx("cart-trash")}
        >
          <i className="fa-regular fa-trash-can"></i>
        </span>}
        <animated.div className={cx("add-cart")}
          style={{ ...springs }}
          ref={cartRef}
        >
          <i className="fa-solid fa-cart-shopping"></i>
          <span style={{ marginLeft: "10px" }}>Add To Cart</span>
        </animated.div>
      </animated.div>
      <div className={cx("cart-content")}>
        <h2 className={cx("cart-title")}>{data?.title}</h2>
        <div className={cx("cart-price-wrapper")}>
          <span className={cx("cart-price-sale")}>{(data?.price * (1 - data?.discount / 100)).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
          <span className={cx("cart-price")}>{data?.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
        </div>
        {!hiddenStar && <div className={cx("cart-feedback")}>
          <StarRatings
            rating={isNaN(data?.productRates?.reduce((sum, rate) => sum + rate.star, 0) / data?.productRates?.length) ? 0 : data?.productRates?.reduce((sum, rate) => sum + rate.star, 0) / data?.productRates?.length}
            starRatedColor="gold"
            numberOfStars={5}
            starDimension="17px"
            starSpacing="1px"
            name='rating'
          />
          <span>({data?.productRates?.length})</span>
        </div>}
      </div>
    </div>
  )
};

export default Cart;
