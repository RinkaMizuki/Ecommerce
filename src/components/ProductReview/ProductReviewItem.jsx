import classNames from "classnames/bind";
import styles from "./ProductReview.module.scss";
import StarRatings from "react-star-ratings";
import useCustomFetch from "../../hooks/useCustomFetch";
import { useState } from "react";
import { useEffect } from "react";
import moment from "moment";
import VerifiedIcon from '@mui/icons-material/Verified';
import { useSelector } from "react-redux";

const cx = classNames.bind(styles)


const ProductReviewItem = ({ pr }) => {

  const userLogin = useSelector(state => state.auth.login?.currentUser?.user);

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
        <span className={cx({
          me: user?.userName == userLogin?.userName
        })}>{user?.userName == userLogin?.userName ? "Me" : user?.userName}</span>
        <p>{moment(pr?.createdAt).format("DD-MM-YYYY")}</p>
      </div>
      <div className={cx("reviwe-content")}>
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
      </div>
      {pr.feedbackRate && <div className={cx("feedback-wrapper")}>
        <div className={cx("feedback-admin")}>
          <span>{pr.feedbackRate.createdBy}
          </span>
          <VerifiedIcon className={cx("admin-icon")} />
        </div>
        <p>{pr?.feedbackRate?.content}</p>
      </div>}
    </li>
  )
};

export default ProductReviewItem;
