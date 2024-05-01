import 'reactjs-popup/dist/index.css';
import { default as PopupComponent } from "reactjs-popup"
import classNames from 'classnames/bind';
import styles from "./Popup.module.scss";
import CloseIcon from '@mui/icons-material/Close';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import './Popup.css';

const cx = classNames.bind(styles);
let closeGlobal = () => { };

const Popup = forwardRef(({ content, contentStyle, action, header, trigger, lockScroll = true, closeOnDocumentClick = false, onReset = () => { }, open = false, isSend = false }, ref) => {

  const [isHidden, setIsHidden] = useState(false);

  const handleClosePopup = () => {
    !isSend && closeGlobal();
    onReset();
  }

  useImperativeHandle(ref, () => ({
    closePopup: () => {
      closeGlobal();
    },
    hiddenPopup: () => {
      setIsHidden(!isHidden);
    }
  }));

  useEffect(() => {
    if (isHidden) {
      document.body.style.overflow = "auto";
    }
    else {
      if (isSend) {
        document.body.style.overflow = "hidden";
      }
    }
  }, [isHidden])

  return (
    <PopupComponent
      className={isHidden ? "popup-display" : ""}
      trigger={trigger}
      open={!isSend ? open : true}
      modal
      nested
      contentStyle={contentStyle}
      lockScroll={lockScroll}
      closeOnDocumentClick={closeOnDocumentClick}
    >
      {close => {
        closeGlobal = close
        return (
          <div className={cx("modal")}>
            <button className={cx("close")} onClick={handleClosePopup}>
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
        )
      }}
    </PopupComponent>
  )
});

export default Popup;
