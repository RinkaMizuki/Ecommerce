import classNames from "classnames/bind";
import styles from "./FormModal.module.scss";
import ModalAddress from "./ModalAddress";

const cx = classNames.bind(styles)

const FormModal = ({ onHideModal }) => {

  return (
    <div className={cx("modal-mask")}>
      <ModalAddress onHideModal={onHideModal}/>
    </div>
  )
};

export default FormModal;
