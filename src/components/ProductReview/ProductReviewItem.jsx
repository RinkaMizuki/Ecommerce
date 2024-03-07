import classNames from "classnames/bind";
import styles from "./ProductReview.module.scss";
import StarRatings from "react-star-ratings";
import useCustomFetch from "../../hooks/useCustomFetch";
import { useState } from "react";
import { useEffect } from "react";
import moment from "moment";

const cx = classNames.bind(styles)


const ProductReviewItem = ({ pr }) => {

  const [getUserById] = useCustomFetch();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getUserById(`Admin/users/${pr.userId}`);
      setUser(response.data)
    }
    fetchData();
  }, [pr.userId])

  return (
    <li>
      <div className={cx("review-name")}>
        <span>{user?.userName}</span>
        <p>{moment(pr?.createdAt).format("DD-MM-YYYY")}</p>
      </div>
      <StarRatings
        rating={pr.star}
        starRatedColor="#ff9f00"
        numberOfStars={5}
        starDimension="17px"
        starSpacing="1px"
        name='rating'
      />
      <p>{pr?.content}</p>
      <div className={cx("like-wrapper")}>
        <i className="fa-regular fa-thumbs-up"></i>
        <span>Useful (4)</span>
      </div>
    </li>
  )
};

export default ProductReviewItem;
