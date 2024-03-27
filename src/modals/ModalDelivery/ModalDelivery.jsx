import { useState } from "react";
import Button from "../../components/Button";
import styles from "./ModalDelivery.module.scss";
import classNames from "classnames/bind";
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from "react-redux";
import { chooseIdAddress } from "../../redux/addressSlice";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const ModalDelivery = ({ onHideModal, data }) => {


  const currIdAddress = useSelector(state => state.address.idAddressSelected);

  const [idSelected, setIdSelected] = useState(data?.find(a => currIdAddress ? a.id === currIdAddress : a.isDeliveryAddress)?.id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChooseAddress = (id) => {
    setIdSelected(id);
  }

  const handleChangeAddress = () => {
    dispatch(chooseIdAddress(idSelected));
    onHideModal();
  }

  const handleNavigateBookAddress = () => {
    onHideModal();
    navigate("/manager/address", {
      state: {
        clicked: true
      }
    })
  }

  return (
    <div className={cx("modal-mask")}>
      <div className={cx("modal-delivery-container")}>
        <div className={cx("btn-wrapper")}>
          <p>Choose Your Address</p>
          <Button type="button" className={cx("btn-add")} onClick={handleNavigateBookAddress}>
            <AddIcon />
            Add New Address
          </Button>
        </div>
        {data?.map(add => (
          <div className={cx("delivery-item")} key={add.id}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" data-pay="cash" onClick={() => handleChooseAddress(add.id)}>
              <circle cx="12" cy="12" r="11.25" stroke="black" strokeWidth="1.5" data-pay="cash" />
              {idSelected == add.id && <circle className={cx("active")} cx="12" cy="12" r="7" fill="black" />}
            </svg>
            <div className={cx("delivery-wrapper")}>
              <div className={cx("delivery-info")}>
                <span>{add.name}</span>
                <span>|</span>
                <span>{add.phone}</span>
                {add?.isDeliveryAddress && <Button className={cx("btn-role")}>Mặc định</Button>}
              </div>
              <p className={cx("delivery-address")}>{`${add.address}, ${add.district}, ${add.city}, ${add.state}`}</p>
            </div>
          </div>
        ))}
        <div className={cx("delivery-action")}>
          <Button type="button" onClick={onHideModal}>Cancel</Button>
          <Button type="button" onClick={handleChangeAddress}>Save Changes</Button>
        </div>
      </div>
    </div>
  )
};

export default ModalDelivery;
