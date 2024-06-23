import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Navigation } from "swiper/modules";
import Cart from "../Cart";
import ViewTitle from "../ViewTitle";
import classNames from "classnames/bind";
import styles from "./ProductSuggest.module.scss";
import Button from "../Button";
import "swiper/css";
import "swiper/css/grid";
import { useEffect, useRef, useState } from "react";
import queryString from "query-string";
import useCustomFetch from "../../hooks/useCustomFetch";
import Lightbox from "../Lightbox";
import { useTranslation } from "react-i18next";

const cx = classNames.bind(styles);

const ProductSuggest = () => {
    const [productSuggest, setProductSuggest] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [productId, setProductId] = useState("");
    const [get] = useCustomFetch();
    const { t } = useTranslation();
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                const filterData = { suggest: "forYou" };
                const queryStringData = queryString.stringify({
                    filter: JSON.stringify(filterData),
                    range: JSON.stringify([0, 17]),
                });

                const response = await get(`Admin/products?${queryStringData}`);
                setProductSuggest(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        // Call the fetchData function
        fetchData();
    }, []);

    const closeLightBox = (id) => {
        setProductId(id);
    };

    return (
        <div className={cx("suggest-product-wrapper")}>
            <ViewTitle
                label={t("suggest")}
                title={t("suggest-for")}
                refs={{
                    prevRef,
                    nextRef,
                }}
            />
            {productSuggest?.map((p) => {
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
            <Swiper
                onInit={(swiper) => {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                    swiper.navigation.init();
                    swiper.navigation.update();
                }}
                slidesPerView={4}
                grid={{
                    rows: 2,
                    fill: "row",
                }}
                spaceBetween={30}
                modules={[Grid, Navigation]}
            >
                {productSuggest?.map((p) => (
                    <SwiperSlide key={p.id}>
                        <Cart onCloseLightBox={closeLightBox} data={p}></Cart>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className={cx("btn-wrapper")}>
                <Button
                    lagre
                    to="/product/for-you"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {t("view-all-suggest")}
                </Button>
            </div>
        </div>
    );
};

export default ProductSuggest;
