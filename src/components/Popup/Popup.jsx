import 'reactjs-popup/dist/index.css';
import { default as PopupComponent } from "reactjs-popup"
import classNames from 'classnames/bind';
import styles from "./Popup.module.scss";
import CloseIcon from '@mui/icons-material/Close';

const cx = classNames.bind(styles);

const Popup = ({ content, contentStyle, action, header, trigger, lockScroll = true, closeOnDocumentClick = false }) => {
  return (
    <PopupComponent
      trigger={trigger}
      modal
      nested
      contentStyle={contentStyle}
      lockScroll={lockScroll}
      closeOnDocumentClick={closeOnDocumentClick}
    >
      {close => (
        <div className={cx("modal")}>
          <button className={cx("close")} onClick={close}>
            <CloseIcon sx={{
              width: "20px",
              height: "20px",
            }} />
          </button>
          <div className={cx("header")}>
            {header}
          </div>
          <div className={cx("content")}>
            {content}
          </div>
          <div className={cx("actions")}>
            {action}
          </div>
        </div>
      )}
    </PopupComponent>
  )
};

export default Popup;
