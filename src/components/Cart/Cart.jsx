import { useRef } from "react"
import styles from "./Cart.module.scss"
import classNames from "classnames/bind";
import { useSpring, animated, config } from "@react-spring/web"
const cx = classNames.bind(styles);

const Cart = ({ onCloseLightBox, img = null }) => {
  const cartRef = useRef(null);
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

  return (
    <div className={cx("cart-container")}>
      <animated.div className={cx("cart-img")}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img src={img ?? "https://www.pngplay.com/wp-content/uploads/13/Gaming-Keyboard-Transparent-Free-PNG.png"} alt="Review Product" />
        <span className={cx("cart-sale")}>-40%</span>
        <span className={cx("cart-like")}><i className="fa-regular fa-heart"></i></span>
        <span className={cx("cart-review")} onClick={onCloseLightBox}><i className="fa-regular fa-eye"></i></span>
        <animated.div className={cx("add-cart")}
          style={{ ...springs }}
          ref={cartRef}
        >Add To Cart</animated.div>
      </animated.div>
      <div className={cx("cart-content")}>
        <h2 className={cx("cart-title")}>HAVIT HV-G92 Gamepad</h2>
        <div className={cx("cart-price-wrapper")}>
          <span className={cx("cart-price-sale")}>$120</span>
          <span className={cx("cart-price")}>$160</span>
        </div>
        <p className={cx("cart-feedback")}><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-regular fa-star"></i> (88)</p>
      </div>
    </div>
  )
};

export default Cart;
