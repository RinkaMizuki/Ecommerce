import React from "react"
import styles from "./Footer.module.scss";
import classNames from "classnames/bind";
import { useTranslation } from "react-i18next";

const cx = classNames.bind(styles);

const Footer = () => {

  const { t } = useTranslation();

  return (
    <div className={cx("footer-wrapper")}>
      <div className={cx("footer-content")}>
        <div className={cx("content-wrapper")}>
          <h3 className={cx("footer-title")}>MT Store</h3>
          <span>{t('subscribe')}</span>
          <span>{t('get-off')}</span>
          <div className={cx("input-email-wrapper")}>
            <input type="text" name="email" id="email" placeholder={t('your-email')} />
            <i className="fa-regular fa-paper-plane"></i>
          </div>
        </div>
        <div className={cx("content-wrapper")}>
          <h3 className={cx("footer-title")}>{t('support')}</h3>
          <span style={{
            maxWidth: "250px",
            lineHeight: "1.5"
          }}>941/13/4/25 Trần Xuân Soạn, Phường Tân Hưng, Quận 7, TPHCM.</span>
          <span>mtstore@gmail.com</span>
          <span>+84867706538</span>
        </div>
        <div className={cx("content-wrapper")}>
          <h3 className={cx("footer-title")}>{t('account')}</h3>
          <span>{t('profile')}</span>
          <span>{t('auth')}</span>
          <span>{t('cart')}</span>
          <span>{t('wishlist')}</span>
          <span>{t('shop')}</span>
        </div>
        <div className={cx("content-wrapper")}>
          <h3 className={cx("footer-title")}>{t('quick-link')}</h3>
          <span>{t('privacy-policy')}</span>
          <span>{t('terms-of-use')}</span>
          <span>{t('faq')}</span>
          <span>{t('contact')}</span>
        </div>
        <div className={cx("content-wrapper")}>
          <h3 className={cx("footer-title")}>{t('download-app')}</h3>
          <span className={cx("download-save")}>{t('save-money')}</span>
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
