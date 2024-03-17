import classNames from "classnames/bind";
import styles from "./CategoryDetail.module.scss";
import Button from "../Button";
import { Slider } from "@mui/material";
import { useState } from "react";

const cx = classNames.bind(styles);
const minDistance = 10;
let priceDistance = 1000000;

const Aside = ({ data = [] }) => {

  const [value, setValue] = useState([0, 100]);
  const [price, setPrice] = useState({
    priceLeft: value[0] * priceDistance,
    priceRight: value[1] * priceDistance,
  })

  const handleChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        setValue([clamped, clamped + minDistance]);
        setPrice({
          priceLeft: clamped * priceDistance,
          priceRight: (clamped + minDistance) * priceDistance,
        })
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setValue([clamped - minDistance, clamped]);
        setPrice({
          priceLeft: (clamped - minDistance) * priceDistance,
          priceRight: clamped * priceDistance,
        })
      }
    } else {
      setPrice({
        priceLeft: newValue[0] * priceDistance,
        priceRight: newValue[1] * priceDistance,
      })
      setValue(newValue);
    }
  };

  return (
    <div className={cx("aside-container")}>
      <aside className={cx("filter-status")}>
        <div className={cx("filter-title")}>
          <h2 className={cx("title-head")}><span>Status</span></h2>
        </div>
        <div className={cx("filter-group")} >
          <ul>
            <li className={cx("filter-item filter-item--check-box")} >
              <span>
                <label className={cx("custom-checkbox")} htmlFor="filter-acer">
                  <input type="checkbox" id="filter-acer" data-group="PRODUCT_VENDOR" data-field="vendor.filter_key" data-text="" value="(&quot;Acer&quot;)" data-operator="OR" />
                  <i className={cx("fa")} ></i>
                  Hot
                </label>
              </span>
            </li>
            <li className={cx("filter-item filter-item--check-box")} >
              <span>
                <label className={cx("custom-checkbox")} htmlFor="filter-acer">
                  <input type="checkbox" id="filter-acer" data-group="PRODUCT_VENDOR" data-field="vendor.filter_key" data-text="" value="(&quot;Acer&quot;)" data-operator="OR" />
                  <i className={cx("fa")} ></i>
                  Flash Sale
                </label>
              </span>
            </li>
            <li className={cx("filter-item filter-item--check-box")} >
              <span>
                <label className={cx("custom-checkbox")} htmlFor="filter-acer">
                  <input type="checkbox" id="filter-acer" data-group="PRODUCT_VENDOR" data-field="vendor.filter_key" data-text="" value="(&quot;Acer&quot;)" data-operator="OR" />
                  <i className={cx("fa")} ></i>
                  New
                </label>
              </span>
            </li>
          </ul>
        </div >
      </aside >
      <aside className={cx("filter-price")}>
        <p className={cx("price-title")}>Price</p>
        <div className={cx("filter-group")}>
          <Slider
            getAriaLabel={() => 'Minimum distance shift'}
            value={value}
            onChange={handleChange}
            valueLabelDisplay="auto"
            disableSwap
          />
          <div className={cx("price-range")}>
            <span className={cx("start-price")}>{price.priceLeft.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
            <span className={cx("line")}> - </span>
            <span className={cx("end-price")}>{price.priceRight.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
          </div>
          <Button className={cx("btn-filter")}>Filter Price</Button>
        </div>
      </aside>
    </div >
  )
};

export default Aside;
