import classNames from "classnames/bind";
import styles from "./Cart.module.scss";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { deleteLocalProduct, getLocalProductQuantity } from "../../services/cartService";
import { useSelector } from "react-redux";
import useCustomFetch from "../../hooks/useCustomFetch";
import queryString from "query-string";
import { Breadcrumbs } from "@mui/material";
import { default as LinkMui } from "@mui/material/Link";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/Button";
import CartItem from "./CartItem";
import { ToastContainer, toast } from "react-toastify";
import { applyCouponProduct, getCouponProduct } from "../../services/couponService";
import { Helmet } from "react-helmet";

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

const cx = classNames.bind(styles)

const Cart = () => {

  const userLogin = useSelector(state => state?.auth?.login?.currentUser);
  const [listProductId, setListProductId] = useState(getLocalProductQuantity(userLogin?.user?.id) || []);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [totalPrice, setTotalPrice] = useState(-1);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [getListProduct] = useCustomFetch();
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [checkedItems, setCheckedItems] = useState(listProductId.map(item => true));

  const checkCouponRef = useRef(null);

  const navigate = useNavigate();

  const handleCheckboxChange = (index, productId) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
    setListProductId((preList) => {
      return preList.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            active: !p.active
          }
        }
        return p;
      });
    })
    setTotalPrice(-1);
    setCouponCode("");
    setTotalDiscount(0);
  };
  useLayoutEffect(() => {

    const fetchData = async () => {
      try {
        if (listProductId.length !== 0) {
          setLoading(true);
          const queryStringData = queryString.stringify({
            filter: JSON.stringify({ id: listProductId?.map(p => p.id) }),
            range: JSON.stringify([0, listProductId.length - 1]),
          })
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
    const fetchData = async () => {
      try {
        const response = await getCouponProduct("/Admin/coupons");
        setCoupons(response);
      }
      catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [])

  useEffect(() => {

    window.scrollTo({
      behavior: "smooth",
      top: 0,
    })

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

  const handleRemoveAllCart = () => {
    deleteLocalProduct(userLogin?.user?.id)
    setProducts([])
  }

  const calcSubtotal = () => {

    listProductId.forEach(p => {
      const matchingProduct = products.find((prod, index) => {
        const isSameProd = prod.id === p.id;
        if (isSameProd) {
          prod.avaiable = p.active;
        }
        return isSameProd && checkedItems[index]
      });
      if (matchingProduct) {
        matchingProduct.cartQuantity = p.quantity;
        matchingProduct.color = p.color;
      }
    })

    return products?.filter((p, index) => checkedItems[index] && p.avaiable)?.reduce((sum, p) => (sum + ((p?.price * p.cartQuantity) * (1 - p?.discount / 100))), 0);
  }

  const handleApplyCoupon = async () => {
    try {
      const productInfo = products.filter((p, index) => checkedItems[index]).map(p => ({
        productId: p.id,
        quantity: p.cartQuantity
      }))
      const data = {
        listProductInfo: productInfo,
        couponCode: couponCode.toUpperCase()
      }

      const response = await applyCouponProduct("/Cart/coupon", data, {
        headers: {
          "Content-Type": "application/json",
        }
      });
      setTotalPrice(response.price.total)
      setTotalDiscount(response.price.amountDiscount)
      setIsCouponApplied(true)
      toast.success(response.message, toastOptions)
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, toastOptions);
    }
  }

  const handleSelectCoupon = (e, code) => {
    if (couponCode === code) {
      setCouponCode("");
    } else {
      setCouponCode(code);
    }
    setTotalPrice(-1);
    setTotalDiscount(0);
    setIsCouponApplied(false)
  }

  return (
    <div className={cx("cart-container")} style={{
      height: !products?.length ? "200vh" : "unset"
    }}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>MT Store - Cart</title>
        <link rel="canonical" href={`${window.location.origin}/cart`} />
      </Helmet>
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
          <span>Colors</span>
          <span>Price</span>
          <span>Quantity</span>
          <span>Subtotal</span>
        </div>
        <div className={cx("card-product")}>
          {products?.length !== 0 ? products?.map((p, index) => {
            return (
              <CartItem
                key={p.id}
                p={p}
                userId={userLogin?.user?.id}
                index={index}
                checkedItems={checkedItems}
                handleCheckboxChange={handleCheckboxChange}
                setTotalPrice={setTotalPrice}
                setCouponCode={setCouponCode}
              />
            )
          }) : <span className={cx("not-available")}>The product is not available in the shopping cart.</span>
          }
        </div>
        <div className={cx("btn-wrapper")}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <button className={cx("btn-return")}>Return To Shop</button>
          </Link>
          <button className={cx("btn-update")} onClick={handleRemoveAllCart}>Clear Cart</button>
        </div>
      </section>
      <section className={cx("total-section")}>
        <div className={cx("coupon-wrapper")}>
          <div className={cx("coupon-input")}>
            <input type="text" placeholder="Coupon Code" onChange={(e) => {
              if (!e.target.value) {
                setTotalPrice(-1)
              }
              setCouponCode(e.target.value)
            }} value={couponCode} />
            <Button
              className={cx("btn-apply")}
              onClick={handleApplyCoupon}
              disable={checkedItems.every(bool => !bool) || !couponCode || isCouponApplied}
            >Apply Coupon</Button>
          </div>
          <div className={cx("coupon-list-wrapper")}>
            <div className={cx("coupon-list")}>
              {coupons?.filter(c => c.isActive).map(c => {

                const maxDiscount = c?.couponConditions.find(cc => cc.condition.attribute === "max_discount")?.value || 0;
                const minAmount = c?.couponConditions.find(cc => cc.condition.attribute === "min_amount")?.value || 0;
                const maxAmount = c?.couponConditions.find(cc => cc.condition.attribute === "max_amount")?.value || 0;
                const totalPrice = calcSubtotal();

                return (
                  <div key={c.id}>
                    <div className={cx("coupon-cart")} style={{
                      opacity: (totalPrice < minAmount && minAmount != 0) || (totalPrice > maxAmount && maxAmount != 0) ? 0.5 : 1
                    }}>
                      <div className={cx("cart-left")}>
                        <div className={cx("sawtooth")}></div>
                      </div>
                      <div className={cx("cart-right")}>
                      </div>
                      <div className={cx("coupon-hidden")}></div>
                      <div className={cx("coupon-cart-item")}>
                        <div className={cx("coupon-template-left")}>
                          <div className={cx("coupon-logo")}>
                            <img src="https://cf.shopee.vn/file/e6a3b7beffa95ca492926978d5235f79" alt="Logo" />
                          </div>
                          <p>MT Store</p>
                        </div>
                        <div className={cx("coupon-template-middle")}>
                          <p><span>Giảm {c?.discountPercent}%</span>{maxDiscount && `, Giảm tối đa ₫${parseInt(maxDiscount.toString().slice(0, -3))}k`}</p>
                          {minAmount && <p>Đơn Tối Thiểu ₫{parseInt(minAmount.toString().slice(0, -3))}k</p>}
                          {!!maxAmount && <p>Đơn Tối Đa ₫{parseInt(maxAmount.toString().slice(0, -3))}k</p>}
                        </div>
                        <div className={cx("coupon-template-right")}>
                          <div className={cx("coupon-checkbox-wrapper")}>
                            <div data-testid="vcRadioButton" className={cx("coupon-checkbox")} aria-label="coupon" role="radio" aria-checked={couponCode === c.couponCode ? 'true' : 'false'} data-coupon={c.couponCode} tabIndex="0" style={{
                              cursor: ((totalPrice < minAmount && minAmount != 0) || (totalPrice > maxAmount && maxAmount != 0)) ? "not-allowed" : "pointer"
                            }} ref={checkCouponRef} onClick={(e) => handleSelectCoupon(e, c.couponCode)}>
                              <i className={cx("fa-solid fa-check", "icon-check")}
                                style={{
                                  display: couponCode.toUpperCase() === c.couponCode.toUpperCase() && !((totalPrice < minAmount && minAmount != 0) || (totalPrice > maxAmount && maxAmount != 0)) ? "block" : "none"
                                }}
                              ></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={cx("coupon-stack")}>
                      <div className={cx("coupon-stack-left")}></div>
                    </div>
                  </div>)
              })}
            </div>
          </div>
        </div>
        <div className={cx("cart-total")}>
          <h3 className={cx("cart-title")}>Cart Total</h3>
          <div className={cx("cart-price-detail")}>
            <div>
              <p>Subtotal</p>
              <p>{calcSubtotal().toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
            </div>
            <div>
              <p>Discount</p>
              <p>{totalDiscount.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
            </div>
            <div>
              <p>Shipping</p>
              <p>Free</p>
            </div>
            <div>
              <p>Total</p>
              <p>{totalPrice >= 0 ? totalPrice?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : calcSubtotal().toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
            </div>
          </div>
          <Button to={{
            pathname: "/cart/checkout",
          }}
            state={{
              products,
              totalDiscount,
              totalPrice: totalPrice >= 0 ? totalPrice : calcSubtotal(),
              subTotal: calcSubtotal(),
              coupon: coupons.find(c => c.couponCode == couponCode),
            }}
            className={cx("btn-checkout")}
            disable={checkedItems.every(bool => !bool)}
          >Process To Checkout</Button>
        </div>
      </section >
    </div >
  )
};

export default Cart;
