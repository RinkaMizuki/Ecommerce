import styles from "./ProductArrival.module.scss"
import classNames from "classnames/bind"
import ViewTitle from "../ViewTitle";
import mouse from "../../assets/images/mouse.png"
import nintendo from "../../assets/images/nintendo.png"
import speaker from "../../assets/images/speaker.png"
import playstation5white from "../../assets/images/playstation5white.png"
import { useTranslation } from "react-i18next";

const cx = classNames.bind(styles);

const ProductArrival = () => {

  const { t } = useTranslation();

  return (<div>
    <ViewTitle
      btnView="true"
      emptyBtn="true"
      label={t('featured')}
      title={t('new-arrival')}
    >
    </ViewTitle>
    <div className={cx("feature-wrapper")}>
      <div className={cx("feature-left")}>
        <img src={playstation5white} alt="Play Station" />
        <div className={cx("feature-left-content")}>
          <h1 className={cx("feature-title")}>PlayStation 5</h1>
          <p className={cx("feature-desc")}>Black and White version of the PS5 coming out on sale.</p>
          <a href="/">{t('shop-now')}</a>
        </div>
      </div>
      <div className={cx("feature-right")}>
        <div className={cx("feature-right-vertical")}>
          <img src={mouse} alt="mouse collections" style={{
            width: "250px",
            maxHeight: "100%",
          }} />
          <div className={cx("feature-right-content")}>
            <h1 className={cx("feature-title")}>Mouse’s Collections</h1>
            <p className={cx("feature-desc")}>Featured mouse collections that give you another vibe.</p>
            <a href="/">{t('shop-now')}</a>
          </div>
        </div>
        <div className={cx("feature-right-horizontal")}>
          <div className={cx("feature-right-horizontal-item")}>
            <img src={speaker} alt="speaker" />
            <div className={cx("feature-right-horizontal-left-content")}>
              <h1 className={cx("feature-title")}>Speakers</h1>
              <p className={cx("feature-desc")}>Amazon wireless speakers.</p>
              <a href="/">{t('shop-now')}</a>
            </div>
          </div>
          <div className={cx("feature-right-horizontal-item")}>
            <img src={nintendo} alt="nintendo" />
            <div className={cx("feature-right-horizontal-right-content")}>
              <h1 className={cx("feature-title")}>Switch</h1>
              <p className={cx("feature-desc")}>NINTENDO INTENSE OUD EDP.</p>
              <a href="/">{t('shop-now')}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>)
}

export default ProductArrival