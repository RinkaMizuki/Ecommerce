import styles from "./Payment.module.scss";
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import { Breadcrumbs } from "@mui/material";
import { default as LinkMui } from "@mui/material/Link";
import { useLayoutEffect, useState } from "react";
import useCustomFetch from "../../hooks/useCustomFetch";
import Loading from "../../pages/Loading";
import { deleteLocalProduct } from "../../services/cartService";
import { useSelector } from "react-redux";

const cx = classNames.bind(styles);

const Payment = () => {

  const [, postPaymentReturn] = useCustomFetch();
  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const userLogin = useSelector(state => state.auth.login.currentUser.user);

  function handleClick(event) {
    event.preventDefault();
    if (event.target.href.endsWith("/")) {
      navigate(`/`, {
        replace: true,
      });
    }
  }

  useLayoutEffect(() => {
    const queryString = window.location.href.split("?")[1];
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await postPaymentReturn(`/Payment/${JSON.parse(localStorage.getItem("paymentType"))}/return?${queryString}`);
        setInvoiceData(response.data);
        deleteLocalProduct(userLogin?.id)
      }
      catch (err) {
        console.log(err);
        if (err?.response?.status !== 200) {
          navigate("/payment/error", {
            state: {
              error: err?.response?.data,
            }
          })
        }
      }
      finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [])

  const formatCurrency = (currency) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currency)
  }

  const calcSubtotal = (products) => {
    return products?.reduce((sum, od) => {
      return (sum + (od?.priceProduct * od?.quantityProduct) * (1 - od?.discountProduct / 100))
    }, 0);
  }

  return (
    <div className={cx("payment-container")}>
      {!loading ? <>
        <div role="presentation" onClick={handleClick} className={cx("breadcrumb")}>
          <Breadcrumbs aria-label="breadcrumb">
            <LinkMui underline="hover" color="inherit" href="/">
              Home
            </LinkMui>
            <LinkMui
              underline="hover"
              color="text.primary"
              href="/payment"
              aria-current="page"
            >
              Order
            </LinkMui>
          </Breadcrumbs>
        </div>
        <div className={cx("invoice-content")}>
          <div className={cx("invoice-wrapper")}>
            <div className={cx("invoice-info-wrapper")}>
              <div className={cx("invoice-info-left")}>
                <div className={cx("invoice-left-title")}>
                  <h2>Invoice</h2>
                  <span>No: {invoiceData?.tranNo}</span>
                </div>
                <div className={cx("invoice-left-content")}>
                  <div className={cx("invoice-left-key")}>
                    <p>Order No.</p>
                    <p>Custom (PO)</p>
                    <p>Invoice Date</p>
                  </div>
                  <div className={cx("invoice-left-value")}>
                    <p>{invoiceData?.orderId.toUpperCase()}</p>
                    <p>{invoiceData?.customerId}</p>
                    <p>{(new Date(invoiceData?.invoiceDate)).toLocaleString('vi-VN')}</p>
                  </div>
                </div>
              </div>
              <div className={cx("invoice-info-right")}>
                <h2>MT store</h2>
                <p>TAX - 33AAGFT9099N2AM</p>
                <p>941 Trần Xuân Soạn, Phường Tân Hưng, Quận 7, TP.HCM</p>
                <p>mtstore@email.com</p>
                <p>+84 67706538</p>
              </div>
            </div>
            <div className={cx("invoice-info-user-wrapper")}>
              <div className={cx("invoice-info-user-left")}>
                <h2>Customer Details</h2>
                <p>{invoiceData?.customerName}</p>
                <p>{invoiceData?.customerEmail}</p>
                <p>{invoiceData?.customerPhone}</p>
              </div>
              <div className={cx("invoice-info-user-right")}>
                <h2>Billing Address</h2>
                <p>{invoiceData?.invoiceAddress}</p>
              </div>
            </div>
            <div className={cx("invoice-table")}>
              <div className={cx("invoice-list-header-wrapper")}>
                <div className={cx("invoice-list-header-left")}>
                  <p>#</p>
                  <p>Item name</p>
                </div>
                <div className={cx("invoice-list-header-right")}>
                  <p>Qty</p>
                  <p>Unit Price</p>
                  <p>Sale Price</p>
                  <p>Total</p>
                </div>
              </div>
              {invoiceData?.orderDetails?.map((od, index) => (
                <div className={cx("invoice-list-item")} key={index}>
                  <div className={cx("invoice-list-item-left")}>
                    <p>{index + 1}</p>
                    <p>{od?.product?.title}</p>
                  </div>
                  <div className={cx("invoice-list-item-right")}>
                    <p>{od?.quantityProduct}</p>
                    <p>{formatCurrency(od?.product?.price)}</p>
                    <div className={cx("invoice-item-total")}>
                      <p>{formatCurrency((od?.product?.price) * (1 - od?.product?.discount / 100))}</p>
                      <span>{od?.product?.discount}%</span>
                    </div>
                    <p>{formatCurrency((od?.product?.price * od?.quantityProduct) * (1 - od?.product?.discount / 100))}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className={cx("invoice-total-wrapper")}>
              <div className={cx("invoice-total-key")}>
                <p>SubTotal</p>
                <p>Discount</p>
                <h1>Grand Total</h1>
              </div>
              <div className={cx("invoice-total-value")}>
                <p>{formatCurrency(calcSubtotal(invoiceData?.orderDetails))}</p>
                <p>-{formatCurrency(invoiceData?.totalDiscount)}</p>
                <h1>{formatCurrency(calcSubtotal(invoiceData?.orderDetails) - invoiceData?.totalDiscount)}</h1>
              </div>
            </div>
          </div>
        </div>
      </> : <Loading />}
    </div>
  )
};

export default Payment;
