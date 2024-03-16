import Button from "../../components/Button";
import { deleteUserAddress } from "../../services/userAddressServcice";
import styles from "./ModalConfirm.module.scss";
import classNames from "classnames/bind";
import { useDispatch, useSelector } from "react-redux";
import { saveUserAddress } from "../../redux/addressSlice";

const cx = classNames.bind(styles);

const ModalConfirm = ({ onHideModal, data }) => {

  const isFetching = useSelector(state => state.address.isFetching);
  const dispatch = useDispatch();

  const handleDeleteAddress = async (addressId) => {
    try {
      await deleteUserAddress(`/Address/delete/${addressId}`);
      dispatch(saveUserAddress(!isFetching));
      onHideModal();

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={cx("modal-mask")}>
      <div className={cx("modal-confirm-container")}>
        <div className={cx("confirm-message")}>
          <p>You are sure delete this address?</p>
        </div>
        <div className={cx("confirm-action")}>
          <Button type="button" onClick={onHideModal}>Cancel</Button>
          <Button type="button" onClick={() => handleDeleteAddress(data?.id)}>Delete</Button>
        </div>
      </div>
    </div>
  )
};

export default ModalConfirm;
