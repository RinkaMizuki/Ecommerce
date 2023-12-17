import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid, Navigation } from 'swiper/modules';
import Cart from "../Cart";
import ViewTitle from "../ViewTitle";
import classNames from "classnames/bind";
import styles from "./SuggestProduct.module.scss";
import Button from "../Button";
import 'swiper/css';
import 'swiper/css/grid';
import { useRef } from 'react';
const cx = classNames.bind(styles);

const SuggestProduct = () => {

  const prevRef = useRef(null);
  const nextRef = useRef(null);


  return (
    <div className={cx("suggest-product-wrapper")}>
      <ViewTitle label="Product's Suggestion" title="Suggest For you"
        prevRef={prevRef}
        nextRef={nextRef}
      ></ViewTitle>
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
          fill: "row"
        }}
        spaceBetween={30}
        modules={[Grid,Navigation]}
      >
        <SwiperSlide>
          <Cart img="https://fantechworld.com/wp-content/uploads/2019/09/GP11_PRD3-1024x576.png"></Cart>
        </SwiperSlide>
        <SwiperSlide>
          <Cart img="https://fantechworld.com/wp-content/uploads/2019/09/GP11_PRD3-1024x576.png"></Cart>
        </SwiperSlide>
        <SwiperSlide>
          <Cart img="https://fantechworld.com/wp-content/uploads/2019/09/GP11_PRD3-1024x576.png"></Cart>
        </SwiperSlide>
        <SwiperSlide>
          <Cart img="https://fantechworld.com/wp-content/uploads/2019/09/GP11_PRD3-1024x576.png"></Cart>
        </SwiperSlide>
        <SwiperSlide>
          <Cart img="https://fantechworld.com/wp-content/uploads/2019/09/GP11_PRD3-1024x576.png"></Cart>
        </SwiperSlide>
        <SwiperSlide>
          <Cart img="https://fantechworld.com/wp-content/uploads/2019/09/GP11_PRD3-1024x576.png"></Cart>
        </SwiperSlide>
        <SwiperSlide>
          <Cart img="https://fantechworld.com/wp-content/uploads/2019/09/GP11_PRD3-1024x576.png"></Cart>
        </SwiperSlide>
        <SwiperSlide>
          <Cart img="https://fantechworld.com/wp-content/uploads/2019/09/GP11_PRD3-1024x576.png"></Cart>
        </SwiperSlide>
        <SwiperSlide>
          <Cart img="https://fantechworld.com/wp-content/uploads/2019/09/GP11_PRD3-1024x576.png"></Cart>
        </SwiperSlide>
        <SwiperSlide>
          <Cart img="https://fantechworld.com/wp-content/uploads/2019/09/GP11_PRD3-1024x576.png"></Cart>
        </SwiperSlide>
        <SwiperSlide>
          <Cart img="https://fantechworld.com/wp-content/uploads/2019/09/GP11_PRD3-1024x576.png"></Cart>
        </SwiperSlide>
        <SwiperSlide>
          <Cart img="https://fantechworld.com/wp-content/uploads/2019/09/GP11_PRD3-1024x576.png"></Cart>
        </SwiperSlide>
        <SwiperSlide>
          <Cart img="https://fantechworld.com/wp-content/uploads/2019/09/GP11_PRD3-1024x576.png"></Cart>
        </SwiperSlide>
        <SwiperSlide>
          <Cart img="https://fantechworld.com/wp-content/uploads/2019/09/GP11_PRD3-1024x576.png"></Cart>
        </SwiperSlide>
      </Swiper>
      <div className={cx("btn-wrapper")}>
        <Button content="View All Suggest" lagre/>
      </div>
    </div>
  )
};

export default SuggestProduct;
