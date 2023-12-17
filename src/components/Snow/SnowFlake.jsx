import styles from "./SnowFlake.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles)

const Snowflake = (props) => {
  return (
    <p className={cx("SnowFlake")} id={`item${props.id}`} style={props.style}>
      *
    </p>
  )
}

export default Snowflake;