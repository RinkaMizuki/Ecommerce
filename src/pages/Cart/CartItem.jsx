import classNames from "classnames/bind";
import styles from "./Cart.module.scss";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import { getLocalProductQuantity, setLocalProductQuantity } from "../../services/cartService";
import { useState } from "react";
import { toast } from "react-toastify";

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

const CartItem = ({ p, userId }) => {

  const productsLocal = getLocalProductQuantity(userId);
  const quantityLocal = productsLocal.find(prod => prod.id === p.id)?.quantity;

  const [quantity, setQuantity] = useState(quantityLocal || 0);

  const handleAddProduct = (id, quantity = 1) => {
    if (!userId) {
      navigate("/login")
      return;
    }
    toast.info("Shopping cart successfully updated.", toastOptions)
    setLocalProductQuantity(id, userId, quantity, "add")
    setQuantity(preQuantity => preQuantity + 1);
  }
  const handleRemoveProduct = (id, remove = false) => {
    if (!userId) {
      navigate("/login")
      return;
    }
    toast.info("Shopping cart successfully updated.", toastOptions)
    setLocalProductQuantity(id, userId, quantity, "remove", remove)
    if (quantity >= 1) {
      setQuantity(preQuantity => preQuantity - 1);
    }
  }

  return (
    <div className={cx("card-product-item")} key={p.id}>
      <div className={cx("product-image")}>
        <div className={cx("product-image-wrapper")}>
          <LazyLoadImage
            className={cx("product-thumb")}
            src={p.url}
            effect="blur"
          ></LazyLoadImage>
          <div className={cx("remove-btn")}
            onClick={() => handleRemoveProduct(p.id, true)}
          >
            <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 15 15" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor"></path></svg>
          </div>
        </div>
        <p className={cx("product-title")}>{p?.title}</p>
      </div>
      <div className={cx("product-price")}>
        {p?.price ? <>
          <span className={cx("product-price-sale")}>{(p?.price * (1 - p?.discount / 100)).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
          <span className={cx("product-price-real")}>{p?.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
        </> :
          <Skeleton />
        }
      </div>
      <div className={cx("product-quantity")}>
        <div>
          <span className={cx("product-quantity-count")}>{quantity}</span>
          <div className={cx("product-quantity-input")}>
            <svg className={cx({ "disable": quantity >= 20 })} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" onClick={() => quantity < 20 ? handleAddProduct(p.id) : () => { }}><path d="M128 320l128-128 128 128z"></path>
            </svg>
            <svg className={cx({ "disable": quantity == 1 })} stroke="currentColor" fill="currentColor" strokeWidth="0" onClick={() => quantity != 1 ? handleRemoveProduct(p.id) : () => { }} viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M128 192l128 128 128-128z"></path>
            </svg>
          </div>
        </div>
      </div>
      <div className={cx("product-subtotal")}>
        <span className={cx("product-price-sale")}>{((p?.price * quantity) * (1 - p?.discount / 100)).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
      </div>
      <label className={cx("form-control")}>
        <input type="checkbox" name="checkbox" />
      </label>
    </div>
  )
};

export default CartItem;
