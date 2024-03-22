import styles from "./CountDown.module.scss"
import Countdown from "react-countdown";
import classNames from "classnames/bind"

const cx = classNames.bind(styles);
const countDownDate = new Date(2024, 3, 23).getTime();
const CountDown = () => {

  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <p className={cx("flashsale-end")}>Flash Sale End !!!</p>
    } else {
      // Render a countdown
      return (<>
        <div>
          <span>Days</span>
          <p>{days}</p>
        </div>
        <span>:</span>
        <div>
          <span>Hours</span>
          <p>{hours}</p>
        </div>
        <span>:</span>
        <div>
          <span>Minutes</span>
          <p>{minutes}</p>
        </div>
        <span>:</span>
        <div>
          <span>Seconds</span>
          <p>{seconds}</p>
        </div>
      </>)
    }
  };
  return (
    <div className={cx("flashsale-countdown")}>
      <Countdown
        date={countDownDate}
        renderer={renderer}
      >
      </Countdown>
    </div>
  )
};

export default CountDown;
