import classNames from "classnames/bind";
import styles from "./FilterRange.module.scss";
import Button from "../Button";
import { Slider } from "@mui/material";

const cx = classNames.bind(styles);

const FilterRange = ({
    handleChange,
    value,
    price,
    handleFilter,
    saleFilter,
    isShowTitle = true,
    isShowButton = true,
    ...props
}) => {
    return (
        <aside className={cx("filter-price")} {...props}>
            {isShowTitle && <p className={cx("price-title")}>Price</p>}
            <div className={cx("filter-group")}>
                <Slider
                    getAriaLabel={() => "Minimum distance shift"}
                    value={value}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    disableSwap
                />
                <div className={cx("price-range")}>
                    <span className={cx("start-price")}>
                        {price.priceLeft.toLocaleString("it-IT", {
                            style: "currency",
                            currency: "VND",
                        })}
                    </span>
                    <span className={cx("line")}> - </span>
                    <span className={cx("end-price")}>
                        {price.priceRight.toLocaleString("it-IT", {
                            style: "currency",
                            currency: "VND",
                        })}
                    </span>
                </div>
                {isShowButton && (
                    <Button
                        className={cx("btn-filter")}
                        onClick={() => handleFilter(saleFilter, price)}
                    >
                        Filter Price
                    </Button>
                )}
            </div>
        </aside>
    );
};

export default FilterRange;
