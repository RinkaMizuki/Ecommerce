import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from "react-redux";
import Tippy from "@tippyjs/react/headless";
import 'tippy.js/dist/tippy.css';

import { logoutFailed, logoutStart, logoutSuccess } from "../../../redux/authSlice";
import useCustomFetch from "../../../hooks/useCustomFetch";
import { useSpring, animated } from "@react-spring/web";
import TokenService from "../../../services/tokenService";

const cx = classNames.bind(styles);

const Header = function () {

  const [, logoutService] = useCustomFetch();

  const config = { tension: 300, friction: 20 };
  const initialStyles = { opacity: 0, transform: "scale(0.5)" };
  const [props, setSpring] = useSpring(() => initialStyles);
  const userLogin = useSelector(state => state.auth.login.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    dispatch(logoutStart())
    try {
      var res = await logoutService(`/Auth/logout?userId=${userLogin.user.userId}`, {}, {})
      dispatch(logoutSuccess(res?.data))
      TokenService.removeToken("token");
      navigate("/")
      window.location.reload();
    } catch (error) {
      dispatch(logoutFailed(res.data))
    }
  }


  function onMount() {
    setSpring({
      opacity: 1,
      transform: "scale(1)",
      onRest: () => { },
      config
    });
  }

  function onHide({ unmount }) {
    setSpring({
      ...initialStyles,
      onRest: unmount,
      config: { ...config, clamp: true }
    });
  }


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
            <Link to="/">Exclusive</Link>
            <Link to="/">Home</Link>
            <Link to="/">Contact</Link>
            <Link to="/">About</Link>
            <Link to="/user">User</Link>
            {!userLogin && <Link to="/register">Sign up</Link>}
          </div>
          <div className={cx("right-header")}>
            <div className={cx("input-search")}>
              <input type="text" name="search" id="search" placeholder="What are you looking for?" />
              <i className={cx("icon-search", "fa-solid fa-magnifying-glass")}></i>
            </div>
            <i className={cx("icon-heart", "fa-regular fa-heart")}></i>
            <i className={cx("icon-cart", "fa-solid fa-cart-shopping")}></i>
            {userLogin && <Tippy
              duration={500}
              animation={true}
              onMount={onMount}
              onHide={onHide}
              placement="bottom-end"
              interactive={true}
              render={attrs => (
                <animated.div className={cx("menu-container")} style={props} tabIndex="-1" {...attrs}>
                  <ul className={cx("menu-dropdown")}>
                    <li>
                      <i className="fa-solid fa-user"></i>
                      Manage My Account
                    </li>
                    <li>
                      <i className="fa-solid fa-bag-shopping"></i>
                      My Order
                    </li>
                    <li>
                      <i className="fa-solid fa-circle-xmark"></i>
                      My Cancellations
                    </li>
                    <li>
                      <i className="fa-solid fa-star"></i>
                      My Reviews
                    </li>
                    <li onClick={handleLogout}>
                      <i className="fa-solid fa-right-from-bracket"></i>
                      Log out
                    </li>
                  </ul>
                </animated.div>
              )}
            >
              <span className={cx("user-info")}>
                <i className="fa-regular fa-user"></i>
              </span>
            </Tippy>
            }
          </div>
        </div>
      </div>
    </div>
  )
};

export default Header;
