import styles from "./Header.module.scss";
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Header = function () {
  return (
    <div>
      <div className={cx("wrapper")}>
        <div className={cx("top-header-wrapper")}>
          <div className={cx("top-header-item-wrapper")}>
            <p>Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!</p>
            <a href="/" className={cx("top-header-shop")}>ShopNow</a>
          </div>
          <div className={cx("top-header-language")}>
            <span>English</span>
            <i className="fa-solid fa-angle-down"></i>
          </div>
        </div>
      </div>
      <div className={cx("header-wrapper")}>
        <div className={cx("header-container")}>
          <div className={cx("left-header")}>
            <h2>Exclusive</h2>
            <a href="/">Home</a>
            <a href="/">Contact</a>
            <a href="/">About</a>
            <a href="/">Sign up</a>
          </div>
          <div className={cx("right-header")}>
            <div className={cx("input-search")}>
              <input type="text" name="search" id="search" placeholder="What are you looking for?" />
              <i className={cx("icon-search", "fa-solid fa-magnifying-glass")}></i>
            </div>
            <i className={cx("icon-heart","fa-regular fa-heart")}></i>
            <i className={cx("icon-cart","fa-solid fa-cart-shopping")}></i>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Header;
