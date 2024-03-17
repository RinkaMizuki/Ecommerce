import classNames from "classnames/bind";
import styles from "./LayoutFilter.module.scss";
import ScrollButton from "../../components/ScrollButton";
import LayoutDefault from "../LayoutDefault/LayoutDefault";
import Sidebar from "../components/Sidebar";
import Slider from "../components/Slider";

const cx = classNames.bind(styles);

const LayoutFilter = ({ toggleTopHeader, children }) => {
  return (
    <LayoutDefault toggleTopHeader={toggleTopHeader}>
      <div className={cx("wrapper")}>
        <ScrollButton />
        <Sidebar />
        <Slider />
      </div>
      {children}
    </LayoutDefault>
  )
};

export default LayoutFilter;
