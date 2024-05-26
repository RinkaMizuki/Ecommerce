import styles from "./ProductDetail.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const ProductColor = ({ colors = [], color, handleChooseColor, productId, className }) => {
  return (
    colors.length ? colors.map(c => (
      <div
        style={{
          backgroundColor: `#${c.colorCode}`,
          border: `${color == c.colorCode ? "2px solid var(--white)" : "none"}`,
          outline: `${color == c.colorCode ? "2px solid var(--black)" : "none"}`
        }}
        id={c.colorCode}
        className={cx("color", {
          [className]: className
        })}
        onClick={(e) => handleChooseColor(e, productId)}
        key={c.colorId}
      >
      </div>
    )) : "No colors"
  )
};

export default ProductColor;
