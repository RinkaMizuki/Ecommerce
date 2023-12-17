import { useState ,useRef} from "react";
import styles from "./CountDown.module.scss"
import Countdown from "react-countdown";
import classNames from "classnames/bind"

const cx = classNames.bind(styles);
const countDownDate = new Date(2023, 11, 17).getTime();
const CountDown = () => {

  const [ended, setEnded] = useState(false);
  const DaysRef = useRef(null);
  const HoursRef = useRef(null);
  const MinutesRef = useRef(null);
  const SecondsRef = useRef(null);

  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      setEnded(completed);
    } else {
      // Render a countdown
      if (DaysRef.current != null && HoursRef.current != null && MinutesRef.current != null && SecondsRef.current != null) {
        DaysRef.current.textContent = days;
        HoursRef.current.textContent = hours;
        MinutesRef.current.textContent = minutes;
        SecondsRef.current.textContent = seconds;
      }
    }
  };
  return (
    <div className={cx("flashsale-countdown")}>
      <Countdown
        date={countDownDate}
        renderer={renderer}
      >
      </Countdown>
      {!ended ? <>
        <div>
          <span>Days</span>
          <p ref={DaysRef}>03</p>
        </div>
        <span>:</span>
        <div>
          <span>Hours</span>
          <p ref={HoursRef}>23</p>
        </div>
        <span>:</span>
        <div>
          <span>Minutes</span>
          <p ref={MinutesRef}>19</p>
        </div>
        <span>:</span>
        <div>
          <span>Seconds</span>
          <p ref={SecondsRef}>56</p>
        </div>
      </> : <p className={cx("flashsale-end")}>Flash Sale End !!!</p>}
    </div>
  )
};

export default CountDown;
