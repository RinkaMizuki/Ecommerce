import StarRatings from "react-star-ratings";
import styles from "./ProductReview.module.scss";
import classNames from "classnames/bind";
import Button from "../../components/Button";
import ProductReviewItem from "./ProductReviewItem";
import Pagination from "./Pagination";
import { useState } from "react";
import { useEffect } from "react";

const cx = classNames.bind(styles)

const ProductReview = ({ product }) => {

  const [data, setData] = useState(product?.productRates)
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(2);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = data?.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(data?.length / recordsPerPage)

  useEffect(() => {
    setData(product?.productRates);
  }, [product?.productRates])

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
                width: ((product?.productRates?.filter(pr => pr.star == 5).length / product?.productRates?.length) * 100).toFixed(0) + "%"
              }}></p>
            </div>
            <span className={cx("number-percent")}>{isNaN(((product?.productRates?.filter(pr => pr.star == 5).length / product?.productRates?.length) * 100).toFixed(0)) ? "0%" : ((product?.productRates?.filter(pr => pr.star == 5).length / product?.productRates?.length) * 100).toFixed(0) + "%"}</span>
          </li>
          <li>
            <div className={cx("number-star")}>
              4 <i className="fa-solid fa-star"></i>
            </div>
            <div className={cx("timeline-star")}>
              <p className={cx("timing")} style={{
                width: ((product?.productRates?.filter(pr => pr.star == 4).length / product?.productRates?.length) * 100).toFixed(0) + "%"
              }}></p>
            </div>
            <span className={cx("number-percent")}>{isNaN(((product?.productRates?.filter(pr => pr.star == 4).length / product?.productRates?.length) * 100).toFixed(0)) ? "0%" : ((product?.productRates?.filter(pr => pr.star == 4).length / product?.productRates?.length) * 100).toFixed(0) + "%"}</span>
          </li>
          <li>
            <div className={cx("number-star")}>
              3 <i className="fa-solid fa-star"></i>
            </div>
            <div className={cx("timeline-star")}>
              <p className={cx("timing")} style={{
                width: ((product?.productRates?.filter(pr => pr.star == 3).length / product?.productRates?.length) * 100).toFixed(0) + "%"
              }}></p>
            </div>
            <span className={cx("number-percent")}>{isNaN(((product?.productRates?.filter(pr => pr.star == 3).length / product?.productRates?.length) * 100).toFixed(0)) ? "0%" : ((product?.productRates?.filter(pr => pr.star == 3).length / product?.productRates?.length) * 100).toFixed(0) + "%"}</span>
          </li>
          <li>
            <div className={cx("number-star")}>
              2 <i className="fa-solid fa-star"></i>
            </div>
            <div className={cx("timeline-star")}>
              <p className={cx("timing")} style={{
                width: ((product?.productRates?.filter(pr => pr.star == 2).length / product?.productRates?.length) * 100).toFixed(0) + "%"
              }}></p>
            </div>
            <span className={cx("number-percent")}>{isNaN(((product?.productRates?.filter(pr => pr.star == 2).length / product?.productRates?.length) * 100).toFixed(0)) ? "0%" : ((product?.productRates?.filter(pr => pr.star == 2).length / product?.productRates?.length) * 100).toFixed(0) + "%"}</span>
          </li>
          <li>
            <div className={cx("number-star")}>
              1 <i className="fa-solid fa-star"></i>
            </div>
            <div className={cx("timeline-star")}>
              <p className={cx("timing")} style={{
                width: ((product?.productRates?.filter(pr => pr.star == 1).length / product?.productRates?.length) * 100).toFixed(0) + "%"
              }}></p>
            </div>
            <span className={cx("number-percent")}>{isNaN(((product?.productRates?.filter(pr => pr.star == 1).length / product?.productRates?.length) * 100).toFixed(0)) ? "0%" : ((product?.productRates?.filter(pr => pr.star == 1).length / product?.productRates?.length) * 100).toFixed(0) + "%"}</span>
          </li>
        </ul>
      </div>
      <div className={cx("review-wrapper")}>
        <ul className={cx("review-list")}>
          {currentRecords?.map(pr => (
            <ProductReviewItem pr={pr} key={pr.id} />
          ))}
        </ul>
        <div className={cx("review-tool")}>
          <Pagination
            nPages={nPages || 1}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
          <Button className={cx("btn-create")}>Create review</Button>
        </div>
      </div>
    </div>
  )
};

export default ProductReview;
