import { Lightbox as LightboxCpn } from "react-modal-image";

const Lightbox = ({ imageBackgroundColor = "transparent", hideZoom = true, hideDownload = true, onClose = () => { }, url = "", alt = "" }) => {
  return (
    <LightboxCpn
      imageBackgroundColor={imageBackgroundColor}
      hideZoom={hideZoom}
      hideDownload={hideDownload}
      onClose={onClose}
      large={url}
      alt={alt}
    />
  )
};

export default Lightbox;
