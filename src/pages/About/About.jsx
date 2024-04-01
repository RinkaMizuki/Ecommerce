import classNames from "classnames/bind";
import styles from "./About.module.scss";
import { Breadcrumbs } from "@mui/material";
import Link from '@mui/material/Link';
import ProductService from "../../components/ProductService";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/scss/pagination';
import 'swiper/scss';
import { Pagination } from 'swiper/modules';
import { useEffect, useState } from "react";
import imglyRemoveBackground from "@imgly/background-removal"
import loadingImage from "../../assets/images/loading.jpg"
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
const cx = classNames.bind(styles)

const About = () => {

  const [images, setListImages] = useState("");
  const navigate = useNavigate();

  function handleClick(event) {
    event.preventDefault();
    if (!event.target.href?.split("/")[3]) {
      navigate("/")
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      imglyRemoveBackground("https://img.lovepik.com/free-png/20210919/lovepik-business-men-in-the-office-png-image_400383214_wh1200.png").then((blob) => {

        const url = URL.createObjectURL(blob);
        setListImages(url);
      })
    }

    fetchData();
  }, [])

  return (
    <div className={cx("main-container")}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>MT Store - About</title>
        <link rel="canonical" href={`${window.location.origin}/about`} />
      </Helmet>
      <div role="presentation" onClick={handleClick} style={{ marginTop: "10px" }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link
            underline="hover"
            color="text.primary"
            href="/about"
            aria-current="page"
          >
            About
          </Link>
        </Breadcrumbs>
      </div>
      <div className={cx("wrapper-story")}>
        <div className={cx("left-story")}>
          <h1 className={cx("title-story")}>Our Story</h1>
          <p className={cx("description-story")}>
            Launced in 2015, Exclusive is South Asia’s premier online shopping makterplace with an active presense in Bangladesh. Supported by wide range of tailored marketing, data and service solutions, Exclusive has 10,500 sallers and 300 brands and serves 3 millioons customers across the region.
          </p>
          <p className={cx("description-story")}>
            Exclusive has more than 1 Million products to offer, growing at a very fast. Exclusive offers a diverse assotment in categories ranging  from consumer.
          </p>
        </div>
        <div className={cx("right-story")}>
          <img src="https://img.freepik.com/free-photo/asian-happy-female-woman-girl-holds-colourful-shopping-packages-standing-yellow-background-studio-shot-close-up-portrait-young-beautiful-attractive-girl-smiling-looking-camera-with-bags_609648-3029.jpg" alt="" />
        </div>
      </div>
      <div className={cx("wapper-site")}>
        <div className={cx("info-site")}>
          <span className={cx("icon-site")}>
            <i className="fa-solid fa-store"></i>
          </span>
          <span className={cx("quantity-site")}>10.5 K</span>
          <p className={cx("description-site")}>Sallers active our site</p>
        </div>
        <div className={cx("info-site")}>
          <span className={cx("icon-site")}>
            <i className="fa-solid fa-store"></i>
          </span>
          <span className={cx("quantity-site")}>10.5 K</span>
          <p className={cx("description-site")}>Sallers active our site</p>
        </div>
        <div className={cx("info-site")}>
          <span className={cx("icon-site")}>
            <i className="fa-solid fa-store"></i>
          </span>
          <span className={cx("quantity-site")}>10.5 K</span>
          <p className={cx("description-site")}>Sallers active our site</p>
        </div>
        <div className={cx("info-site")}>
          <span className={cx("icon-site")}>
            <i className="fa-solid fa-store"></i>
          </span>
          <span className={cx("quantity-site")}>10.5 K</span>
          <p className={cx("description-site")}>Sallers active our site</p>
        </div>
      </div>
      <div className={cx("wapper-member")}>
        <Swiper
          slidesPerView={4}
          spaceBetween={30}
          // pagination={{
          //   clickable: true,
          // }}
          modules={[Pagination]}
          className={cx("site-swiper")}
        >
          <SwiperSlide >
            <div className={cx("member-item")}>
              <div className={cx("member-background")}>
                <img src={images || loadingImage} alt="" />
              </div>
              <div className={cx("member-info")}>
                <span className={cx("member-name")}>
                  Tom Cruise
                </span>
                <span className={cx("member-position")}>
                  Founder & Chairman
                </span>
                <span className={cx("member-social")}>
                  <i className="fa-brands fa-x-twitter"></i>
                  <i className="fa-brands fa-instagram"></i>
                  <i className="fa-brands fa-linkedin-in"></i>
                </span>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={cx("member-item")}>
              <div className={cx("member-background")}>
                <img src={images || loadingImage} alt="" />
              </div>
              <div className={cx("member-info")}>
                <span className={cx("member-name")}>
                  Tom Cruise
                </span>
                <span className={cx("member-position")}>
                  Founder & Chairman
                </span>
                <span className={cx("member-social")}>
                  <i className="fa-brands fa-x-twitter"></i>
                  <i className="fa-brands fa-instagram"></i>
                  <i className="fa-brands fa-linkedin-in"></i>
                </span>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={cx("member-item")}>
              <div className={cx("member-background")}>
                <img src={images || loadingImage} alt="" />
              </div>
              <div className={cx("member-info")}>
                <span className={cx("member-name")}>
                  Tom Cruise
                </span>
                <span className={cx("member-position")}>
                  Founder & Chairman
                </span>
                <span className={cx("member-social")}>
                  <i className="fa-brands fa-x-twitter"></i>
                  <i className="fa-brands fa-instagram"></i>
                  <i className="fa-brands fa-linkedin-in"></i>
                </span>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={cx("member-item")}>
              <div className={cx("member-background")}>
                <img src={images || loadingImage} alt="" />
              </div>
              <div className={cx("member-info")}>
                <span className={cx("member-name")}>
                  Tom Cruise
                </span>
                <span className={cx("member-position")}>
                  Founder & Chairman
                </span>
                <span className={cx("member-social")}>
                  <i className="fa-brands fa-x-twitter"></i>
                  <i className="fa-brands fa-instagram"></i>
                  <i className="fa-brands fa-linkedin-in"></i>
                </span>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      <ProductService className={cx("custom-service")}></ProductService>
    </div>
  )
};

export default About;
