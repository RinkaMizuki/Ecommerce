import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from "react-redux";
import Tippy from "@tippyjs/react/headless";
import 'tippy.js/dist/tippy.css';
import { logoutFailed, logoutStart, logoutSuccess } from "../../../redux/authSlice";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useSpring, animated } from "@react-spring/web";
//import tokenService from "../../../services/tokenService";
import { getLocalFavoriteProductId } from "../../../services/favoriteService";
import { getLocalProductQuantity } from "../../../services/cartService";
import { useEffect, useRef, useState } from "react";
import defaultAvatar from "../../../assets/images/avatar.jpeg";
import Avatar from "../../../components/Avatar";
import { useTranslation } from 'react-i18next';
import { useClickOutside } from "../../../hooks/useClickOutside";
//import { getToken as revokeToken } from "../../../services/googleService";
import { postAuth as postLogout } from "../../../services/ssoService";

const cx = classNames.bind(styles);

const LANGUAGE = [
  {
    key: 'vi',
    value: "Tiếng việt"
  },
  {
    key: 'en',
    value: "English"
  }
]

const MENU = [
  {
    title: "Manage My Account",
    icon: "fa-solid fa-user",
    to: "/manager/profile"
  },
  {
    title: "Manage My Orders",
    icon: "fa-solid fa-bag-shopping",
    to: "/manager/returns"
  },
  {
    title: "Manage My Reviews",
    icon: "fa-solid fa-star",
    to: "/manager/reviews"
  },
  {
    title: "Log out",
    icon: "fa-solid fa-right-from-bracket",
    to: null,
  },
];

const Header = function ({ toggleTopHeader }) {
  const { t, i18n } = useTranslation();
  const [isShow, setIsShow] = useState(false);
  const expandRef = useRef(null);
  const userLogin = useSelector(state => state.auth.login.currentUser);
  const [listId, setListId] = useState(getLocalFavoriteProductId(userLogin?.user?.id));
  const [listProductId, setListProductId] = useState(getLocalProductQuantity(userLogin?.user?.id));

  const config = { tension: 300, friction: 20 };
  const initialStyles = { opacity: 0, transform: "scale(0.5)" };
  const [props, setSpring] = useSpring(() => initialStyles);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleShowLanguage = () => {
    setIsShow(!isShow);
  }
  const handleClickOutside = () => {
    setIsShow(false);
  }

  const handleChangeLanguage = (lng) => {
    localStorage.setItem('lng', JSON.stringify(lng));
    i18n.changeLanguage(lng)
    setIsShow(false);
  }

  useClickOutside(expandRef, handleClickOutside);
  useEffect(() => {
    const handleStorageChange = () => {
      const ids = getLocalFavoriteProductId(userLogin?.user.id);
      setListId(ids);
    }
    //khi login tk khác cần listen lại event(vì khác context)
    window.addEventListener(`FavoriteDataEvent_${userLogin?.user?.id}`, handleStorageChange);

    return () => {
      window.removeEventListener(`FavoriteDataEvent_${userLogin?.user?.id}`, handleStorageChange);
    };
  }, [userLogin?.user?.id])

  useEffect(() => {
    const handleStorageChange = () => {
      const productIds = getLocalProductQuantity(userLogin?.user.id);
      setListProductId(productIds);
    }
    //khi login tk khác cần listen lại event(vì khác context)
    window.addEventListener(`CartDataEvent_${userLogin?.user?.id}`, handleStorageChange);

    return () => {
      window.removeEventListener(`CartDataEvent_${userLogin?.user?.id}`, handleStorageChange);
    };
  }, [userLogin?.user?.id])

  useEffect(() => {
    const ids = getLocalFavoriteProductId(userLogin?.user?.id);
    setListId(ids);
  }, [userLogin?.user?.id])

  useEffect(() => {

    const ids = getLocalProductQuantity(userLogin?.user?.id);
    setListProductId(ids);
  }, [userLogin?.user?.id])


  const handleLogout = async () => {
    dispatch(logoutStart())
    let res
    try {
      res = await postLogout(`/auth/logout`, {
        userId: userLogin?.user?.id
      }, {})
      dispatch(logoutSuccess(res?.data))
      navigate("/login");
      window.location.reload();
    } catch (error) {
      dispatch(logoutFailed(res?.data))
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
            <p>{t('top-header-title')}</p>
            <a href="/" className={cx("top-header-shop")}>{t('shop-now')}</a>
          </div>
          <div className={cx("top-header-language")} ref={expandRef}>
            <span>{t('language')}</span>
            <i className="fa-solid fa-angle-down" onClick={handleShowLanguage} ></i>
            {isShow && <div className={cx("select-option")}>
              {LANGUAGE.map(lng => (
                <span
                  style={{
                    backgroundColor: i18n.language == lng.key ? "var(--text-gray-500)" : "unset",
                    cursor: i18n.language == lng.key ? "default" : "pointer"
                  }}
                  key={lng.key}
                  onClick={i18n.language != lng.key ? () => handleChangeLanguage(lng.key) : () => { }}
                >
                  {lng.value}
                </span>
              ))}
            </div>}
          </div>
        </div>
      </div>
      <div className={cx("header-wrapper", {
        "hidden-top-header": toggleTopHeader
      })}>
        <div className={cx("header-container")}>
          <div className={cx("left-header")}>
            <Link to="/">MT Store</Link>
            <Link to="/" className={cx({
              "underline": location.pathname == "/",
              "hover-underline": location.pathname != "/"
            })}>{t('home')}</Link>
            <Link to="/contact" className={cx({
              "underline": location.pathname == "/contact",
              "hover-underline": location.pathname != "/contact"
            })}>{t('contact')}</Link>
            <Link to="/about" className={cx({
              "underline": location.pathname == "/about",
              "hover-underline": location.pathname != "/about"
            })}>{t('about')}</Link>
            {!userLogin && <Link to="/register" className={cx({
              "underline": location.pathname == "/register",
              "hover-underline": location.pathname != "/register"
            })}>{t('sign-up')}</Link>}
          </div>
          <div className={cx("right-header")}>
            <div className={cx("input-search")}>
              <input type="text" name="search" id="search" placeholder={t('search-placeholder')} />
              <i className={cx("icon-search", "fa-solid fa-magnifying-glass")}></i>
            </div>
            {userLogin && (location.pathname !== "/favorite" ? <Link to="/favorite" className={cx("favorite-wrapper")}>
              <span className={cx("favorite-quantity")}>{listId.length || 0}</span>
              <i className={cx("icon-heart", "fa-regular fa-heart")}></i>
            </Link> :
              <div className={cx("wrapper-active")}>
                <span className={cx("favorite-quantity-active")}>{listId.length || 0}</span>
                <i className={cx("icon-heart", "fa-solid fa-heart", "active")}></i>
              </div>
            )}
            {userLogin ? <Link to="/cart" className={cx("cart-icon")}>
              <span className={cx("cart-quantity", {
                "cart-quantity-active": location.pathname === "/cart",
              })}>{listProductId?.reduce((sum, elm) => sum + elm.quantity, 0) || 0}</span>
              <AddShoppingCartIcon className={cx("icon-cart", {
                "cart-icon-active": location.pathname === "/cart",
              })} />
            </Link> : <Link to="/login" className={cx("cart-icon")}>
              <span className={cx("cart-quantity")}>{0}</span> <AddShoppingCartIcon className={cx("icon-cart", {
                "cart-icon-active": location.pathname === "/cart",
              })} />
            </Link>}
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
                    {MENU.map((item, i) => {
                      return (
                        item.to ? <li key={i}>
                          <Link style={{
                            textDecoration: 'none',
                          }}
                            to={item.to}
                          >
                            <i className={item.icon}></i>
                            <span
                              style={{
                                marginLeft: "15px"
                              }}
                            >{item.title}</span>
                          </Link>
                        </li> : <li onClick={handleLogout} key={i}>
                          <i className={item.icon}></i>
                          {item.title}
                        </li>
                      )
                    })}
                  </ul>
                </animated.div>
              )}
            >
              <span className={cx("user-info")}>
                <Avatar src={userLogin?.user?.url || defaultAvatar} alt={userLogin?.user?.avatar || "Default Avatar"} width="32" height="32" />
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
