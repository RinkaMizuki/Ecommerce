import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid, Navigation } from 'swiper/modules';
import Cart from "../Cart";
import ViewTitle from "../ViewTitle";
import classNames from "classnames/bind";
import styles from "./ProductSuggest.module.scss";
import Button from "../Button";
import 'swiper/css';
import 'swiper/css/grid';
import { useEffect, useRef, useState } from 'react';
import queryString from 'query-string';
import useCustomFetch from '../../hooks/useCustomFetch';
import { Lightbox } from 'react-modal-image';
const cx = classNames.bind(styles);

const ProductSuggest = () => {
  const [productSuggest, setProductSuggest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [productId, setProductId] = useState("");
  const [get] = useCustomFetch();
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const filterData = { suggest: 'forYou', random: 8 };
        const queryStringData = queryString.stringify({ filter: JSON.stringify(filterData) })

        const response = await get(`Admin/products?${queryStringData}`);
        setProductSuggest(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Call the fetchData function
    fetchData();
  }, [])

  const closeLightBox = (id) => {
    setProductId(id);
  }

  return (
    <div className={cx("suggest-product-wrapper")}>
      <ViewTitle label="Product's Suggestion" title="Suggest For you"
        prevRef={prevRef}
        nextRef={nextRef}
      />
      {productSuggest?.map(p => {
        if (p.id == productId) {
          return (
            <div style={{ fontFamily: "Poppins" }} key={p.id}>
              <Lightbox
                imageBackgroundColor="transparent"
                hideZoom={true}
                hideDownload={true}
                onClose={closeLightBox}
                large={p.url}
                alt={p.image}
              />
            </div>
          )
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
          fill: "row"
        }}
        spaceBetween={30}
        modules={[Grid, Navigation]}
      >
        {productSuggest?.map(p => (
          <SwiperSlide
            key={p.id}
          >
            <Cart onCloseLightBox={closeLightBox} data={p}></Cart>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={cx("btn-wrapper")}>
        <Button lagre>View All Suggest</Button>
      </div>
    </div>
  )
};

export default ProductSuggest;
