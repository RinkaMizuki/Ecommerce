import classNames from "classnames/bind";
import styles from "./Address.module.scss";
import Button from "../../components/Button";

const cx = classNames.bind(styles)

const AddressItem = ({ addressItem }) => {
  return (
    <div className={cx("address-item")}>
      <div className={cx("info-wrapper")}>
        <div className={cx("info-detail")}>
          <span>{addressItem?.name}</span>
          <span>|</span>
          <span>{addressItem?.phone}</span>
        </div>
        <Button className={cx("btn-update")}>Update</Button>
      </div>
      <div className={cx("address-wrapper")}>
        <p className={cx("address-book")}>
          {`${addressItem?.address}, ${addressItem?.district}, ${addressItem?.city}, ${addressItem?.state}`}
        </p>
        <Button className={cx("btn-settings")}>Default settings</Button>
      </div>
      <div className={cx("address-role")}>
        <Button className={cx("btn-role", {
          active: addressItem.isDeliveryAddress
        })}>Mặc định</Button>
        {addressItem.isPickupAddress && <Button className={cx("btn-role")}>Địa chỉ lấy hàng</Button>}
        {addressItem.isReturnAddress && <Button className={cx("btn-role")}>Địa chỉ trả hàng</Button>}
      </div>
    </div>

  )
};

export default AddressItem;
