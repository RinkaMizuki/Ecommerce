import classNames from "classnames/bind";
import styles from "./Review.module.scss";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/scss';
import 'swiper/scss/navigation';
import { useSelector } from "react-redux";
import 'react-loading-skeleton/dist/skeleton.css';
import { LazyLoadImage } from "react-lazy-load-image-component";
import React, { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const cx = classNames.bind(styles);

const Review = () => {
  const [reviewState, setReviewState] = useState("all")
  const reviews = useSelector(state => state.review.listReview)
  const [listReview, setListReview] = useState([])
  useEffect(() => {
    setListReview(reviews.filter(rw => reviewState === "all" ? true : rw.status === reviewState))
  }, [reviewState, reviews])
  return (
    <>
      <FormControl sx={{
        position: 'absolute',
        right: 0,
        zIndex: 10,
      }}>
        <InputLabel id="demo-simple-select-label">State</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={reviewState}
          label="State"
          onChange={(e) => { setReviewState(e.target.value) }}
        >
          <MenuItem value={"all"}>All State</MenuItem>
          <MenuItem value={"accepted"}>Accepted</MenuItem>
          <MenuItem value={"pending"}>Pending</MenuItem>
          <MenuItem value={"rejected"}>Rejected</MenuItem>
        </Select>
      </FormControl>
      <Swiper
        rewind={true}
        speed={1000}
        centeredSlides={true}
        grabCursor={true}
        navigation={!!listReview.length && listReview.length > 1} //cho phép click vào thanh điều hướng
        modules={[Navigation]}
      >
        {listReview.length ? listReview.map(review => (
          <SwiperSlide key={review.id}>
            <section>
              <div className="row d-flex justify-content-center">
                <div className="col-md-10 col-xl-8 text-center">
                  <h3 className={cx("review-product-title", "mb-4")}>{review.productRateResponse?.title}</h3>
                  <p className={cx("review-product-desc", "mb-4 pb-2 mb-md-5 pb-md-0")}>
                    {review.productRateResponse?.description}
                  </p>
                </div>
              </div>

              <div className="row text-center justify-content-center">
                <div className="col-md-12 mb-0 d-flex flex-column align-items-center">
                  <div className={cx("d-flex justify-content-center mb-4", "review-product-img")}>
                    <LazyLoadImage
                      style={{
                        borderRadius: "5px",
                      }}
                      src={review.productRateResponse?.url}
                      alt={review.productRateResponse?.image}
                      effect="blur"
                    />
                    <div style={{ height: "270px" }}>
                      <div className="swiper-lazy-preloader"></div>
                    </div>
                  </div>
                  <h6 className="text-primary mb-3" style={{
                    textTransform: "capitalize"
                  }}>{review.status}</h6>
                  <ul className="list-unstyled d-flex justify-content-center mb-0">
                    {Array.from({ length: review.star }).fill("").map((_, index) => {
                      if (review.star < 5 && review.star === (index + 1)) {
                        let key = 5;
                        let flag = false;
                        return Array.from({ length: 5 - review.star }).fill("").map((_) => {
                          return (!flag ? <React.Fragment key={--key}>
                            <li>
                              {flag = true}
                              <i className="fas fa-star fa-sm text-warning"></i>
                            </li>
                            <li>
                              <i className="far fa-star fa-sm text-warning"></i>
                            </li>
                          </React.Fragment> : <li key={--key}>
                            <i className="far fa-star fa-sm text-warning"></i>
                          </li>)
                        });
                      } else {
                        return (<li key={index}>
                          <i className="fas fa-star fa-sm text-warning"></i>
                        </li>)
                      }
                    })}
                  </ul>
                  <p className={cx("px-xl-3 mt-2", "review-comment-content")}>
                    <i className="fas fa-quote-left pe-2"></i>{review.content}
                  </p>
                </div>
              </div>
            </section>
          </SwiperSlide>
        )) : <div className={cx("unavaible-review")}>
          <span>You don't have any {reviewState !== "all" && reviewState} reviews yet.</span>
        </div>
        }
      </Swiper >
    </>

  )
};

export default Review;
