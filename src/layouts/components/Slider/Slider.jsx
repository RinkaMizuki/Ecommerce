import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "./Slider.css";
import 'swiper/scss';
import 'swiper/scss/pagination';
import 'swiper/scss/navigation';
import 'swiper/scss/zoom';
import { useEffect, useState } from "react";
import useCustomFetch from "../../../hooks/useCustomFetch";

const Slider = () => {

  const [getListSlider] = useCustomFetch();
  const [listSlider, setListSlider] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

    const fetchData = async () => {
      setIsLoading(true);
      const response = await getListSlider("/Admin/sliders")
      setListSlider(response.data);
      setIsLoading(false);
    }

    fetchData();

  }, [])

  const row = [];
  for (let i = 0; i < 5; i++) {
    row.push();
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
        {listSlider.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="swiper-zoom-container">
              <img src={slide.url} alt={slide.image} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
};

export default Slider;
