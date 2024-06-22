import { useEffect, useRef, useState } from "react";
import useCustomFetch from "../../hooks/useCustomFetch";
import queryString from "query-string";
import Button from "../../components/Button";
import classNames from "classnames/bind";
import styles from "./Product.module.scss";
import Lightbox from "../../components/Lightbox";
import Cart from "../../components/Cart";
import SortBar from "../../components/CategoryDetail/SortBar";
import { SORT_ACTIVE } from "../../components/CategoryDetail/CategoryDetail";
import FlashSaleImg from "../../assets/images/flashsale.jpg";
import HotImg from "../../assets/images/bestseller.jpg";
import SuggestImg from "../../assets/images/suggest.jpg";
import FilterRange from "../../components/FilterRange";
import {
    minDistance,
    priceDistance,
} from "../../components/CategoryDetail/Aside";
import { useParams } from "react-router-dom";

const cx = classNames.bind(styles);
const PERPAGE = 5;

const Product = () => {
    const params = useParams();
    const typeSale =
        params?.title === "flash-sale"
            ? "flashsale"
            : params?.title === "for-you"
            ? "forYou"
            : "hot";

    const [loading, setLoading] = useState(false);
    const [range, setRange] = useState([0, PERPAGE - 1]);
    const [productsFlashSale, setProductsFlashSale] = useState([]);
    const [isShowLoadMore, setIsShowLoadMore] = useState(true);
    const [productId, setProductId] = useState("");
    const [sortArray, setSortArray] = useState([]);
    const [sortTab, setSortTab] = useState(SORT_ACTIVE);
    const [getList] = useCustomFetch();
    const [value, setValue] = useState([0, 100]);
    const [saleFilter] = useState(typeSale);
    const [price, setPrice] = useState({
        priceLeft: value[0] * priceDistance,
        priceRight: value[1] * priceDistance,
    });

    const scrollRef = useRef(null);

    const closeLightBox = (id) => {
        setProductId(id);
    };

    const handleSort = async (e, type) => {
        let updatedSortTab = { ...sortTab };
        for (const key in updatedSortTab) {
            if (updatedSortTab[key].type == type) {
                updatedSortTab[key].active = false;
            }
        }
        if (e.target.getAttribute("data-sort")) {
            updatedSortTab[e.target.getAttribute("data-sort")].active = true;
            const temp = updatedSortTab[e.target.getAttribute("data-sort")];
            delete updatedSortTab[e.target.getAttribute("data-sort")];
            updatedSortTab[e.target.getAttribute("data-sort")] = temp;
        }
        setSortTab(updatedSortTab);
        setSortArray(
            Object.values(updatedSortTab)
                .reverse()
                .filter((o) => o.active)
        );
    };

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

    const handleFilter = async (sale = "", priceRange = {}, sortList = []) => {
        try {
            setLoading(true);
            const filterObj = {};
            if (typeSale !== "forYou") {
                filterObj.sale = sale;
            } else {
                filterObj.suggest = sale;
            }
            if (
                priceRange.hasOwnProperty("priceLeft") &&
                priceRange.hasOwnProperty("priceRight")
            ) {
                filterObj.priceRange = [
                    priceRange.priceLeft,
                    priceRange.priceRight,
                ];
            }
            const queryStringData = queryString.stringify({
                filter: JSON.stringify(filterObj),
                range: JSON.stringify([0, range[1]]),
                sort: JSON.stringify(sortList),
            });

            const res = await getList(`/Admin/products?${queryStringData}`);
            setProductsFlashSale(res.data);
            const resRange = res.headers["content-range"]
                .split(" ")[1]
                .split("/")[0]
                .split("-");
            const resTotal = res.headers["content-range"]
                .split(" ")[1]
                .split("/")[1];
            setIsShowLoadMore(+resRange[0] + +resRange[1] - 1 <= +resTotal);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const extractSortCriteria = (sortArray = []) => {
        if (!sortArray.length) {
            return [];
        }
        const result = [];

        sortArray.forEach((item) => {
            result.push(item.sortBy);
            result.push(item.sortType);
        });

        return result;
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [params.title]);

    useEffect(() => {
        handleFilter(saleFilter, price, extractSortCriteria(sortArray));
    }, [sortArray, params.title, sortTab, range]);

    useEffect(() => {
        window.scrollTo({
            behavior: "smooth",
            top: 0,
        });
    }, []);

    return (
        <div className={cx("flashsale-container")} ref={scrollRef}>
            {productsFlashSale?.map((p) => {
                if (p.id == productId) {
                    return (
                        <div style={{ fontFamily: "Poppins" }} key={p.id}>
                            <Lightbox
                                onClose={closeLightBox}
                                url={p.url}
                                alt={p.title}
                            />
                        </div>
                    );
                }
                return null;
            })}
            <img
                src={
                    typeSale === "flashsale"
                        ? FlashSaleImg
                        : typeSale === "forYou"
                        ? SuggestImg
                        : HotImg
                }
                alt={
                    typeSale === "flashsale"
                        ? "Flash Sale"
                        : typeSale === "forYou"
                        ? "Suggest For You"
                        : "Best Seller"
                }
                style={{
                    borderRadius: "5px",
                    maxHeight: "100%",
                    width: "100%",
                }}
            />
            <div className={cx("toolbar-wrapper")}>
                <SortBar
                    sortArray={sortArray}
                    sortTab={sortTab}
                    handleSort={handleSort}
                    className={cx("custom-sortbar")}
                />
                <div className={cx("toolbar-filter-price")}>
                    <FilterRange
                        handleFilter={handleFilter}
                        saleFilter={saleFilter}
                        handleChange={handleChange}
                        price={price}
                        value={value}
                        isShowTitle={false}
                        isShowButton={false}
                        style={{
                            border: "none",
                            margin: "0",
                            padding: "0",
                            marginLeft: "50px",
                        }}
                    />
                    <Button
                        className={cx("btn-filter")}
                        onClick={() => handleFilter(saleFilter, price)}
                    >
                        Filter Price
                    </Button>
                </div>
            </div>
            <div className={cx("flashsale-wrapper")}>
                {productsFlashSale?.map((p) => (
                    <Cart onCloseLightBox={closeLightBox} data={p} key={p.id} />
                ))}
            </div>
            <div className={cx("showmore-wrapper")}>
                {isShowLoadMore ? (
                    <Button
                        style={{
                            padding: "10px",
                        }}
                        onClick={() =>
                            setRange((prevRange) => [
                                prevRange[1] + 1,
                                prevRange[1] + PERPAGE,
                            ])
                        }
                    >
                        Load more
                    </Button>
                ) : (
                    <span>No results show...</span>
                )}
            </div>
        </div>
    );
};

export default Product;
