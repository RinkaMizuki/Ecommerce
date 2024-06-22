import classNames from "classnames/bind";
import styles from "./CategoryDetail.module.scss";
import { forwardRef, useImperativeHandle, useState } from "react";
import FilterRange from "../FilterRange/FilterRange";

const cx = classNames.bind(styles);
export const minDistance = 5;
export const priceDistance = 1000000;

const Aside = forwardRef(({ handleFilter }, ref) => {
    const [value, setValue] = useState([0, 100]);
    const [saleFilter, setSaleFilter] = useState("");
    const [price, setPrice] = useState({
        priceLeft: value[0] * priceDistance,
        priceRight: value[1] * priceDistance,
    });

    const [selected, setSelected] = useState(null);

    useImperativeHandle(
        ref,
        () => {
            return {
                getCurrentFilterValue() {
                    return {
                        price,
                        saleFilter,
                    };
                },
            };
        },
        [price, saleFilter]
    );

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
                });
            } else {
                const clamped = Math.max(newValue[1], minDistance);
                setValue([clamped - minDistance, clamped]);
                setPrice({
                    priceLeft: (clamped - minDistance) * priceDistance,
                    priceRight: clamped * priceDistance,
                });
            }
        } else {
            setPrice({
                priceLeft: newValue[0] * priceDistance,
                priceRight: newValue[1] * priceDistance,
            });
            setValue(newValue);
        }
    };

    const handleFilterSale = (type, i) => {
        setSelected((prev) => (i === prev ? null : i));
        if (i === selected) {
            handleFilter("", price);
            setSaleFilter("");
        } else {
            handleFilter(type, price);
            setSaleFilter(type);
        }
    };

    return (
        <div className={cx("aside-container")}>
            <aside className={cx("filter-status")}>
                <div className={cx("filter-title")}>
                    <h2 className={cx("title-head")}>
                        <span>Status</span>
                    </h2>
                </div>
                <div className={cx("filter-group")}>
                    <ul>
                        <li
                            className={cx("filter-item filter-item--check-box")}
                        >
                            <span>
                                <label
                                    className={cx("custom-checkbox")}
                                    htmlFor="filter-hot"
                                >
                                    <input
                                        type="checkbox"
                                        id="filter-hot"
                                        name="sale"
                                        data-group="PRODUCT_VENDOR"
                                        data-field="vendor.filter_key"
                                        data-text=""
                                        value="hot"
                                        data-operator="OR"
                                        onChange={() =>
                                            handleFilterSale("hot", 1)
                                        }
                                        checked={1 === selected}
                                    />
                                    <i className={cx("fa")}></i>
                                    Hot
                                </label>
                            </span>
                        </li>
                        <li
                            className={cx("filter-item filter-item--check-box")}
                        >
                            <span>
                                <label
                                    className={cx("custom-checkbox")}
                                    htmlFor="filter-flashsale"
                                >
                                    <input
                                        type="checkbox"
                                        id="filter-flashsale"
                                        name="sale"
                                        data-group="PRODUCT_VENDOR"
                                        data-field="vendor.filter_key"
                                        data-text=""
                                        value="flashsale"
                                        data-operator="OR"
                                        onChange={() =>
                                            handleFilterSale("flashsale", 2)
                                        }
                                        checked={2 === selected}
                                    />
                                    <i className={cx("fa")}></i>
                                    Flash Sale
                                </label>
                            </span>
                        </li>
                        <li
                            className={cx("filter-item filter-item--check-box")}
                        >
                            <span>
                                <label
                                    className={cx("custom-checkbox")}
                                    htmlFor="filter-new"
                                >
                                    <input
                                        type="checkbox"
                                        id="filter-new"
                                        name="sale"
                                        data-group="PRODUCT_VENDOR"
                                        data-field="vendor.filter_key"
                                        data-text=""
                                        value="new"
                                        data-operator="OR"
                                        onChange={() =>
                                            handleFilterSale("new", 3)
                                        }
                                        checked={3 === selected}
                                    />
                                    <i className={cx("fa")}></i>
                                    New
                                </label>
                            </span>
                        </li>
                    </ul>
                </div>
            </aside>
            <FilterRange
                handleChange={handleChange}
                value={value}
                price={price}
                handleFilter={handleFilter}
                saleFilter={saleFilter}
            />
        </div>
    );
});

export default Aside;
