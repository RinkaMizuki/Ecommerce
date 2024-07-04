import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import classNames from "classnames/bind";
import { useDispatch, useSelector } from "react-redux";
import Tippy from "@tippyjs/react/headless";
import "tippy.js/dist/tippy.css";
import {
    logoutFailed,
    logoutStart,
    logoutSuccess,
} from "../../../redux/authSlice";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useSpring, animated } from "@react-spring/web";
import { getLocalFavoriteProductId } from "../../../services/favoriteService";
import { getLocalProductQuantity } from "../../../services/cartService";
import { useEffect, useRef, useState } from "react";
import defaultAvatar from "../../../assets/images/avatar.jpeg";
import Avatar from "../../../components/Avatar";
import { useTranslation } from "react-i18next";
import { useClickOutside } from "../../../hooks/useClickOutside";
import { post as postLogout } from "../../../services/ssoService";
import useDebounce from "../../../hooks/useDebounce";
import useCustomFetch from "../../../hooks/useCustomFetch";
import queryString from "query-string";
import ProductSearch from "../../../components/ProductSearch/ProductSearch";
import Sidebar from "../Sidebar";
import MenuIcon from "@mui/icons-material/Menu";
import {
    Popper,
    Button as ButtonMui,
    Grow,
    ClickAwayListener,
    MenuList,
    MenuItem,
    Paper,
} from "@mui/material";

const cx = classNames.bind(styles);

export const SHOW_PRODUCT_MAX = 4;

const LANGUAGE = [
    {
        key: "vi",
        value: "Tiếng việt",
    },
    {
        key: "en",
        value: "English",
    },
];

const MENU = [
    {
        title: "Manage My Account",
        icon: "fa-solid fa-user",
        to: "/manager/profile",
    },
    {
        title: "Manage My Orders",
        icon: "fa-solid fa-bag-shopping",
        to: "/manager/orders",
    },
    {
        title: "Manage My Reviews",
        icon: "fa-solid fa-star",
        to: "/manager/reviews",
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
    const userLogin = useSelector((state) => state.auth.login.currentUser);
    const [listId, setListId] = useState(
        getLocalFavoriteProductId(userLogin?.user?.id)
    );
    const [listProductId, setListProductId] = useState(
        getLocalProductQuantity(userLogin?.user?.id)
    );
    const [productTitle, setProductTitle] = useState("");
    const [products, setProducts] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [getList] = useCustomFetch();

    const config = { tension: 300, friction: 20 };
    const initialStyles = { opacity: 0, transform: "scale(0.5)" };
    const [props, setSpring] = useSpring(() => initialStyles);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === "Tab") {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === "Escape") {
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    const handleShowLanguage = () => {
        setIsShow(!isShow);
    };
    const handleClickOutside = () => {
        setIsShow(false);
    };

    const handleChangeLanguage = (lng) => {
        localStorage.setItem("lng", JSON.stringify(lng));
        i18n.changeLanguage(lng);
        setIsShow(false);
    };

    const debounced = useDebounce(productTitle, 500);

    useEffect(() => {
        if (debounced.trim() != "") {
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const queryStringData = queryString.stringify({
                        filter: JSON.stringify({ q: debounced }),
                        range: JSON.stringify([0, SHOW_PRODUCT_MAX]),
                    });
                    const res = await getList(
                        `/Admin/products?${queryStringData}`
                    );
                    setProducts(res.data);
                } catch (err) {
                    console.log(err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        } else {
            setProducts(null);
        }
    }, [debounced]);

    useClickOutside(expandRef, handleClickOutside);
    useEffect(() => {
        const handleStorageChange = () => {
            const ids = getLocalFavoriteProductId(userLogin?.user.id);
            setListId(ids);
        };
        //khi login tk khác cần listen lại event(vì khác context)
        window.addEventListener(
            `FavoriteDataEvent_${userLogin?.user?.id}`,
            handleStorageChange
        );

        return () => {
            window.removeEventListener(
                `FavoriteDataEvent_${userLogin?.user?.id}`,
                handleStorageChange
            );
        };
    }, [userLogin?.user?.id]);

    useEffect(() => {
        const handleStorageChange = () => {
            const productIds = getLocalProductQuantity(userLogin?.user.id);
            setListProductId(productIds);
        };
        //khi login tk khác cần listen lại event(vì khác context)
        window.addEventListener(
            `CartDataEvent_${userLogin?.user?.id}`,
            handleStorageChange
        );

        return () => {
            window.removeEventListener(
                `CartDataEvent_${userLogin?.user?.id}`,
                handleStorageChange
            );
        };
    }, [userLogin?.user?.id]);

    useEffect(() => {
        const ids = getLocalFavoriteProductId(userLogin?.user?.id);
        setListId(ids);
    }, [userLogin?.user?.id]);

    useEffect(() => {
        const ids = getLocalProductQuantity(userLogin?.user?.id);
        setListProductId(ids);
    }, [userLogin?.user?.id]);

    useEffect(() => {
        if (location.pathname.includes("/product/")) {
            const fetchData = async () => {
                const response = await getList("/Admin/categories");
                setCategories(response.data);
            };
            fetchData();
        }
    }, []);

    const handleLogout = async () => {
        dispatch(logoutStart());
        try {
            const res = await postLogout(`/auth/logout`, {
                userId: userLogin?.user?.id,
            });
            dispatch(logoutSuccess(res?.data));
            navigate("/login");
        } catch (error) {
            dispatch(logoutFailed(error?.response.data));
        }
    };

    function onMount() {
        setSpring.start({
            opacity: 1,
            transform: "scale(1)",
            onRest: () => {},
            config,
        });
    }

    function onHide({ unmount }) {
        setSpring.start({
            ...initialStyles,
            onRest: unmount,
            config: { ...config, clamp: true },
        });
    }

    return (
        <div>
            <div className={cx("wrapper")}>
                <div className={cx("top-header-wrapper")}>
                    <div className={cx("top-header-item-wrapper")}>
                        <p>{t("top-header-title")}</p>
                        <a href="/" className={cx("top-header-shop")}>
                            {t("shop-now")}
                        </a>
                    </div>
                    <div className={cx("top-header-language")} ref={expandRef}>
                        <span>{t("language")}</span>
                        <i
                            className="fa-solid fa-angle-down"
                            onClick={handleShowLanguage}
                        ></i>
                        {isShow && (
                            <div className={cx("select-option")}>
                                {LANGUAGE.map((lng) => (
                                    <span
                                        style={{
                                            backgroundColor:
                                                i18n.language == lng.key
                                                    ? "var(--text-gray-500)"
                                                    : "unset",
                                            cursor:
                                                i18n.language == lng.key
                                                    ? "default"
                                                    : "pointer",
                                        }}
                                        key={lng.key}
                                        onClick={
                                            i18n.language != lng.key
                                                ? () =>
                                                      handleChangeLanguage(
                                                          lng.key
                                                      )
                                                : () => {}
                                        }
                                    >
                                        {lng.value}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div
                className={cx("header-wrapper", {
                    "hidden-top-header": toggleTopHeader,
                })}
            >
                <div className={cx("header-container")}>
                    <div className={cx("left-header")}>
                        <div>
                            <Link to="/">MT Store </Link>
                            {location.pathname.includes("/product/") && (
                                <>
                                    <ButtonMui
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "5px",
                                        }}
                                        variant="outlined"
                                        ref={anchorRef}
                                        id="composition-button"
                                        aria-controls={
                                            open
                                                ? "composition-menu"
                                                : undefined
                                        }
                                        aria-expanded={
                                            open ? "true" : undefined
                                        }
                                        aria-haspopup="true"
                                        onClick={handleToggle}
                                    >
                                        <MenuIcon />
                                        <span
                                            style={{
                                                lineHeight: 1,
                                            }}
                                        >
                                            Danh mục
                                        </span>
                                    </ButtonMui>
                                    <Popper
                                        sx={{
                                            zIndex: 999,
                                        }}
                                        anchorEl={anchorRef.current}
                                        open={open}
                                        role={undefined}
                                        placement="bottom-start"
                                        transition
                                        disablePortal
                                    >
                                        {({ TransitionProps, placement }) => (
                                            <Grow
                                                {...TransitionProps}
                                                style={{
                                                    transformOrigin:
                                                        placement ===
                                                        "bottom-start"
                                                            ? "left top"
                                                            : "left bottom",
                                                }}
                                            >
                                                <Paper>
                                                    <ClickAwayListener
                                                        onClickAway={
                                                            handleClose
                                                        }
                                                    >
                                                        <MenuList
                                                            autoFocusItem={open}
                                                            sx={{
                                                                padding: "0",
                                                            }}
                                                            id="composition-menu"
                                                            aria-labelledby="composition-button"
                                                            onKeyDown={
                                                                handleListKeyDown
                                                            }
                                                        >
                                                            <Sidebar
                                                                categories={
                                                                    categories
                                                                }
                                                                isShowLine={
                                                                    false
                                                                }
                                                                style={{
                                                                    margin: "0",
                                                                    alignSelf:
                                                                        "flex-start",
                                                                }}
                                                                className={cx(
                                                                    "custom-sidebar"
                                                                )}
                                                            />
                                                        </MenuList>
                                                    </ClickAwayListener>
                                                </Paper>
                                            </Grow>
                                        )}
                                    </Popper>
                                </>
                            )}
                        </div>
                        <Link
                            to="/"
                            className={cx({
                                underline: location.pathname == "/",
                                "hover-underline": location.pathname != "/",
                            })}
                        >
                            {t("home")}
                        </Link>
                        <Link
                            to="/contact"
                            className={cx({
                                underline: location.pathname == "/contact",
                                "hover-underline":
                                    location.pathname != "/contact",
                            })}
                        >
                            {t("contact")}
                        </Link>
                        <Link
                            to="/about"
                            className={cx({
                                underline: location.pathname == "/about",
                                "hover-underline":
                                    location.pathname != "/about",
                            })}
                        >
                            {t("about")}
                        </Link>
                        {!userLogin && (
                            <Link
                                to="/register"
                                className={cx({
                                    underline: location.pathname == "/register",
                                    "hover-underline":
                                        location.pathname != "/register",
                                })}
                            >
                                {t("sign-up")}
                            </Link>
                        )}
                    </div>
                    <div className={cx("right-header")}>
                        <div className={cx("input-search")}>
                            <input
                                type="text"
                                name="search"
                                id="search"
                                placeholder={t("search-placeholder")}
                                value={productTitle}
                                onChange={(e) =>
                                    setProductTitle(e.target.value.trim())
                                }
                            />
                            {!isLoading ? (
                                <i
                                    className={cx(
                                        "icon-search",
                                        "fa-solid fa-magnifying-glass"
                                    )}
                                ></i>
                            ) : (
                                <i
                                    className={cx(
                                        "fa-solid fa-spinner",
                                        "icon-loading"
                                    )}
                                />
                            )}
                            {products != null && (
                                <ProductSearch
                                    products={products}
                                    onHideListSearch={setProducts}
                                    onClearInputSearch={setProductTitle}
                                />
                            )}
                        </div>
                        {userLogin &&
                            (location.pathname !== "/favorite" ? (
                                <Link
                                    to="/favorite"
                                    className={cx("favorite-wrapper")}
                                >
                                    <span className={cx("favorite-quantity")}>
                                        {listId.length || 0}
                                    </span>
                                    <i
                                        className={cx(
                                            "icon-heart",
                                            "fa-regular fa-heart"
                                        )}
                                    ></i>
                                </Link>
                            ) : (
                                <div className={cx("wrapper-active")}>
                                    <span
                                        className={cx(
                                            "favorite-quantity-active"
                                        )}
                                    >
                                        {listId.length || 0}
                                    </span>
                                    <i
                                        className={cx(
                                            "icon-heart",
                                            "fa-solid fa-heart",
                                            "active"
                                        )}
                                    ></i>
                                </div>
                            ))}
                        {userLogin ? (
                            <Link to="/cart" className={cx("cart-icon")}>
                                <span
                                    className={cx("cart-quantity", {
                                        "cart-quantity-active":
                                            location.pathname === "/cart",
                                    })}
                                >
                                    {listProductId?.reduce(
                                        (sum, elm) => sum + elm.quantity,
                                        0
                                    ) || 0}
                                </span>
                                <AddShoppingCartIcon
                                    className={cx("icon-cart", {
                                        "cart-icon-active":
                                            location.pathname === "/cart",
                                    })}
                                />
                            </Link>
                        ) : (
                            <Link to="/login" className={cx("cart-icon")}>
                                <span className={cx("cart-quantity")}>{0}</span>{" "}
                                <AddShoppingCartIcon
                                    className={cx("icon-cart", {
                                        "cart-icon-active":
                                            location.pathname === "/cart",
                                    })}
                                />
                            </Link>
                        )}
                        {userLogin && (
                            <Tippy
                                duration={500}
                                animation={true}
                                onMount={onMount}
                                onHide={onHide}
                                placement="bottom-end"
                                interactive={true}
                                render={(attrs) => (
                                    <animated.div
                                        className={cx("menu-container")}
                                        style={props}
                                        tabIndex="-1"
                                        {...attrs}
                                    >
                                        <ul className={cx("menu-dropdown")}>
                                            {MENU.map((item, i) => {
                                                return item.to ? (
                                                    <li key={i}>
                                                        <Link
                                                            style={{
                                                                textDecoration:
                                                                    "none",
                                                            }}
                                                            to={item.to}
                                                        >
                                                            <i
                                                                className={
                                                                    item.icon
                                                                }
                                                            ></i>
                                                            <span
                                                                style={{
                                                                    marginLeft:
                                                                        "15px",
                                                                }}
                                                            >
                                                                {item.title}
                                                            </span>
                                                        </Link>
                                                    </li>
                                                ) : (
                                                    <li
                                                        onClick={handleLogout}
                                                        key={i}
                                                    >
                                                        <i
                                                            className={
                                                                item.icon
                                                            }
                                                        ></i>
                                                        {item.title}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </animated.div>
                                )}
                            >
                                <span className={cx("user-info")}>
                                    <Avatar
                                        src={
                                            userLogin?.user?.url ||
                                            defaultAvatar
                                        }
                                        alt={
                                            userLogin?.user?.avatar ||
                                            "Default Avatar"
                                        }
                                        width="32"
                                        height="32"
                                    />
                                </span>
                            </Tippy>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
