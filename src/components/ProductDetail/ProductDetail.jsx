import { Breadcrumbs } from "@mui/material";
import styles from "./ProductDetail.module.scss";
import classNames from "classnames/bind";
import Link from '@mui/material/Link';
import useCustomFetch from "../../hooks/useCustomFetch";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import productImage from "../../assets/images/playstation5white.png";
import StarRatings from "react-star-ratings";
import ReactHtmlParser from "react-html-parser"
import Button from "../Button/Button";

const cx = classNames.bind(styles);

const ProductDetail = () => {

  const [getData] = useCustomFetch();
  const [category, setCategory] = useState({});
  const [product, setProduct] = useState({});
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const productResponse = await getData(`Admin/products/${params.productId}`);
      const categoryResponse = await getData(`Admin/categories/${productResponse.data.categoryId}`);

      setCategory(categoryResponse.data)
      setProduct(productResponse.data)
    }
    fetchData();
  }, [])

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

  return (
    <div className={cx("main-container")}>
      <div role="presentation" onClick={handleClick} style={{ marginTop: "10px" }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link
            underline="hover"
            color="text.primary"
            href={`/category/${category.id}`}
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
          {product?.productImages?.slice(0, 4).map(p => (
            <img src={p.url} alt={p.image} key={p.productImageId} />
          ))}
        </div>
        <div className={cx("product-thumbnail")}>
          <img src={product?.url} alt={product?.image} />
        </div>
        <div className={cx("product-info")}>
          <h2 className={cx("product-title")}>
            Havic HV G-92 Gamepad
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
              <span> &nbsp;{product?.quantity ? " In Stock" : "Out Stock"}</span>
            </span>
          </div>
          <div className={cx("product-price-wrapper")}>
            <span className={cx("product-price-sale")}>{(product?.price * (1 - product?.discount / 100)).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
            <span className={cx("product-price")}>{product?.price?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
          </div>
          <div className={cx("product-desc")}>{ReactHtmlParser(product?.description || "")}</div>
          <hr />
          <div className={cx("product-colors")}>
            <span>Colors: </span>
            {product?.productColors?.map(c => (
              <div
                style={{
                  backgroundColor: `#${c.colorCode}`,
                  border: `${color == c.colorCode ? "2px solid var(--white)" : "none"}`,
                  outline: `${color == c.colorCode ? "2px solid var(--black)" : "none"}`
                }}
                id={c.colorCode}
                className={cx("color")}
                onClick={(e) => handleChooseColor(e)}
                key={c.colorId}
              />
            ))}
          </div>
          <div className={cx("product-sell")}>
            <div className={cx("number-input")}>
              <button
                className={cx("minus")}
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
                className={cx("plus")}
                onClick={() => setQuantity(quantity + 1)}
              >+</button>
            </div>
            <Button className={cx("btn-buynow")}>Buy Now</Button>
            <span className={cx("heart-wrapper")}>
              <i className={cx("fa-regular fa-heart")}></i>
            </span>
          </div>
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
      <div className={cx("relate-container")}>
        "asd"
      </div>
    </div>
  )
};

export default ProductDetail;
