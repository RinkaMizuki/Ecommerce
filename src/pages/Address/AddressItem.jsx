import classNames from "classnames/bind";
import styles from "./Address.module.scss";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { saveUserAddress } from "../../redux/addressSlice";
import useCustomFetch from "../../hooks/useCustomFetch";

const cx = classNames.bind(styles)

const AddressItem = ({ addressItem, onShowModalAddress, onShowModalConfirm }) => {

  const dispatch = useDispatch();
  const isFetching = useSelector(state => state.address.isFetching);
  const listAddress = useSelector(state => state.address.listAddress);
  const [, , updateUserAddress] = useCustomFetch();

  const handleSetDefault = async (address) => {
    try {
      await updateUserAddress(`/Address/update/${address.id}`, {
        ...address,
        isDeliveryAddress: true,
      }, {
        headers: {
          "Content-Type": "application/json",
        }
      })
      dispatch(saveUserAddress(!isFetching));
    }
    catch (error) {
      console.log(error);
    }
  }

  const handleShowModalAddressUpdate = (address) => {
    onShowModalAddress(address);
  }

  return (
    <div className={cx("address-item")}>
      <div className={cx("info-wrapper")}>
        <div className={cx("info-detail")}>
          <span>{addressItem?.name}</span>
          <span>|</span>
          <span>{addressItem?.phone}</span>
        </div>
        <div className={cx("btn-wrapper")}>
          <Button className={cx("btn-update")} onClick={() => handleShowModalAddressUpdate(addressItem)}>Update</Button>
          {(!addressItem.isDeliveryAddress || listAddress.length === 1) && <Button className={cx("btn-delete")} onClick={() => onShowModalConfirm(addressItem)}>Delete</Button>}
        </div>
      </div>
      <div className={cx("address-wrapper")}>
        <p className={cx("address-book")}>
          {`${addressItem?.address}, ${addressItem?.district}, ${addressItem?.city}, ${addressItem?.state}`}
        </p>
        {!addressItem.isDeliveryAddress && <Button className={cx("btn-settings")} onClick={() => handleSetDefault(addressItem)}>Default settings</Button>}
      </div>
      <div className={cx("address-role")}>
        {addressItem.isDeliveryAddress && <Button className={cx("btn-role", {
          active: addressItem.isDeliveryAddress
        })}>Mặc định</Button>}
        {addressItem.isPickupAddress && <Button className={cx("btn-role")}>Địa chỉ lấy hàng</Button>}
        {addressItem.isReturnAddress && <Button className={cx("btn-role")}>Địa chỉ trả hàng</Button>}
      </div>
    </div>

  )
};

export default AddressItem;
