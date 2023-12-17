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
import { Lightbox } from "react-modal-image";
import Button from "../Button";

const cx = classNames.bind(styles);

const ProductFlashSale = () => {
    const [isOpen, setIsOpen] = useState(false);

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    const closeLightBox = () => {
        setIsOpen(!isOpen);
    }

    return (
        <>
            <ViewTitle
                flashsale={true}
                prevRef={prevRef}
                nextRef={nextRef}
                label="Today's"
                title="Flash Sales"
            />
            {isOpen &&
                <div style={{ fontFamily: "Poppins" }}>
                    <Lightbox
                        imageBackgroundColor="transparent"
                        hideZoom={true}
                        hideDownload={true}
                        onClose={closeLightBox}
                        large="https://www.pngplay.com/wp-content/uploads/13/Gaming-Keyboard-Transparent-Free-PNG.png"
                        alt="Review Product"
                    />
                </div>
            }
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
                    <SwiperSlide className={cx("custom-swiper-slide")}>
                        <Cart onCloseLightBox={closeLightBox}></Cart>
                    </SwiperSlide>
                    <SwiperSlide className={cx("custom-swiper-slide")}>
                        <Cart onCloseLightBox={closeLightBox}></Cart>
                    </SwiperSlide>
                    <SwiperSlide className={cx("custom-swiper-slide")}>
                        <Cart onCloseLightBox={closeLightBox}></Cart>
                    </SwiperSlide>
                    <SwiperSlide className={cx("custom-swiper-slide")}>
                        <Cart onCloseLightBox={closeLightBox}></Cart>
                    </SwiperSlide>
                    <SwiperSlide className={cx("custom-swiper-slide")}>
                        <Cart onCloseLightBox={closeLightBox}></Cart>
                    </SwiperSlide>
                    <SwiperSlide className={cx("custom-swiper-slide")}>
                        <Cart onCloseLightBox={closeLightBox}></Cart>
                    </SwiperSlide>
                    <SwiperSlide className={cx("custom-swiper-slide")}>
                        <Cart onCloseLightBox={closeLightBox}></Cart>
                    </SwiperSlide>
                    <SwiperSlide className={cx("custom-swiper-slide")}>
                        <Cart onCloseLightBox={closeLightBox}></Cart>
                    </SwiperSlide>
                    <SwiperSlide className={cx("custom-swiper-slide")}>
                        <Cart onCloseLightBox={closeLightBox}></Cart>
                    </SwiperSlide>
                </Swiper>
                <div className={cx("btn-wrapper")}>
                    <Button lagre={true} content="View All Products" />
                </div>
            </div>
        </>

    )
}
export default ProductFlashSale;