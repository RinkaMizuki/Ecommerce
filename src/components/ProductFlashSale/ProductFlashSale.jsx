// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
import classNames from "classnames/bind";
// Import Swiper styles
import styles from "./ProductFlashSale.module.scss";
import "swiper/scss";
import "swiper/scss/free-mode";
import "swiper/scss/pagination";
import "swiper/scss/navigation";
import Cart from "../Cart";
import { useRef, useState } from "react";
import ViewTitle from "../ViewTitle/index.js";
import Button from "../Button";
import { useEffect } from "react";
import useCustomFetch from "../../hooks/useCustomFetch.jsx";
import queryString from "query-string";
import Lightbox from "../Lightbox";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

const ProductFlashSale = () => {
    const [productId, setProductId] = useState("");
    const [productSale, setProductSale] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useTranslation();
    const [get] = useCustomFetch();

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                const filterData = { sale: "flashsale" };
                const queryStringData = queryString.stringify({
                    filter: JSON.stringify(filterData),
                    range: JSON.stringify([0, 11]),
                });

                const response = await get(`Admin/products?${queryStringData}`);
                setProductSale(response.data);
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
        <div className={cx("flashsale-container")}>
            <ViewTitle
                flashsale={true}
                refs={{
                    prevRef,
                    nextRef,
                }}
                label={t("today")}
                title={t("flashsale")}
            />
            {productSale?.map((p) => {
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
            <div className={cx("container")}>
                <Swiper
                    onInit={(swiper) => {
                        swiper.params.navigation.prevEl = prevRef.current;
                        swiper.params.navigation.nextEl = nextRef.current;
                        swiper.navigation.init();
                        swiper.navigation.update();
                    }}
                    slidesPerView={5}
                    freeMode={true}
                    modules={[FreeMode, Navigation]}
                    className={cx("mySwiper")}
                >
                    {productSale?.map((p) => (
                        <SwiperSlide
                            className={cx("custom-swiper-slide")}
                            key={p.id}
                        >
                            <Cart onCloseLightBox={closeLightBox} data={p} />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <Link className={cx("btn-wrapper")} to="/product/flash-sale">
                    <Button lagre={true}>{t("view-all")}</Button>
                </Link>
            </div>
        </div>
    );
};
export default ProductFlashSale;
