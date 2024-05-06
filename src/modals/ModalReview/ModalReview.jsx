import { LazyLoadImage } from "react-lazy-load-image-component";
import styles from "./ModalReview.module.scss";
import classNames from "classnames/bind";
import "react-lazy-load-image-component/src/effects/blur.css";
import Button from "../../components/Button";
import StarRatings from "react-star-ratings";
import { useState } from "react";
import { postReivew } from "../../services/reviewService";
import { useSelector } from "react-redux";

const cx = classNames.bind(styles);

const ModalReview = ({ onHideModal, data }) => {

  const [star, setStar] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const userLogin = useSelector(state => state.auth.login?.currentUser?.user);

  const handleSendReview = async () => {
    try {
      const datas = {
        content: reviewContent,
        star,
        status: "pending",
        userId: userLogin.id,
        productId: data.id
      }
      await postReivew("/Admin/rates/post", datas, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      onHideModal();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={cx("modal-mask")}>
      <div className={cx("review-container")}>
        <div className={cx("review-header")}>
          <span>Đánh giá sản phẩm</span>
          <div className={cx("review-close")} onClick={onHideModal}></div>
        </div>
        <div className={cx("rewview-product-info")}>
          <LazyLoadImage
            className={cx("product-image")}
            src={data?.url}
            effect="blur"
            alt="samsung"
          ></LazyLoadImage>
          <p dangerouslySetInnerHTML={{
            __html: data?.title
          }} style={{
            fontSize: "25px"
          }}></p>
          <StarRatings
            rating={star}
            starRatedColor="#ff9f00"
            numberOfStars={5}
            starDimension="45px"
            starSpacing="10px"
            name='rating'
            changeRating={(star) => setStar(star)}
          />
          <div className={cx("review-feel")}>
            <span className={cx({
              "star-active": star == 1,
            })}>Rất tệ</span>
            <span className={cx({
              "star-active": star == 2,
            })}>Tệ</span>
            <span className={cx({
              "star-active": star == 3,
            })}>Tạm ổn</span>
            <span className={cx({
              "star-active": star == 4,
            })}>Tốt</span>
            <span className={cx({
              "star-active": star == 5,
            })}>Rất tốt</span>
          </div>
        </div>
        <div className={cx("review-content")}>
          <textarea name="review" id="review" cols="30" rows="10" placeholder="Please share your feelings..." onChange={(e) => setReviewContent(e.target.value)} value={reviewContent}></textarea>
        </div>
        <Button className={cx("btn-send")} onClick={handleSendReview}>Send Review</Button>
      </div>
    </div>
  )
};

export default ModalReview;
