import classNames from "classnames/bind";
import styles from "./CategoryDetail.module.scss";
import Aside from "./Aside";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import useCustomFetch from "../../hooks/useCustomFetch";
import Cart from "../Cart";
import queryString from "query-string";
import { icons } from "./Icons";
import { Helmet } from "react-helmet";
import Lightbox from "../Lightbox";
import SortBar from "./SortBar";

const cx = classNames.bind(styles);

const priceDiscount = "Price - (Price * Discount / 100)";
const title = "Title";

export const SORT_ACTIVE = {
    priceMinMax: {
        active: false,
        icon: icons.priceMinMaxIcon,
        type: "price",
        content: "Giá Thấp - Cao",
        sortBy: priceDiscount,
        sortType: "ASC",
    },
    priceMaxMin: {
        active: false,
        icon: icons.priceMaxMinIcon,
        type: "price",
        content: "Giá Cao - Thấp",
        sortBy: priceDiscount,
        sortType: "DESC",
    },
    titleAZ: {
        active: false,
        icon: icons.titleAZIcon,
        type: "title",
        content: "Tên A - Z",
        sortBy: title,
        sortType: "ASC",
    },
    titleZA: {
        active: false,
        icon: icons.titleZAIcon,
        type: "title",
        content: "Tên Z - A",
        sortBy: title,
        sortType: "DESC",
    },
};

const CategoryDetail = () => {
    const [loading, setLoading] = useState(false);
    const [listProductByCate, setListProductByCate] = useState([]);
    const [productId, setProductId] = useState("");
    const [sortTab, setSortTab] = useState(SORT_ACTIVE);
    const [sortArray, setSortArray] = useState([]);
    const [filterValue, setFilterValue] = useState({
        price: {},
        saleFilter: "",
    });

    const scrollRef = useRef(null);

    const params = useParams();
    const location = useLocation();
    const [getListProductByCate] = useCustomFetch();
    const filterRef = useRef(null);

    const closeLightBox = (id) => {
        setProductId(id);
    };

    const fetchData = async (sale = "", priceRange = {}, sortList = []) => {
        try {
            setLoading(true);
            const filterObj = {
                category: location?.state?.categoryId || params.title,
            };
            let filterString = {
                filter: JSON.stringify(filterObj),
            };

            if (sale) {
                filterObj.sale = sale;
                filterString = {
                    filter: JSON.stringify(filterObj),
                };
            }

            if (
                priceRange.hasOwnProperty("priceLeft") &&
                priceRange.hasOwnProperty("priceRight")
            ) {
                filterObj.priceRange = [
                    priceRange.priceLeft,
                    priceRange.priceRight,
                ];
                filterString = {
                    filter: JSON.stringify(filterObj),
                };
            }

            const filter = queryString.stringify(filterString);
            const range = queryString.stringify({
                range: JSON.stringify([0, 11]),
            });
            const sort = queryString.stringify({
                sort: JSON.stringify(sortList),
            });

            const res = await getListProductByCate(
                `/Admin/products?${filter}&${range}&${sort}`
            );
            setListProductByCate(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = async (sale, priceRange, sort) => {
        await fetchData(sale, priceRange, sort);
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
        const filterValue = filterRef.current.getCurrentFilterValue();
        setFilterValue(filterValue);
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
        handleFilter(
            filterValue.saleFilter,
            filterValue.price,
            extractSortCriteria(sortArray)
        );
    }, [sortArray, params.title, sortTab]);

    return (
        <div className={cx("category-detail-container")} ref={scrollRef}>
            <Helmet>
                <meta charSet="utf-8" />
                <title>
                    MT Store -{" "}
                    {params.title.charAt(0).toUpperCase() +
                        params.title.slice(1)}
                </title>
                <link
                    rel="canonical"
                    href={`${window.location.origin}/manager/profile`}
                />
            </Helmet>
            {listProductByCate?.map((p) => {
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
            <Aside
                data={listProductByCate}
                handleFilter={handleFilter}
                ref={filterRef}
            />
            <div className={cx("line-space")}></div>
            <div className={cx("content-wrapper")}>
                <SortBar
                    title={params?.title}
                    sortTab={sortTab}
                    sortArray={sortArray}
                    handleSort={handleSort}
                />
                <div
                    className={cx("product-wrapper", {
                        center: !listProductByCate.length,
                    })}
                >
                    {listProductByCate.length ? (
                        listProductByCate?.map((p) => (
                            <Cart
                                key={p.id}
                                onCloseLightBox={closeLightBox}
                                data={p}
                            />
                        ))
                    ) : (
                        <span className={cx("product-filter-text")}>
                            Sản phẩm hiện tại không có sẵn.
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryDetail;
