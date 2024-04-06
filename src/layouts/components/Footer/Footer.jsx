import React from "react"
import styles from "./Footer.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const Footer = () => {
  return (
    <div className={cx("footer-wrapper")}>
      <div className={cx("footer-content")}>
        <div className={cx("content-wrapper")}>
          <h3 className={cx("footer-title")}>Exclusive</h3>
          <span>Subscribe</span>
          <span>Get 10% off your first order</span>
          <div className={cx("input-email-wrapper")}>
            <input type="text" name="email" id="email" placeholder="Enter your email" />
            <i className="fa-regular fa-paper-plane"></i>
          </div>
        </div>
        <div className={cx("content-wrapper")}>
          <h3 className={cx("footer-title")}>Support</h3>
          <span style={{
            maxWidth: "250px",
            lineHeight: "1.5"
          }}>941/13/4/25 Trần Xuân Soạn, Phường Tân Hưng, Quận 7, TPHCM.</span>
          <span>mtstore@gmail.com</span>
          <span>+84867706538</span>
        </div>
        <div className={cx("content-wrapper")}>
          <h3 className={cx("footer-title")}>Account</h3>
          <span>My Account</span>
          <span>Login / Register</span>
          <span>Cart</span>
          <span>Wishlist</span>
          <span>Shop</span>
        </div>
        <div className={cx("content-wrapper")}>
          <h3 className={cx("footer-title")}>Quick Link</h3>
          <span>Privacy Policy</span>
          <span>Terms Of Use</span>
          <span>FAQ</span>
          <span>Contact</span>
        </div>
        <div className={cx("content-wrapper")}>
          <h3 className={cx("footer-title")}>Download App</h3>
          <span className={cx("download-save")}>Save $3 with App New User Only</span>
          <div className={cx("download-wrapper")}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Sample_EPC_QR_code.png" alt="QR Download" className={cx("qr-image")} />
            <div className={cx("store-wrapper")}>
              <div className={cx("store")}>
                <i className="fa-brands fa-google-play"></i>
                <div className={cx("download-text")}>
                  <p>GET IT ON</p>
                  <span>Google Play</span>
                </div>
              </div>
              <div className={cx("store")}>
                <i className="fa-brands fa-apple"></i>
                <div className={cx("download-text")}>
                  <p>Download on the</p>
                  <span>App store</span>
                </div>
              </div>
            </div>
          </div>
          <div className={cx("social-media")}>
            <i className="fa-brands fa-facebook-f"></i>
            <i className="fa-brands fa-x-twitter"></i>
            <i className="fa-brands fa-instagram"></i>
            <i className="fa-brands fa-linkedin-in"></i>
          </div>
        </div>
      </div>
      <div className={cx("footer-copyright")}>
        <p><i className="fa-regular fa-copyright"></i> Copyright Rimel 2024. All right reserved</p>
      </div>
    </div>
  )
};

export default Footer;
