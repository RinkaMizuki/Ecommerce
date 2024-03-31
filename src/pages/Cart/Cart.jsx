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
import { ToastContainer, toast } from "react-toastify";
import { applyCouponProduct, getCouponProduct } from "../../services/couponService";

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
  const [totalPrice, setTotalPrice] = useState(0);
  const [getListProduct] = useCustomFetch();
  const [checkedItems, setCheckedItems] = useState(listProductId.map(item => true));

  const navigate = useNavigate();

  const handleCheckboxChange = (index) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
    setTotalPrice(0);
    setCouponCode("");
  };

  useEffect(() => {

    const fetchData = async () => {
      try {

        if (listProductId.length !== 0) {
          setLoading(true);

          const queryStringData = queryString.stringify({
            filter: JSON.stringify({ id: listProductId?.map(p => p.id) }),
            sort: JSON.stringify(["", "ASC"]),
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
    const handleStorageChange = () => {
      const productIds = getLocalProductQuantity(userLogin?.user.id);
      setListProductId(productIds);
    }
    //khi login tk khác cần listen lại event(vì khác context)
    window.addEventListener(`CartDataEvent_${userLogin?.user?.id}`, handleStorageChange);

    return () => {
      window.removeEventListener(`CartDataEvent_${userLogin?.user?.id}`, handleStorageChange);
      localStorage.setItem('tranId', JSON.stringify(""));
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

    return products?.filter((p, index) => checkedItems[index])?.reduce((sum, p) => (sum + ((p?.price * p.cartQuantity) * (1 - p?.discount / 100))), 0);
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
      setTotalPrice(response.totalPrice)
      toast.success(response.message, toastOptions)
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, toastOptions);
    }
  }

  const handleSelectCoupon = (code) => {
    if (couponCode === code) {
      setCouponCode("");
      setTotalPrice(0);
    } else {
      setCouponCode(code);
    }
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
              <CartItem p={p} key={p.id} userId={userLogin?.user?.id} index={index} checkedItems={checkedItems} handleCheckboxChange={handleCheckboxChange} setTotalPrice={setTotalPrice} setCouponCode={setCouponCode} />
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
          <div className={cx("coupon-input")}>
            <input type="text" placeholder="Coupon Code" onChange={(e) => {
              if (!e.target.value) {
                setTotalPrice(0)
              }
              setCouponCode(e.target.value)
            }} value={couponCode} />
            <Button
              className={cx("btn-apply")}
              onClick={handleApplyCoupon}
              disable={checkedItems.every(bool => !bool) || !couponCode}
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
                            <div data-testid="vcRadioButton" className={cx("coupon-checkbox")} aria-label="" role="radio" aria-checked="false" tabIndex="0" style={{
                              cursor: ((totalPrice < minAmount && minAmount != 0) || (totalPrice > maxAmount && maxAmount != 0)) ? "not-allowed" : "pointer"
                            }} onClick={() => handleSelectCoupon(c.couponCode)}>
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
              <p>{totalPrice ? totalPrice?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : calcSubtotal().toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
            </div>
            <div>
              <p>Shipping</p>
              <p>Free</p>
            </div>
            <div>
              <p>Total</p>
              <p>{totalPrice ? totalPrice?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : calcSubtotal().toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</p>
            </div>
          </div>
          <Button to={{
            pathname: "/cart/checkout",
          }}
            state={{
              products,
              price: totalPrice || calcSubtotal(),
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
