import { Breadcrumbs } from "@mui/material";
import styles from "./ProductDetail.module.scss";
import classNames from "classnames/bind";
import Link from '@mui/material/Link';
import useCustomFetch from "../../hooks/useCustomFetch";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import StarRatings from "react-star-ratings";
import ReactHtmlParser from "react-html-parser"
import Button from "../Button/Button";
import ProductRelate from "../ProductRelate";
import { useSelector } from "react-redux";
import { getLocalFavoriteProductId, setLocalFavoriteProductId } from "../../services/favoriteService";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ProductReview from "../ProductReview";
import { ToastContainer, toast } from "react-toastify";
import { setLocalProductQuantity } from "../../services/cartService";
import ProductColor from "./ProductColor";

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

const ProductDetail = () => {

  const [getData] = useCustomFetch();
  const [category, setCategory] = useState({});
  const [product, setProduct] = useState({});
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const userLogin = useSelector(state => state.auth.login.currentUser);
  const [idFavorites, setIdFavorites] = useState(getLocalFavoriteProductId(userLogin?.user?.id));

  const colorRef = useRef(null);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await getData(`Admin/products/${params.productId}`);
        const categoryResponse = await getData(`Admin/categories/${productResponse.data.categoryId}`);
        setCategory(categoryResponse.data)
        setProduct(productResponse.data)
      }
      catch (error) {
        if (error.response?.status === 404) {
          navigate("/error", {
            replace: true,
          })
        }
        console.log(error);
      }
    }
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }, 100);
    fetchData();
  }, [params.productId])

  useEffect(() => {
    const handleStorageChange = () => {
      const ids = getLocalFavoriteProductId(userLogin?.user?.id);
      setIdFavorites(ids);
    }

    window.addEventListener(`FavoriteDataEvent_${userLogin?.user?.id}`, handleStorageChange);

    return () => {
      window.removeEventListener(`FavoriteDataEvent_${userLogin?.user?.id}`, handleStorageChange);
    };
  }, [])

  useEffect(() => {
    if (colorRef.current.children.length > 1) {
      const listColor = Array.from(colorRef.current.children).slice(1);
      setColor(listColor[0].getAttribute('id'));
    }
  }, [product])

  const handleChooseColor = (e) => {
    setColor(e.target.getAttribute("id"));
  }

  function handleClick(event) {
    event.preventDefault();
    const isExistRoute = event.target.href.split("/")[3];
    if (!isExistRoute) {
      navigate("/")
    }
    else if (isExistRoute == "category") {
      navigate(`/category/${event.target.href.split("/").pop()}`)
    }
  }

  const handleSaveFavorite = (id) => {
    if (!userLogin) {
      navigate("/login")
      return;
    }
    setLocalFavoriteProductId(id, userLogin.user.id)
  }

  const handleClickBuy = () => {
    const currentProductId = params.productId;
    toast.info("Products has been added to cart", toastOptions)
    setLocalProductQuantity(currentProductId, userLogin?.user?.id, quantity, "addMany", false, color)
  }

  return (
    <div className={cx("main-container")}>
      <ToastContainer style={{
        marginTop: "70px"
      }}></ToastContainer>
      <div role="presentation" onClick={handleClick} style={{ marginTop: "10px" }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link
            underline="hover"
            color="text.primary"
            href={`/category/${category.title}`}
            aria-current="category"
          >
            {category.title}
          </Link>
          <Link
            underline="hover"
            color="text.primary"
            href={`/product-detail/${product.id}`}
            aria-current="detail"
          >
            {product.title}
          </Link>
        </Breadcrumbs>
      </div>
      <div className={cx("product-container")}>
        <div className={cx("product-images")}>
          {product?.productImages?.slice(0, 5).map(p => (
            <div className={cx("product-background-image")} key={p.productImageId} >
              <LazyLoadImage
                src={p.url}
                alt={p.image}
                effect="blur"
                className={cx("lazy-image")}
              />
            </div>
          ))}
        </div>
        <div className={cx("product-background")}>
          <div className={cx("product-thumbnail")}>
            <LazyLoadImage
              className={cx("lazy-thumbnail")}
              src={product?.url}
              alt={product?.image}
              effect="blur"
            />
          </div>
        </div>
        <div className={cx("product-info")}>
          <h2 className={cx("product-title")}>
            {product?.title}
          </h2>
          <div className={cx("product-reviews-wrapper")}>
            <StarRatings
              rating={isNaN(product?.productRates?.reduce((sum, rate) => sum + rate.star, 0) / product?.productRates?.length) ? 0 : product?.productRates?.reduce((sum, rate) => sum + rate.star, 0) / product?.productRates?.length}
              starRatedColor="gold"
              numberOfStars={5}
              starDimension="17px"
              starSpacing="1px"
              name='rating'
            />
            <span className={cx("product-reviews")} style={{
              marginLeft: "5px"
            }}>
              ({product?.productRates?.length} Reviews)
              <span>&nbsp; &nbsp; |</span>
              <span> &nbsp;{product?.productStock?.stockQuantity ? " In Stock" : "Out Stock"}</span>
            </span>
          </div>
          <div className={cx("product-price-wrapper")}>
            <span className={cx("product-price-sale")}>{(product?.price * (1 - product?.discount / 100)).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
            <span className={cx("product-price")}>{product?.price?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
          </div>
          <div className={cx("product-desc")}>{ReactHtmlParser(product?.description || "")}</div>
          <hr />
          <div className={cx("product-colors")} ref={colorRef}>
            <span>Colors: </span>
            <ProductColor
              color={color}
              handleChooseColor={handleChooseColor}
              colors={product.productColors}
            />
          </div>
          <div className={cx("product-sell")}>
            <div className={cx("number-input")}>
              <button
                className={cx("minus")}
                disabled={quantity == 1}
                style={{
                  cursor: quantity == 1 ? "not-allowed" : "pointer"
                }}
                onClick={() => {
                  quantity > 1 && setQuantity(quantity - 1)
                }}>-</button>
              <input
                className={cx("quantity")}
                min="0"
                name="quantity"
                value={quantity}
                type="number"
                onChange={() => { }} />
              <button
                disabled={quantity >= product?.productStock?.stockQuantity}
                className={cx("plus", {
                  "plus-disabled": quantity >= product?.productStock?.stockQuantity
                })}
                style={{
                  cursor: quantity >= product?.productStock?.stockQuantity ? "not-allowed" : "pointer"
                }}
                onClick={() => setQuantity(quantity + 1)}
              >+</button>
            </div>
            <Button className={cx("btn-buynow")} onClick={handleClickBuy}>Buy Now</Button>
            <span className={cx("heart-wrapper")}
              onClick={() => { handleSaveFavorite(product.id) }}
            >
              {!idFavorites.includes(product?.id) || !userLogin ? <i className={cx("fa-regular fa-heart", "normal")}>
              </i> : <i className={cx("fa-solid fa-heart", "active")}></i>}
            </span>
          </div>
          <span className={cx("stock-text")}>We have <span className={cx("stock-quantity")}>{product?.productStock?.stockQuantity}</span> in Stock</span>
          <div className={cx("product-delivery")}>
            <div className={cx("free-delivery-wrapper")}>
              <i className="fa-solid fa-truck"></i>
              <div className={cx("free-delivery-info")}>
                <h2 className={cx("free-delivery-title")}>
                  Free Delivery
                </h2>
                <p className={cx("free-delivery-desc")}>
                  Enter your postal code for Delivery Availability
                </p>
              </div>
            </div>
            <div className={cx("line")}></div>
            <div className={cx("free-return-wrapper")}>
              <i className="fa-solid fa-recycle"></i>
              <div className={cx("free-return-info")}>
                <h2 className={cx("free-return-title")}>
                  Return Delivery
                </h2>
                <p className={cx("free-return-desc")}>
                  Free 30 Days Delivery Returns. Details
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductReview product={product} />
      <div className={cx("relate-container")}>
        {product?.categoryId && <ProductRelate categoryId={product?.categoryId}
          currentId={product.id}
          number={4}
        />}
      </div>
    </div>
  )
};

export default ProductDetail;
