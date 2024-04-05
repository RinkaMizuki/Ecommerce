
const Popup = ({ content, contentStyle, action, header, button, lockScroll = true, closeOnDocumentClick = false }) => {
  return (
    <Popup
      trigger={button}
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
    </Popup>
  )
};

export default Popup;
