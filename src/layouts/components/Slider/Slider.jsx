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
        <img src="https://www.apple.com/newsroom/images/2023/09/apple-unveils-iphone-15-pro-and-iphone-15-pro-max/article/Apple-iPhone-15-Pro-lineup-hero-230912_Full-Bleed-Image.jpg.xlarge.jpg" alt="" />
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
