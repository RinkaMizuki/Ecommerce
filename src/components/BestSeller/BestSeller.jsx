import Cart from "../Cart";
import ViewTitle from "../ViewTitle";
import styles from "./BestSeller.module.scss"
import classNames from "classnames/bind";
import { Lightbox } from "react-modal-image";

import tannhietnuoc from "../../assets/images/tannhietnuoc.png";
import { useState } from "react";

const cx = classNames.bind(styles)

const BestSeller = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeLightBox = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div className={cx("bestseller-wrapper")}>
      <ViewTitle label="This Month" title="Best Selling Products" btnView={true} className={cx("custom-btn")} />
      {isOpen &&
        <div style={{ fontFamily: "Poppins" }}>
          <Lightbox
            imageBackgroundColor="transparent"
            hideZoom={true}
            hideDownload={true}
            onClose={closeLightBox}
            large={tannhietnuoc}
            alt="Review Product"
          />
        </div>
      }
      <div className={cx("bestseller-content")}>
        <Cart img={tannhietnuoc} onCloseLightBox={closeLightBox}/>
        <Cart img={tannhietnuoc} onCloseLightBox={closeLightBox}/>
        <Cart img={tannhietnuoc} onCloseLightBox={closeLightBox}/>
        <Cart img={tannhietnuoc} onCloseLightBox={closeLightBox}/>
        <Cart img={tannhietnuoc} onCloseLightBox={closeLightBox}/>
      </div>
    </div>
  )
};

export default BestSeller;
