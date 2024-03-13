import { useEffect, useRef, useState } from "react"
import styles from "./Cart.module.scss"
import classNames from "classnames/bind";
import { useSpring, animated, config } from "@react-spring/web"
import StarRatings from "react-star-ratings";
import { setLocalFavoriteProductId, getLocalFavoriteProductId } from "../../services/favoriteService";
import { setLocalProductQuantity, getLocalProductQuantity } from "../../services/cartService";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

const toastOptions = {
  position: "top-right",
  autoClose: 1500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
}

const Cart = ({ className, onCloseLightBox, data, img = null, hiddenStar = false, isRemove = false, hiddenHeart = false }) => {

  const cartRef = useRef(null);
  const addRef = useRef(null);

  const userInfo = useSelector(state => state.auth.login.currentUser);
  const navigate = useNavigate();

  const quantityStore = getLocalProductQuantity(userInfo?.user?.id).find(p => p.id == data.id);

  const [quantity, setQuantity] = useState(quantityStore?.quantity || 0);
  const [idFavorites, setIdFavorites] = useState(getLocalFavoriteProductId(userInfo?.user?.id));

  const [springs, api] = useSpring(() => (
    {
      from: { y: 43 },
      config: config.slow
    }
  ));

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
    if (!userInfo) {
      navigate("/login")
      return;
    }
    const isRemove = setLocalFavoriteProductId(id, userInfo.user.id)
    if (!isRemove) {
      toast.success("A product has been added to wishlist", toastOptions)
    } else {
      toast.info("A product has been removed from the favorites list", toastOptions)
    }
  }

  const handleAddProduct = (id, quantity = 1) => {
    if (!userInfo) {
      navigate("/login")
      return;
    }
    toast.success("A product has been added to cart", toastOptions)
    setLocalProductQuantity(id, userInfo?.user?.id, quantity, "add")
    setQuantity(preQuantity => preQuantity + 1);
  }
  const handleRemoveProduct = (id) => {
    if (!userInfo) {
      navigate("/login")
      return;
    }
    toast.info("A product has been removed from the cart", toastOptions)
    setLocalProductQuantity(id, userInfo?.user?.id, quantity, "remove")
    if (quantity >= 1) {
      setQuantity(preQuantity => preQuantity - 1);
    }
  }

  const handleRemoveProductFavorite = (id) => {
    setLocalFavoriteProductId(id, userInfo.user.id)
    toast.error("A product has been removed from the favorites list", toastOptions)
  }

  useEffect(() => {

    const handleStorageChange = () => {
      const ids = getLocalFavoriteProductId(userInfo.user.id);
      setIdFavorites(ids);
    }

    window.addEventListener(`FavoriteDataEvent_${userInfo?.user?.id}`, handleStorageChange);

    return () => {
      window.removeEventListener(`FavoriteDataEvent_${userInfo?.user?.id}`, handleStorageChange);
    };
  }, [])

  return (
    <div className={cx("cart-container", {
      [className]: className,
    })}
    >
      <animated.div className={cx("cart-img")}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link
          className={cx("link-detail")}
          to={`/product-detail/${data.id}`}
        >
          <LazyLoadImage
            className={cx("lazyload-img")}
            src={img ?? data?.url}
            alt={data?.image}
            effect="blur"
          />
        </Link>
        <span
          className={cx("cart-sale")}
        >-{data?.discount}%
        </span>
        {!isRemove ? <>
          {!hiddenHeart && <span
            className={cx("cart-like")}
            onClick={() => { handleSaveFavorite(data.id) }}
          >
            {!idFavorites.includes(data.id) || !userInfo ? <i className={cx("fa-regular fa-heart", "normal")}>
            </i> : <i className={cx("fa-solid fa-heart", "active")}></i>}
          </span>}

          <span className={cx("cart-review", {
            "hidden-heart": hiddenHeart,
          })} onClick={() => onCloseLightBox(data.id)}><i className="fa-regular fa-eye"></i></span>
        </> : <span
          className={cx("cart-trash")}
          onClick={() => handleRemoveProductFavorite(data.id)}
        >
          <i className="fa-regular fa-trash-can"></i>
        </span>}
        <animated.div className={cx("add-cart")}
          style={{ ...springs }}
          ref={cartRef}
        >
          {quantity == 0 ? <>
            <i className="fa-solid fa-cart-shopping"></i>
            <span style={{ marginLeft: "10px" }} ref={addRef} onClick={() => handleAddProduct(data?.id)}>Add To Cart</span>
          </>
            : <div className={cx("btn-quantity-wrapper")}>
              <button className={cx("minus-btn", "btn")}
                onClick={() => handleRemoveProduct(data?.id)}
              >-</button>
              <span>{quantity}</span>
              <button className={cx("plus-btn", "btn")}
                onClick={() => handleAddProduct(data?.id)}
              >+</button>
            </div>}
        </animated.div>
      </animated.div>
      <div className={cx("cart-content")}>
        <h2 className={cx("cart-title")}>{data?.title || <Skeleton />}</h2>
        <div className={cx("cart-price-wrapper")}>
          {data?.price ? <>
            <span className={cx("cart-price-sale")}>{(data?.price * (1 - data?.discount / 100)).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
            <span className={cx("cart-price")}>{data?.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
          </> :
            <Skeleton />
          }
        </div>
        {!hiddenStar && (data?.productRates?.length || data?.title ? <div className={cx("cart-feedback")}>
          <StarRatings
            rating={isNaN(data?.productRates?.reduce((sum, rate) => sum + rate.star, 0) / data?.productRates?.length) ? 0 : data?.productRates?.reduce((sum, rate) => sum + rate.star, 0) / data?.productRates?.length}
            starRatedColor="gold"
            numberOfStars={5}
            starDimension="17px"
            starSpacing="1px"
            name='rating'
          />
          <span>({data?.productRates?.length})</span>
        </div> : <Skeleton />)
        }
      </div>
    </div>
  )
};

export default Cart;
