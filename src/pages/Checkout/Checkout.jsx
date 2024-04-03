import styles from "./Checkout.module.scss";
import classNames from "classnames/bind";
import { default as LinkMui } from "@mui/material/Link";
import { Breadcrumbs } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import Button from "../../components/Button";
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import useCustomFetch from "../../hooks/useCustomFetch";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useSelector } from "react-redux";
import { ModalContext } from "../../context/ModalContext";
import Skeleton from "react-loading-skeleton";

const cx = classNames.bind(styles);

const Checkout = () => {

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [listUserAddress, setListUserAddress] = useState([]);
  const [listDes, setListDes] = useState([]);
  const [desId, setDesId] = useState("");
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [noteContent, setNoteContent] = useState("");
  const emailInputRef = useRef(null);

  const idAddress = useSelector(state => state.address.idAddressSelected);
  const userLogin = useSelector(state => state.auth.login.currentUser.user);
  const isFetching = useSelector(state => state.address.isFetching);
  const { handleShowModalFormAddress, handleShowModalDelivery } = useContext(ModalContext);
  const [getListDes, postPaymentOrder] = useCustomFetch();
  const location = useLocation();
  const navigate = useNavigate();

  function handleClick(event) {
    event.preventDefault();
    if (event.target.href.includes("/cart/checkout")) {
      navigate(`/cart/checkout`);
    } else if (event.target.href.includes("/cart")) {
      navigate(`/cart`);
    }
    else {
      navigate("/")
    }
  }

  const handleFindDefaultAddress = () => {
    return listUserAddress?.find(add => idAddress ? add.id == idAddress : add.isDeliveryAddress);
  }
  const handleChoosePaymentMethod = (e) => {
    const payment = e.target.getAttribute("datapay");
    const desId = e.target.getAttribute("dataid");
    setDesId(desId);
    setPaymentMethod(payment);
  }

  useEffect(() => {
    window.scrollTo({
      behavior: "smooth",
      top: 0,
    })
    emailInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getListDes(`/Address/${userLogin.id}`);
        setListUserAddress(response.data);
      }
      catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [isFetching]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getListDes("/Admin/destinates");
        setListDes(response.data);
      }
      catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [])

  const handleCalcTotalDiscount = () => {
    const totalPriceProduct = location.state?.products?.reduce((prev, curr) => (prev + curr.price * curr.cartQuantity), 0);
    return totalPriceProduct - location.state.price;
  }

  const handleCalcTotalQuantity = () => {
    return location.state?.products?.reduce((prev, curr) => (
      prev + curr.cartQuantity
    ), 0);
  }
  const keyMap = {
    price: 'priceProduct',
    discount: 'discountProduct',
    id: "productId",
    cartQuantity: "quantityProduct",
  };

  function handleGetInfoProducts(arr, keyMap) {
    return arr.map(obj => {
      return Object.keys(obj).reduce((acc, key) => {
        if (keyMap.hasOwnProperty(key)) {
          acc[keyMap[key]] = obj[key];
        }
        return acc;
      }, {});
    });
  }

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleValidateEmail = () => {
    if (validateEmail(email)) {
      setIsValidEmail(true)
    }
    else {
      setIsValidEmail(false)
    }
  }

  const handlePayment = async () => {
    try {
      switch (paymentMethod) {
        case "vnpay":
          const paymentData = {
            destinationId: desId,
            merchantId: import.meta.env.VITE_ECOMMERCE_MERCHANT_ID,
            email,
            fullName: handleFindDefaultAddress()?.name,
            phone: handleFindDefaultAddress()?.phone,
            address: handleFindDefaultAddress()?.address,
            ward: handleFindDefaultAddress()?.district,
            district: handleFindDefaultAddress()?.city,
            city: handleFindDefaultAddress()?.state,
            country: "Việt Nam",
            totalDiscount: handleCalcTotalDiscount(),
            totalQuantity: handleCalcTotalQuantity(),
            requiredAmount: Math.floor(location.state?.price / 1000) * 1000,
            orderDetails: handleGetInfoProducts(location.state.products, keyMap),
            note: noteContent,
            couponId: location.state?.coupon?.id ?? null,
            userId: userLogin?.id
          };
          console.log(Math.floor(location.state?.price / 1000) * 1000);
          const res = await postPaymentOrder("/Payment/post", paymentData, {
            "Content-Type": "application/json"
          });
          window.location.replace(res.data.paymentUrl);
          break;
        case "cash":
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleFindPaymentId = () => {
    return listDes?.find(d => d?.desShortName?.toLowerCase() == "vnpay")?.destinationId;
  };

  return (
    <div className={cx("checkout-container")}>
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
          <LinkMui
            underline="hover"
            color="text.primary"
            href="/cart/checkout"
            aria-current="page"
          >
            Checkout
          </LinkMui>
        </Breadcrumbs>
      </div>
      <div className={cx("bill-wrapper")}>
        {listUserAddress.length ? <div className={cx("bill-info")}>
          <h1>Billing Details</h1>
          <div className={cx("fullname-input")}>
            <label htmlFor="name">Full Name*</label>
            <input type="text" id="name" value={handleFindDefaultAddress()?.name} disabled />
          </div>
          <div className={cx("numberphone-input")}>
            <label htmlFor="numberphone">Numer Phone*</label>
            <input type="text" id="numberphone" value={handleFindDefaultAddress()?.phone} disabled />
          </div>
          <div className={cx("email-input", {
            'valid-email': !isValidEmail,
          })}>
            <label htmlFor="email">Email*</label>
            <input ref={emailInputRef} type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={handleValidateEmail} onFocus={() => setIsValidEmail(true)} />
            {!isValidEmail && <span>The Email Invalid</span>}
          </div>
          <div className={cx("address-input")}>
            <label htmlFor="address">Address Detail*</label>
            <input type="text" id="address" value={handleFindDefaultAddress()?.address} disabled />
          </div>
          <div className={cx("ward-input")}>
            <label htmlFor="ward">Ward*</label>
            <input type="text" id="ward" value={handleFindDefaultAddress()?.district} disabled />
          </div>
          <div className={cx("district-input")}>
            <label htmlFor="district">District*</label>
            <input type="text" id="district" value={handleFindDefaultAddress()?.city} disabled />
          </div>
          <div className={cx("province-input")}>
            <label htmlFor="province">Province/City*</label>
            <input type="text" id="province" value={handleFindDefaultAddress()?.state} disabled />
          </div>
          <Button className={cx("btn-address")} onClick={() => handleShowModalDelivery(listUserAddress)}>
            <ChangeCircleIcon />
            Change Address</Button>
        </div> : <div className={cx("add-address-wrapper")}>
          <p>You don't have an address yet. Please create a new address.</p>
          <Button className={cx("btn-address")} onClick={() => handleShowModalFormAddress(null)}>
            <AddLocationIcon />
            Add Address</Button>
        </div>}
        <div className={cx("bill-product")}>
          <div className={cx("bill-product-list")}>
            {location.state?.products?.map(p => (
              <div className={cx("bill-product-item")} key={p.id}>
                <LazyLoadImage
                  style={{
                    width: "50px",
                    height: "50px",
                  }}
                  src={p.url}
                  alt={p.image}
                  effect="blur"
                />
                <div>
                  <p>{p.title} <span style={{
                    color: "var(--text-gray-700)"
                  }}>(x{p.cartQuantity})</span></p>
                  <div className={cx("product-price")}>
                    {p?.price ? <>
                      <span className={cx("product-price-sale")}>{(p?.price * (1 - p?.discount / 100)).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
                      <span className={cx("product-price-real")}>{p?.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
                    </> :
                      <Skeleton />
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={cx("bill-price-wrapper")}>
            <div className={cx("bill-price")}>
              <div className={cx("bill-sub")}>
                <p>SubTotal:</p>
                <span>{location?.state?.price?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
              </div>
              <span></span>
              <div className={cx("bill-ship")}>
                <p>Shipping:</p>
                <span>Free</span>
              </div>
              <span></span>
              <div className={cx("bill-total")}>
                <p>Total:</p>
                <span>{location?.state?.price?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
              </div>
            </div>
          </div>
          <div className={cx("bill-note")}>
            <textarea name="note" id="note" cols="48" placeholder="Enter your note..." onChange={(e) => setNoteContent(e.target.value)}></textarea>
          </div>
          <div className={cx("payment-cash")} onClick={handleChoosePaymentMethod} datapay="cash">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" datapay="cash">
              <circle cx="12" cy="12" r="11.25" stroke="black" strokeWidth="1.5" datapay="cash" />
              {paymentMethod === "cash" && <circle cx="12" cy="12" r="7" fill="black" />}
            </svg>
            <span datapay="cash">Payment By Cash</span>
            <svg datapay="cash" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xmlSpace="preserve" width="30px" height="30px" fill="#000000" stroke="#000000"><g datapay="cash" id="SVGRepo_bgCarrier" strokeWidth="0"></g><g datapay="cash" id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect datapay="cash" y="112.219" style={{ fill: "#75EF84" }} width="512" height="287.566"></rect> <rect datapay="cash" y="112.219" style={{ fill: "#B7FFB9" }} width="256" height="287.566"></rect> <circle datapay="cash" style={{ fill: "#75EF84" }} cx="77.667" cy="255.997" r="24.871"></circle> <g> <circle datapay="cash" style={{ fill: "#3AB94B" }} cx="434.333" cy="255.997" r="24.871"></circle> <path datapay="cash" style={{ fill: "#3AB94B" }} d="M0,112.215v287.563h512V112.215H0z M31.347,316.008V195.985 c26.828-4.426,47.996-25.596,52.423-52.423h103.044c-37.692,23.243-62.819,64.902-62.819,112.435s25.128,89.191,62.819,112.435 H83.769C79.343,341.604,58.175,320.435,31.347,316.008z M480.653,316.008c-26.828,4.426-47.996,25.596-52.423,52.423H325.187 c37.692-23.243,62.819-64.902,62.819-112.435s-25.128-89.191-62.819-112.435h103.044c4.426,26.828,25.596,47.996,52.423,52.423 V316.008z"></path> </g> <path datapay="cash" style={{ fill: "#75EF84" }} d="M256,112.215H0v287.563h256V112.215z M83.769,368.432c-4.426-26.828-25.596-47.996-52.423-52.423 V195.985c26.828-4.426,47.996-25.596,52.423-52.423h103.044c-37.692,23.243-62.819,64.902-62.819,112.435 s25.128,89.191,62.819,112.435H83.769V368.432z"></path> <path datapay="cash" style={{ fill: "#B7FFB9" }} d="M301.485,251.928c-8.122-5.419-18.114-8.949-29.812-10.57V194.18 c4.987,1.065,9.18,2.689,12.417,4.847c3.846,2.566,8.262,6.872,8.262,17.481h31.347c0-18.802-7.681-33.864-22.214-43.559 c-8.122-5.418-18.114-8.949-29.812-10.57v-18.818h-31.347v18.818c-11.698,1.622-21.69,5.152-29.812,10.57 c-14.532,9.695-22.213,24.757-22.213,43.559c0,18.801,7.681,33.863,22.213,43.558c8.122,5.419,18.114,8.949,29.812,10.57v47.178 c-4.987-1.065-9.18-2.689-12.417-4.847c-3.846-2.566-8.262-6.872-8.262-17.481h-31.347c0,18.802,7.681,33.864,22.213,43.559 c8.122,5.418,18.114,8.948,29.812,10.57v18.818h31.347v-18.818c11.698-1.622,21.69-5.152,29.812-10.57 c14.532-9.695,22.214-24.757,22.214-43.559C323.699,276.685,316.018,261.623,301.485,251.928z M227.911,233.989 c-3.847-2.566-8.263-6.872-8.263-17.481c0-10.609,4.416-14.915,8.262-17.481c3.236-2.159,7.429-3.781,12.417-4.847v44.656 C235.339,237.771,231.146,236.147,227.911,233.989z M284.09,312.967c-3.236,2.159-7.429,3.781-12.417,4.847v-44.656 c4.987,1.065,9.18,2.689,12.415,4.846c3.847,2.566,8.263,6.872,8.263,17.481C292.352,306.095,287.936,310.401,284.09,312.967z"></path> </g></svg>
          </div>
          <div className={cx("payment-vnpay")} onClick={handleChoosePaymentMethod} datapay="vnpay" dataid={handleFindPaymentId()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" datapay="vnpay" dataid={handleFindPaymentId()}>
              <circle cx="12" cy="12" r="11.25" stroke="black" strokeWidth="1.5" datapay="vnpay" dataid={handleFindPaymentId()} />
              {paymentMethod === "vnpay" && <circle cx="12" cy="12" r="7" fill="black" />}
            </svg>
            <span datapay="vnpay" dataid={handleFindPaymentId()}>Payment By VnPay</span>
            <img src="/src/assets/images/vnpay.png" style={{
              width: "110px",
              height: "30px"
            }} datapay="vnpay" dataid={handleFindPaymentId()} />
          </div>
          <Button
            className={cx("order-btn")}
            onClick={handlePayment}
            disable={!validateEmail(email) || !email}
          >Place Order</Button>
        </div>
      </div>
    </div>
  )
};

export default Checkout;
