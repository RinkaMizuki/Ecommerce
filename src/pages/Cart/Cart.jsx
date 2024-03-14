import classNames from "classnames/bind";
import styles from "./Cart.module.scss";
import { useEffect, useState } from "react";
import { getLocalProductQuantity } from "../../services/cartService";
import { useSelector } from "react-redux";
import useCustomFetch from "../../hooks/useCustomFetch";
import queryString from "query-string";
import { Breadcrumbs } from "@mui/material";
import { default as LinkMui } from "@mui/material/Link";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/Button";
import CartItem from "./CartItem";
import { ToastContainer } from "react-toastify";
import { filter } from "lodash";
import { useRef } from "react";

const cx = classNames.bind(styles)

const Cart = () => {

  const userLogin = useSelector(state => state?.auth?.login?.currentUser);
  const [listProductId, setListProductId] = useState(getLocalProductQuantity(userLogin?.user?.id) || []);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [getListProduct] = useCustomFetch();
  const inputCouponRef = useRef(null);

  const [checkedItems, setCheckedItems] = useState(listProductId.map(item => true));

  const navigate = useNavigate();

  const handleCheckboxChange = (index) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
  };

  useEffect(() => {

    const fetchData = async () => {
      try {

        if (listProductId.length !== 0) {
          setLoading(true);

          const queryStringData = queryString.stringify({ filter: JSON.stringify({ id: listProductId?.map(p => p.id) }) })

          const response = await getListProduct(`/Admin/products?${queryStringData}`);

          setProducts(response.data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();

  }, [listProductId])

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
  }, [])

  function handleClick(event) {
    event.preventDefault();
    if (!event.target.href?.split("/")[3]) {
      navigate("/")
    }
  }

  const calcSubtotal = () => {

    listProductId.forEach(p => {
      const matchingProduct = products.find((prod, index) => prod.id === p.id && checkedItems[index]);
      if (matchingProduct) {
        matchingProduct.cartQuantity = p.quantity;
      }
    })

    return products?.filter((p, index) => checkedItems[index])?.reduce((sum, p) => (sum + ((p?.price * p.cartQuantity) * (1 - p?.discount / 100))), 0).toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
  }

  const handleApplyCoupon = () => {
    console.log(products.filter((p,index) => checkedItems[index]));
  }

  return (
    <div className={cx("cart-container")}>
      <ToastContainer
        style={{
          marginTop: "70px"
        }}
      ></ToastContainer>
      <div role="presentation" onClick={handleClick} className={cx("breadcrumb")}>
        <Breadcrumbs aria-label="breadcrumb">
          <LinkMui underline="hover" color="inherit" href="/">
            Home
          </LinkMui>
          <LinkMui
            underline="hover"
            color="text.primary"
            href="/cart"
            aria-current="page"
          >
            Cart
          </LinkMui>
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
          {products?.length !== 0 ? products?.map((p, index) => {
            return (
              <CartItem p={p} key={p.id} userId={userLogin?.user?.id} index={index} checkedItems={checkedItems} handleCheckboxChange={handleCheckboxChange} />
            )
          }) : <span className={cx("not-available")}>The product is not available in the shopping cart.</span>
          }
        </div>
        <div className={cx("btn-wrapper")}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <button className={cx("btn-return")}>Return To Shop</button>
          </Link>
          <button className={cx("btn-update")}>Update Cart</button>
        </div>
      </section>
      <section className={cx("total-section")}>
        <div className={cx("coupon-wrapper")}>
          <input type="text" placeholder="Coupon Code" ref={inputCouponRef}/>
          <Button className={cx("btn-apply")} onClick={handleApplyCoupon}>Apply coupon</Button>
        </div>
        <div className={cx("cart-total")}>
          <h3 className={cx("cart-title")}>Cart total</h3>
          <div className={cx("cart-price-detail")}>
            <div>
              <p>Subtotal</p>
              <p>{calcSubtotal()}</p>
            </div>
            <div>
              <p>Shipping</p>
              <p>Free</p>
            </div>
            <div>
              <p>Total</p>
              <p>{calcSubtotal()}</p>
            </div>
          </div>
          <Button to="/cart/checkout" className={cx("btn-checkout")}>Process To Checkout</Button>
        </div>
      </section>
    </div>
  )
};

export default Cart;
