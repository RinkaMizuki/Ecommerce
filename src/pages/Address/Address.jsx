import classNames from "classnames/bind";
import styles from "./Address.module.scss";
import Button from "../../components/Button";
import AddIcon from '@mui/icons-material/Add';
import { useContext } from "react";
import { ModalContext } from "../../context/ModalContext";

const cx = classNames.bind(styles)

const Address = () => {

  const { handleShowModalFormAddress } = useContext(ModalContext);

  return (
    <div className={cx("address-container")}>
      <div className={cx("address-header")}>
        <p className={cx("address-title")}>
          My Address
        </p>
        <Button className={cx("btn-add")} onClick={handleShowModalFormAddress}>
          <AddIcon />
          <span>Add New Address</span>
        </Button>
      </div>
      <div className={cx("address-content")}>
        <div className={cx("address-item")}>
          <div className={cx("info-wrapper")}>
            <div className={cx("info-detail")}>
              <span>Nguyễn Huỳnh Đức</span>
              <span>|</span>
              <span>(+84) 867706538</span>
            </div>
            <Button className={cx("btn-update")}>Update</Button>
          </div>
          <div className={cx("address-wrapper")}>
            <p className={cx("address-book")}>
              Số 941, Đường Trần Xuân Soạn
              Phường Tân Hưng, Quận 7, TP. Hồ Chí Minh
            </p>
            <Button className={cx("btn-settings")}>Default settings</Button>
          </div>
          <div className={cx("address-role")}>
            <Button className={cx("btn-role", {
              active: true
            })}>Mặc định</Button>
            <Button className={cx("btn-role")}>Địa chỉ lấy hàng</Button>
            <Button className={cx("btn-role")}>Địa chỉ trả hàng</Button>
          </div>
        </div>

      </div>
    </div>
  )
};

export default Address;
