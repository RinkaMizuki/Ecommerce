import classNames from "classnames/bind";
import styles from "./Avatar.module.scss";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css"
import "react-lazy-load-image-component/src/effects/black-and-white.css"
import "react-lazy-load-image-component/src/effects/opacity.css"

const cx = classNames.bind(styles);

const Avatar = ({ src, alt, effect = "blur", width = "50", height = "50", className, radius = true }) => {
  return (
    <LazyLoadImage
      src={src}
      alt={alt}
      effect={effect}
      width={width}
      height={height}
      className={cx("avatar", {
        [className]: className
      })}
      style={{
        borderRadius: radius ? "50%" : "unset"
      }}
    />
  )
};

export default Avatar;
