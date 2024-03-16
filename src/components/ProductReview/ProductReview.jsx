import StarRatings from "react-star-ratings";
import styles from "./ProductReview.module.scss";
import classNames from "classnames/bind";
import Button from "../../components/Button";
import ProductReviewItem from "./ProductReviewItem";
import Pagination from "./Pagination";
import { useState, useContext, useEffect } from "react";
import { ModalContext } from "../../context/ModalContext";
import { useSelector } from "react-redux";

const cx = classNames.bind(styles)

const ProductReview = ({ product }) => {

  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(2);
  const userLogin = useSelector(state => state.auth.login.currentUser.user);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = data?.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(data?.length / recordsPerPage)
  const { handleShowModalReview } = useContext(ModalContext)

  useEffect(() => {
    setData(product.productRates?.filter(pr => pr.status === "accepted"));
  }, [product.productRates])


  const handleDisable = () => {
    return data?.some(r => r.userId === userLogin.id);
  }

  return (
    <div className={cx("review-container")}>
      <h1>Đánh giá {product?.title}</h1>
      <div className={cx("box-star")}>
        <div className={cx("total-star")}>
          <span>{isNaN((data?.reduce((sum, rate) => sum + rate.star, 0) / data?.length).toFixed(1)) ? 0 : (data?.reduce((sum, rate) => sum + rate.star, 0) / data?.length).toFixed(1)}</span>
          <StarRatings
            rating={isNaN(data?.reduce((sum, rate) => sum + rate.star, 0) / data?.length) ? 0 : data?.reduce((sum, rate) => sum + rate.star, 0) / data?.length}
            starRatedColor="#ff9f00"
            numberOfStars={5}
            starDimension="22px"
            starSpacing="1px"
            name='rating'
          />
          <span>{data?.length} reviews</span>
        </div>
        <ul className={cx("rate-percent-list")}>
          <li>
            <div className={cx("number-star")}>
              5 <i className="fa-solid fa-star"></i>
            </div>
            <div className={cx("timeline-star")}>
              <p className={cx("timing")} style={{
                width: ((data?.filter(pr => pr.star == 5).length / data?.length) * 100).toFixed(0) + "%"
              }}></p>
            </div>
            <span className={cx("number-percent")}>{isNaN(((data?.filter(pr => pr.star == 5).length / data?.length) * 100).toFixed(0)) ? "0%" : ((data?.filter(pr => pr.star == 5).length / data?.length) * 100).toFixed(0) + "%"}</span>
          </li>
          <li>
            <div className={cx("number-star")}>
              4 <i className="fa-solid fa-star"></i>
            </div>
            <div className={cx("timeline-star")}>
              <p className={cx("timing")} style={{
                width: ((data?.filter(pr => pr.star == 4).length / data?.length) * 100).toFixed(0) + "%"
              }}></p>
            </div>
            <span className={cx("number-percent")}>{isNaN(((data?.filter(pr => pr.star == 4).length / data?.length) * 100).toFixed(0)) ? "0%" : ((data?.filter(pr => pr.star == 4).length / data?.length) * 100).toFixed(0) + "%"}</span>
          </li>
          <li>
            <div className={cx("number-star")}>
              3 <i className="fa-solid fa-star"></i>
            </div>
            <div className={cx("timeline-star")}>
              <p className={cx("timing")} style={{
                width: ((data?.filter(pr => pr.star == 3).length / data?.length) * 100).toFixed(0) + "%"
              }}></p>
            </div>
            <span className={cx("number-percent")}>{isNaN(((data?.filter(pr => pr.star == 3).length / data?.length) * 100).toFixed(0)) ? "0%" : ((data?.filter(pr => pr.star == 3).length / data?.length) * 100).toFixed(0) + "%"}</span>
          </li>
          <li>
            <div className={cx("number-star")}>
              2 <i className="fa-solid fa-star"></i>
            </div>
            <div className={cx("timeline-star")}>
              <p className={cx("timing")} style={{
                width: ((data?.filter(pr => pr.star == 2).length / data?.length) * 100).toFixed(0) + "%"
              }}></p>
            </div>
            <span className={cx("number-percent")}>{isNaN(((data?.filter(pr => pr.star == 2).length / data?.length) * 100).toFixed(0)) ? "0%" : ((data?.filter(pr => pr.star == 2).length / data?.length) * 100).toFixed(0) + "%"}</span>
          </li>
          <li>
            <div className={cx("number-star")}>
              1 <i className="fa-solid fa-star"></i>
            </div>
            <div className={cx("timeline-star")}>
              <p className={cx("timing")} style={{
                width: ((data?.filter(pr => pr.star == 1).length / data?.length) * 100).toFixed(0) + "%"
              }}></p>
            </div>
            <span className={cx("number-percent")}>{isNaN(((data?.filter(pr => pr.star == 1).length / data?.length) * 100).toFixed(0)) ? "0%" : ((data?.filter(pr => pr.star == 1).length / data?.length) * 100).toFixed(0) + "%"}</span>
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
          <Button className={cx("btn-create", {
            disable: handleDisable()
          })} onClick={() => handleShowModalReview(product)} disable={handleDisable()}>Create review</Button>
        </div>
      </div>
    </div>
  )
};

export default ProductReview;
