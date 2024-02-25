import styles from "./ProductFuture.module.scss"
import classNames from "classnames/bind";
import Button from "../Button";
import Countdown from "react-countdown"
import { useEffect, useState } from "react";
import queryString from "query-string";
import useCustomFetch from "../../hooks/useCustomFetch";

const cx = classNames.bind(styles)
const countDownDate = new Date(2024, 4, 1).getTime();
const ProductFuture = () => {
  const [productUpcoming, setProductUpcoming] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [get] = useCustomFetch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const filterData = { sale: 'upcoming' };
        const queryStringData = queryString.stringify({ filter: JSON.stringify(filterData) })

        const response = await get(`Admin/products?${queryStringData}`);
        setProductUpcoming(response.data[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Call the fetchData function
    fetchData();
  }, [])

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <p>Come Into Sight!!!</p>
    } else {
      // Render a countdown
      return (
        <>
          <span className={cx("product-future-time-item")}>
            <p>{days}</p>
            <span>Days</span>
          </span>
          <span className={cx("product-future-time-item")}>
            <p>{hours}</p>
            <span>Hours</span>
          </span>
          <span className={cx("product-future-time-item")}>
            <p>{minutes}</p>
            <span>Minutes</span>
          </span>
          <span className={cx("product-future-time-item")}>
            <p>{seconds}</p>
            <span>Seconds</span>
          </span>
        </>
      )
    }
  };

  return (
    <div className={cx("product-future-wrapper")}>
      <div className={cx("product-future-desc")}>
        <span className={cx("upcoming")}>Upcoming Product</span>
        <h1>{productUpcoming?.title}</h1>
        <div className={cx("product-future-time")}>
          <Countdown
            date={countDownDate}
            renderer={renderer}
          >
          </Countdown>
        </div>
        <Button small className={cx("custom-btn-enroll")}>Enroll Now!</Button >
      </div>
      <div className={cx("product-future-img")}>
        <img src={productUpcoming?.url} alt={productUpcoming?.image} />
      </div>
    </div>
  )
};

export default ProductFuture;
