import classNames from "classnames/bind"
import styles from "./Order.module.scss"
import { useSelector } from "react-redux"
import ticked from '../../assets/images/ticked.png'
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/scss';
import 'swiper/scss/navigation';

const cx = classNames.bind(styles)

const ORDER_STATE = {
  ordered: 1,
  shipped: 2,
  delivered: 3,
}

const Order = () => {

  const userLogin = useSelector(state => state.auth.login?.currentUser?.user);
  const listOrder = useSelector(state => state.order.listOrder);

  const formatDate = (date) => {
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(date));

    // Add the comma between month and year
    const [day, month, year] = formattedDate.split(' ');
    return `${day} ${month}, ${year}`;
  }

  const formatPrice = (product) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.priceProduct - product.priceProduct * (product.discountProduct / 100))
  }

  return (
    <section className="h-100 gradient-custom mb-5" style={{
      width: "100%",
    }}>
      <div className="h-100">
        <div className="row d-flex justify-content-start align-items-center h-100">
          <div className="col-lg-10 col-xl-8">
            <div className="card" style={{
              borderRadius: "10px",
              overflow: "hidden",
            }}>
              <div className="card-header px-4 py-5">
                <h5 className="text-muted mb-0">Thanks for your Order, <span style={{ color: "#a8729a" }}>{userLogin.userName}</span>!</h5>
              </div>
              <Swiper
                rewind={true}
                speed={1000}
                centeredSlides={true}
                // zoom={true} //cho phép zoom ảnh
                grabCursor={true}
                navigation={true} //cho phép click vào thanh điều hướng
                modules={[Navigation]}
              >
                {listOrder.map(order =>
                (<SwiperSlide key={order.id}>
                  <div className={cx("card-content")}>
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <p className="lead fw-normal mb-0" style={{ color: "#a8729a" }}>Order</p>
                        <p className="small text-muted mb-0">Order Voucher : {order.coupon?.couponCode || "No voucher"}</p>
                      </div>
                      {order.orderDetails.map(item => (
                        <div className="card shadow-0 border mb-4" key={item.productId}>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-2">
                                <img src={item.product?.url}
                                  className="img-fluid" alt={item.product?.image} />
                              </div>
                              <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
                                <p className="text-muted mb-0">{item.product?.title}</p>
                              </div>
                              <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
                                {item.color ? <p className="text-muted mb-0 small" style={{
                                  height: "20px",
                                  width: "20px",
                                  borderRadius: "5px",
                                  backgroundColor: `#${item.color}`
                                }}></p> : <span className="text-muted">No color</span>}
                              </div>
                              <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
                                <p className="text-muted mb-0 small"><i className="fa-solid fa-arrow-down"></i> {item?.discountProduct}%</p>
                              </div>
                              <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
                                <p className="text-muted mb-0 small">Qty: {item.quantityProduct}</p>
                              </div>
                              <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
                                <p className="text-muted mb-0 small">{formatPrice(item)}</p>
                              </div>
                            </div>
                            <hr className="mb-4" style={{
                              backgroundColor: "#e0e0e0", opacity: 1
                            }} />

                          </div>
                        </div>
                      ))}
                      <div className="row d-flex align-items-center">
                        <div className="col-md-12">
                          <div className="progress" style={{
                            height: "6px",
                            borderRadius: "16px",
                            overflow: "unset"
                          }}>
                            {Array.from({ length: ORDER_STATE[order.status] }).fill('').map((_, index) => (
                              <div className="progress-bar" role="progressbar" key={index}
                                style={{
                                  width: "33%",
                                  borderRadius: "16px",
                                  backgroundColor: "#a8729a",
                                  position: "relative",
                                  overflow: "unset"
                                }}
                                aria-valuenow="33"
                                aria-valuemin="0"
                                aria-valuemax="100"
                              >
                                <img src={ticked} alt="ticked" style={{
                                  position: "absolute",
                                  width: "30px",
                                  height: "30px",
                                  right: "-4%",
                                  zIndex: 100,
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                }} />
                              </div>
                            ))}
                          </div>
                          <div className="d-flex justify-content-around mb-1">
                            <p className="text-muted mt-1 mb-0 small ms-xl-5">Ordered</p>
                            <p className="text-muted mt-1 mb-0 small ms-xl-5">Shipped</p>
                            <p className="text-muted mt-1 mb-0 small ms-xl-5">Delivered</p>
                          </div>
                        </div>
                      </div>
                      {console.log(order)}
                      <div className="d-flex justify-content-between pt-2">
                        <p className="fw-bold mb-0">Order Details</p>
                        <p className="text-muted mb-0"><span className="fw-bold me-4">Total</span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalPrice)}</p>
                      </div>

                      <div className="d-flex flex-column gap-2 mt-3">
                        <div className="d-flex justify-content-between pt-2">
                          <p className="text-muted mb-0">Invoice Number : {order.id}</p>
                          <p className="text-muted mb-0"><span className="fw-bold me-4">Discount</span> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalDiscount)}</p>
                        </div>

                        <div className="d-flex justify-content-between">
                          <p className="text-muted mb-0">Invoice Date : {formatDate(order.orderDate)}</p>
                          {/* <p className="text-muted mb-0"><span className="fw-bold me-4">GST 18%</span> 123</p> */}
                        </div>

                        <div className="d-flex justify-content-between mb-5">
                          <p className="text-muted mb-0">Recepits Voucher : {order.couponId}</p>
                          <p className="text-muted mb-0"><span className="fw-bold me-4">Delivery Charges</span> Free</p>
                        </div>
                      </div>
                    </div >
                    <div className="card-footer border-0 px-4 py-5"
                      style={{
                        backgroundColor: "#a8729a",
                        borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px"
                      }}>
                      <h5 className="d-flex align-items-center justify-content-end text-white text-uppercase mb-0">Total
                        paid: <span className="h2 mb-0 ms-2">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalPrice)}</span></h5>
                    </div>
                  </div>
                </SwiperSlide>)
                )}
              </Swiper>
            </ div >
          </div >
        </div >
      </div >
    </section >
  )
}

export default Order
