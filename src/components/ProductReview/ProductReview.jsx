import StarRatings from "react-star-ratings";
import styles from "./ProductReview.module.scss";
import classNames from "classnames/bind";
import Button from "../../components/Button";
import ProductReviewItem from "./ProductReviewItem";

const cx = classNames.bind(styles)

const ProductReview = ({ product }) => {


  return (
    <div className={cx("review-container")}>
      <h1>Đánh giá Đồng hồ thông minh Apple Watch SE 2023 GPS 40mm viền nhôm dây thể thao</h1>
      <div className={cx("box-star")}>
        <div className={cx("total-star")}>
          <span>{isNaN((product?.productRates?.reduce((sum, rate) => sum + rate.star, 0) / product?.productRates?.length).toFixed(1)) ? 0 : (product?.productRates?.reduce((sum, rate) => sum + rate.star, 0) / product?.productRates?.length).toFixed(1)}</span>
          <StarRatings
            rating={isNaN(product?.productRates?.reduce((sum, rate) => sum + rate.star, 0) / product?.productRates?.length) ? 0 : product?.productRates?.reduce((sum, rate) => sum + rate.star, 0) / product?.productRates?.length}
            starRatedColor="#ff9f00"
            numberOfStars={5}
            starDimension="22px"
            starSpacing="1px"
            name='rating'
          />
          <span>{product?.productRates?.length} reviews</span>
        </div>
        <ul className={cx("rate-percent-list")}>
          <li>
            <div className={cx("number-star")}>
              5 <i className="fa-solid fa-star"></i>
            </div>
            <div className={cx("timeline-star")}>
              <p className={cx("timing")} style={{
                width: ((product?.productRates?.filter(pr => pr.star == 5).length / product?.productRates?.length) * 100).toFixed(2) + "%"
              }}></p>
            </div>
            <span className={cx("number-percent")}>{((product?.productRates?.filter(pr => pr.star == 5).length / product?.productRates?.length) * 100).toFixed(2) + "%"}</span>
          </li>
          <li>
            <div className={cx("number-star")}>
              4 <i className="fa-solid fa-star"></i>
            </div>
            <div className={cx("timeline-star")}>
              <p className={cx("timing")} style={{
                width: ((product?.productRates?.filter(pr => pr.star == 4).length / product?.productRates?.length) * 100).toFixed(2) + "%"
              }}></p>
            </div>
            <span className={cx("number-percent")}>{((product?.productRates?.filter(pr => pr.star == 4).length / product?.productRates?.length) * 100).toFixed(2) + "%"}</span>
          </li>
          <li>
            <div className={cx("number-star")}>
              3 <i className="fa-solid fa-star"></i>
            </div>
            <div className={cx("timeline-star")}>
              <p className={cx("timing")} style={{
                width: ((product?.productRates?.filter(pr => pr.star == 3).length / product?.productRates?.length) * 100).toFixed(2) + "%"
              }}></p>
            </div>
            <span className={cx("number-percent")}>{((product?.productRates?.filter(pr => pr.star == 3).length / product?.productRates?.length) * 100).toFixed(2) + "%"}</span>
          </li>
          <li>
            <div className={cx("number-star")}>
              2 <i className="fa-solid fa-star"></i>
            </div>
            <div className={cx("timeline-star")}>
              <p className={cx("timing")} style={{
                width: ((product?.productRates?.filter(pr => pr.star == 2).length / product?.productRates?.length) * 100).toFixed(2) + "%"
              }}></p>
            </div>
            <span className={cx("number-percent")}>{((product?.productRates?.filter(pr => pr.star == 2).length / product?.productRates?.length) * 100).toFixed(2) + "%"}</span>
          </li>
          <li>
            <div className={cx("number-star")}>
              1 <i className="fa-solid fa-star"></i>
            </div>
            <div className={cx("timeline-star")}>
              <p className={cx("timing")} style={{
                width: ((product?.productRates?.filter(pr => pr.star == 1).length / product?.productRates?.length) * 100).toFixed(2) + "%"
              }}></p>
            </div>
            <span className={cx("number-percent")}>{((product?.productRates?.filter(pr => pr.star == 1).length / product?.productRates?.length) * 100).toFixed(2) + "%"}</span>
          </li>
        </ul>
      </div>
      <div className={cx("review-wrapper")}>
        <ul className={cx("review-list")}>
          {product?.productRates?.map(pr => (
            <ProductReviewItem pr={pr} key={pr.id} />
          ))}
        </ul>
        <div className={cx("review-tool")}>
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li className="page-item">
                <a className="page-link" href="#" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                  <span className="sr-only">Previous</span>
                </a>
              </li>
              <li className="page-item"><a className="page-link" href="#">1</a></li>
              <li className="page-item"><a className="page-link" href="#">2</a></li>
              <li className="page-item"><a className="page-link" href="#">3</a></li>
              <li className="page-item">
                <a className="page-link" href="#" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                  <span className="sr-only">Next</span>
                </a>
              </li>
            </ul>
          </nav>
          <Button className={cx("btn-create")}>Create review</Button>
        </div>
      </div>
    </div>
  )
};

export default ProductReview;
