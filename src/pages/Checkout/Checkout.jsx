import styles from "./Checkout.module.scss";
import classNames from "classnames/bind";
import { default as LinkMui } from "@mui/material/Link";
import { Box, Breadcrumbs, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import Button from "../../components/Button";
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import useCustomFetch from "../../hooks/useCustomFetch";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useSelector } from "react-redux";
import { ModalContext } from "../../context/ModalContext";
import Skeleton from "react-loading-skeleton";
import { setLocalProductQuantity } from "../../services/cartService";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',

  transform: 'translate(-50%, -50%)',
  bgcolor: '#f1f1f1',
  boxShadow: 24,
  borderRadius: "5px",
  overflow: "hidden"
};

const cx = classNames.bind(styles);

const Checkout = () => {

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [listUserAddress, setListUserAddress] = useState([]);
  const [listDes, setListDes] = useState([]);
  const [listSoldOut, setListSoldOut] = useState([]);
  const [desId, setDesId] = useState("");
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [noteContent, setNoteContent] = useState("");
  const emailInputRef = useRef(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const handleRemoveOutStockCart = () => {
    listSoldOut.forEach(item => {
      setLocalProductQuantity(item.productId, userLogin.id, 1, "remove", true)
    })
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
    return () => setOpen(false);
  }, [])

  const handleCalcTotalQuantity = () => {
    return location.state?.products?.filter(p => p?.avaiable).reduce((prev, curr) => (
      prev + curr.cartQuantity
    ), 0);
  }
  const keyMap = {
    price: 'priceProduct',
    discount: 'discountProduct',
    id: "productId",
    cartQuantity: "quantityProduct",
    color: "color"
  };

  function handleGetInfoProducts(listProd, keyMap) {
    return listProd.filter(p => p.avaiable).map(p => {
      return Object.keys(p).reduce((acc, key) => {
        if (keyMap.hasOwnProperty(key)) {
          acc[keyMap[key]] = p[key];
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
        totalDiscount: location.state?.totalDiscount,
        totalQuantity: handleCalcTotalQuantity(),
        requiredAmount: location.state?.totalPrice == 0 ? 2000 : location.state?.totalPrice,
        orderDetails: handleGetInfoProducts(location.state.products, keyMap),
        note: noteContent,
        couponId: location.state?.coupon?.id ?? null,
        userId: userLogin?.id,
      };
      switch (paymentMethod) {
        case "vnpay":
          const vnpayRes = await postPaymentOrder("/Payment/vnpay/post", paymentData, {
            "Content-Type": "application/json"
          });
          localStorage.setItem("paymentType", JSON.stringify("vnpay"));
          window.location.replace(vnpayRes.data.paymentUrl);
          break;
        case "payos":
          const payOSRes = await postPaymentOrder("/Payment/payos/post", paymentData, {
            "Content-Type": "application/json"
          });
          localStorage.setItem("paymentType", JSON.stringify("payos"));
          window.location.replace(payOSRes.data.paymentUrl);
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 409) {
        handleOpen();
        setListSoldOut(error.response.data?.data);
      }
    }
  }

  const handleFindPaymentId = (destination) => {
    return listDes?.find(d => d?.desShortName?.toLowerCase() === destination)?.destinationId;
  };
  console.log(location.state?.products)
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
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{
            padding: "20px 20px 0 20px",
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Typography id="modal-modal-title" variant="h6" component="h2" textAlign="center" sx={{
              lineHeight: 1.3,
              fontWeight: "500",
              fontSize: "23px"
            }}>
              Some product not avaiable in your cart. Please check again
              <ErrorOutlineIcon sx={{
                marginLeft: '5px',
                color: 'var(--primary)'
              }} />
            </Typography>
            <TableContainer component={Paper} sx={{
              mt: 2
            }}>
              <Table sx={{ minWidth: 650 }} aria-label="caption table">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Discount</TableCell>
                    <TableCell align="right">Stock remain</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listSoldOut.map((row) => (
                    <TableRow key={row.productId}>
                      <TableCell component="th" scope="row">
                        <Link to={`/product-detail/${row.productId}`} style={{
                          color: "#4874ff"
                        }}>{row.title}</Link>
                      </TableCell>
                      <TableCell align="right">{row.quantityProduct}</TableCell>
                      <TableCell align="right">{row.priceProduct}đ</TableCell>
                      <TableCell align="right">{row.discountProduct} %</TableCell>
                      <TableCell align="right">{row.stockQuantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button
              onClick={handleRemoveOutStockCart}
              to="/cart"
              lagre={true}
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignSelf: 'flex-end',
                alignItems: 'center',
                width: "unset",
                borderRadius: "0px",
                backgroundColor: "transparent",
                color: "var(--primary)",
                fontWeight: "500",
                textTransform: "uppercase"
              }}
            >
              <ArrowRightIcon />
              <span>Go to cart</span>
            </Button>

          </Box>
          <Button
            lagre={true}
            style={{
              width: '100%',
              borderRadius: "0px",
              fontWeight: "500",
              textTransform: "uppercase"
            }}
            onClick={() => {
              navigate(location.pathname, { state: { products: [] } });
              setNoteContent('');
              setEmail('');
              handleClose();
              handleRemoveOutStockCart()
            }}
          >I understand</Button>
        </Box>
      </Modal>
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
              p.avaiable ? <div className={cx("bill-product-item")} key={p.id}>
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
                  <span style={{
                    height: "20px",
                    width: "20px",
                    borderRadius: "5px",
                    backgroundColor: `#${p.color}`
                  }}></span>
                  <div className={cx("product-price")}>
                    {p?.price ? <>
                      <span className={cx("product-price-sale")}>{(p?.price * (1 - p?.discount / 100)).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
                      <span className={cx("product-price-real")}>{p?.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
                    </> :
                      <Skeleton />
                    }
                  </div>
                </div>
              </div> : null
            ))}
          </div>
          <div className={cx("bill-price-wrapper")}>
            <div className={cx("bill-price")}>
              <div className={cx("bill-sub")}>
                <p>SubTotal:</p>
                <span>{location.state?.subTotal?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || '0 VND'}</span>
              </div>
              <span></span>
              <div className={cx("bill-discount")}>
                <p>Discount</p>
                <p>{location.state?.totalDiscount?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || '0 VND'}</p>
              </div>
              <span></span>
              <div className={cx("bill-ship")}>
                <p>Shipping:</p>
                <span>Free</span>
              </div>
              <span></span>
              <div className={cx("bill-total")}>
                <p>Total:</p>
                <span>{location?.state?.totalPrice?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || '0 VND'}</span>
              </div>
            </div>
          </div>
          <div className={cx("bill-note")}>
            <textarea name="note" id="note" cols="48" placeholder="Enter your note..." onChange={(e) => setNoteContent(e.target.value)} value={noteContent}></textarea>
          </div>
          <div className={cx("payment-cash")} onClick={handleChoosePaymentMethod} datapay="cash">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" datapay="cash">
              <circle cx="12" cy="12" r="11.25" stroke="black" strokeWidth="1.5" datapay="cash" />
              {paymentMethod === "cash" && <circle cx="12" cy="12" r="7" fill="black" />}
            </svg>
            <span datapay="cash">Payment By Cash</span>
            <svg datapay="cash" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xmlSpace="preserve" width="30px" height="30px" fill="#000000" stroke="#000000"><g datapay="cash" id="SVGRepo_bgCarrier" strokeWidth="0"></g><g datapay="cash" id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect datapay="cash" y="112.219" style={{ fill: "#75EF84" }} width="512" height="287.566"></rect> <rect datapay="cash" y="112.219" style={{ fill: "#B7FFB9" }} width="256" height="287.566"></rect> <circle datapay="cash" style={{ fill: "#75EF84" }} cx="77.667" cy="255.997" r="24.871"></circle> <g> <circle datapay="cash" style={{ fill: "#3AB94B" }} cx="434.333" cy="255.997" r="24.871"></circle> <path datapay="cash" style={{ fill: "#3AB94B" }} d="M0,112.215v287.563h512V112.215H0z M31.347,316.008V195.985 c26.828-4.426,47.996-25.596,52.423-52.423h103.044c-37.692,23.243-62.819,64.902-62.819,112.435s25.128,89.191,62.819,112.435 H83.769C79.343,341.604,58.175,320.435,31.347,316.008z M480.653,316.008c-26.828,4.426-47.996,25.596-52.423,52.423H325.187 c37.692-23.243,62.819-64.902,62.819-112.435s-25.128-89.191-62.819-112.435h103.044c4.426,26.828,25.596,47.996,52.423,52.423 V316.008z"></path> </g> <path datapay="cash" style={{ fill: "#75EF84" }} d="M256,112.215H0v287.563h256V112.215z M83.769,368.432c-4.426-26.828-25.596-47.996-52.423-52.423 V195.985c26.828-4.426,47.996-25.596,52.423-52.423h103.044c-37.692,23.243-62.819,64.902-62.819,112.435 s25.128,89.191,62.819,112.435H83.769V368.432z"></path> <path datapay="cash" style={{ fill: "#B7FFB9" }} d="M301.485,251.928c-8.122-5.419-18.114-8.949-29.812-10.57V194.18 c4.987,1.065,9.18,2.689,12.417,4.847c3.846,2.566,8.262,6.872,8.262,17.481h31.347c0-18.802-7.681-33.864-22.214-43.559 c-8.122-5.418-18.114-8.949-29.812-10.57v-18.818h-31.347v18.818c-11.698,1.622-21.69,5.152-29.812,10.57 c-14.532,9.695-22.213,24.757-22.213,43.559c0,18.801,7.681,33.863,22.213,43.558c8.122,5.419,18.114,8.949,29.812,10.57v47.178 c-4.987-1.065-9.18-2.689-12.417-4.847c-3.846-2.566-8.262-6.872-8.262-17.481h-31.347c0,18.802,7.681,33.864,22.213,43.559 c8.122,5.418,18.114,8.948,29.812,10.57v18.818h31.347v-18.818c11.698-1.622,21.69-5.152,29.812-10.57 c14.532-9.695,22.214-24.757,22.214-43.559C323.699,276.685,316.018,261.623,301.485,251.928z M227.911,233.989 c-3.847-2.566-8.263-6.872-8.263-17.481c0-10.609,4.416-14.915,8.262-17.481c3.236-2.159,7.429-3.781,12.417-4.847v44.656 C235.339,237.771,231.146,236.147,227.911,233.989z M284.09,312.967c-3.236,2.159-7.429,3.781-12.417,4.847v-44.656 c4.987,1.065,9.18,2.689,12.415,4.846c3.847,2.566,8.263,6.872,8.263,17.481C292.352,306.095,287.936,310.401,284.09,312.967z"></path> </g></svg>
          </div>
          <div className={cx("payment-vnpay")} onClick={handleChoosePaymentMethod} datapay="vnpay" dataid={handleFindPaymentId("vnpay")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" datapay="vnpay" dataid={handleFindPaymentId("vnpay")}>
              <circle cx="12" cy="12" r="11.25" stroke="black" strokeWidth="1.5" datapay="vnpay" dataid={handleFindPaymentId("vnpay")} />
              {paymentMethod === "vnpay" && <circle cx="12" cy="12" r="7" fill="black" />}
            </svg>
            <span datapay="vnpay" dataid={handleFindPaymentId("vnpay")}>Payment By VnPay</span>
            <img src="/src/assets/images/vnpay.png" style={{
              width: "110px",
              height: "30px"
            }} datapay="vnpay" dataid={handleFindPaymentId("vnpay")} />
          </div>
          <div className={cx("payment-payos")} onClick={handleChoosePaymentMethod} datapay="payos" dataid={handleFindPaymentId("payos")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" datapay="payos" dataid={handleFindPaymentId("payos")}>
              <circle cx="12" cy="12" r="11.25" stroke="black" strokeWidth="1.5" datapay="payos" dataid={handleFindPaymentId("payos")} />
              {paymentMethod === "payos" && <circle cx="12" cy="12" r="7" fill="black" />}
            </svg>
            <span datapay="payos" dataid={handleFindPaymentId("payos")}>Payment By PayOS</span>
            <img src="/src/assets/images/payos.jpg" style={{
              width: "130px",
              height: "35px",
              marginLeft: "-10px"
            }} datapay="payos" dataid={handleFindPaymentId("payos")} />
          </div>
          <Button
            className={cx("order-btn")}
            onClick={handlePayment}
            disable={!validateEmail(email) || !email || !location.state?.products.length}
          >Place Order</Button>
        </div>
      </div>
    </div>
  )
};

export default Checkout;
