import 'reactjs-popup/dist/index.css';
import { default as PopupComponent } from "reactjs-popup"
import classNames from 'classnames/bind';
import styles from "./Popup.module.scss";
import CloseIcon from '@mui/icons-material/Close';
import { forwardRef, useImperativeHandle, useState } from 'react';

const cx = classNames.bind(styles);
let closeGlobal = () => { };

const Popup = forwardRef(({ content, contentStyle, action, header, trigger, lockScroll = true, closeOnDocumentClick = false, onReset = () => { }, open = false, isSend = false }, ref) => {

  const handleClosePopup = () => {
    closeGlobal();
    onReset();
  }

  useImperativeHandle(ref, () => ({
    closePopup: () => {
      closeGlobal();
    },
  }));


  return (
    <PopupComponent
      trigger={trigger}
      open={open}
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
