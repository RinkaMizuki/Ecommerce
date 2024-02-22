import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "./Slider.css";
import 'swiper/scss';
import 'swiper/scss/pagination';
import 'swiper/scss/navigation';
import 'swiper/scss/zoom';

const Slider = () => {

  const row = [];
  for (let i = 0; i < 5; i++) {
    row.push(<SwiperSlide key={i}>
      <div className="swiper-zoom-container">
        <img src="https://lh3.googleusercontent.com/FETzGOo1Efz7J9SqBdo8h8LwytumW5geyGio-cVgVXRfNNVILmpSPZdcboy-A6jodlgnDMbpJhrfjqvwLf0-epdC1aEdzcdNvU62VhxcLMdmJT5WFkkIdx3BL9OOtD-HwCXmcyfPNZpomiM-QfPb-i9hAIV8kCAFBCypJPhZFC2cJFOYl8ytcrNmCg" alt="Iphone 13 Pro" />
      </div>
    </SwiperSlide>);
  }

  return (
    <div className="container">
      <Swiper
        rewind={true}
        speed={1000}
        centeredSlides={true}
        // zoom={true} //cho phép zoom ảnh
        autoplay={{
          delay: 3000, //sau mỗi 3s thì swiper
          disableOnInteraction: false, //cho thao tác khi auto swiper
        }}
        grabCursor={true}
        pagination={{
          clickable: true, //cho phép click vào phân trang
        }}
        navigation={true} //cho phép click vào thanh điều hướng
        modules={[Pagination, Navigation, Autoplay]}
      >
        {row}
      </Swiper>
    </div>
  )
};

export default Slider;
