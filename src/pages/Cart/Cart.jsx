import classNames from "classnames/bind";
import styles from "./Cart.module.scss";
import { useEffect, useState } from "react";
import { getLocalProductQuantity } from "../../services/cartService";
import { useSelector } from "react-redux";
import useCustomFetch from "../../hooks/useCustomFetch";
import queryString from "query-string";
import { Breadcrumbs } from "@mui/material";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const cx = classNames.bind(styles)

const Cart = () => {

  const userLogin = useSelector(state => state?.auth?.login?.currentUser);
  const [listProductId, setListProductId] = useState(getLocalProductQuantity(userLogin?.user?.id) || []);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [getListProduct] = useCustomFetch();

  const navigate = useNavigate();

  useEffect(() => {

    const fetchData = async () => {
      try {
        setLoading(true);

        const queryStringData = queryString.stringify({ filter: JSON.stringify({ id: listProductId?.map(p => p.id) }) })

        const response = await getListProduct(`/Admin/products?${queryStringData}`);
        setProducts(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();

  }, [listProductId])

  function handleClick(event) {
    event.preventDefault();
    if (!event.target.href?.split("/")[3]) {
      navigate("/")
    }
  }

  return (
    <div className={cx("cart-container")}>
      <div role="presentation" onClick={handleClick} className={cx("breadcrumb")}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link
            underline="hover"
            color="text.primary"
            href="/cart"
            aria-current="page"
          >
            Cart
          </Link>
        </Breadcrumbs>
      </div>
      <section className={cx("cart-section")}>
        <div className={cx("card-header")}>
          <span>Product</span>
          <span>Price</span>
          <span>Quantity</span>
          <span>Subtotal</span>
        </div>
        <div className={cx("card-product")}>
          <div className={cx("card-product-item")}>
            <div className={cx("product-image")}>
              <div className={cx("product-image-wrapper")}>
                <LazyLoadImage
                  className={cx("product-thumb")}
                  src="https://e-commerce-pied-xi.vercel.app/_next/image?url=%2Fimages%2Fproducts%2Fkeyboard.webp&w=256&q=75"
                  effect="blur"
                ></LazyLoadImage>
                <div className={cx("remove-btn")}>
                  <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 15 15" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor"></path></svg>
                </div>
              </div>
              <p className={cx("product-title")}>AK-900 Wired Keyboard</p>
            </div>
            <div className={cx("product-price")}>
              <p className={cx("product-price-sale")}>$406</p>
              <p className={cx("product-price-real")}>$1600</p>
            </div>
            <div className={cx("product-quantity")}>
              <div>
                <span className={cx("product-quantity-count")}>11</span>
                <div className={cx("product-quantity-input")}>
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M128 320l128-128 128 128z"></path></svg><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M128 192l128 128 128-128z"></path></svg>
                </div>
              </div>
            </div>
            <div className={cx("product-subtotal")}>
              <span>$4666</span>
            </div>
            <label className={cx("form-control")}>
              <input type="checkbox" name="checkbox" />
            </label>
          </div>
        </div>
      </section>
    </div>
  )
};

export default Cart;
