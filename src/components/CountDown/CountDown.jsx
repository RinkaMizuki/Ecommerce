import styles from "./CountDown.module.scss"
import Countdown from "react-countdown";
import classNames from "classnames/bind"
import { useTranslation } from "react-i18next";

const cx = classNames.bind(styles);
const countDownDate = new Date(2024, 3, 23).getTime();
const CountDown = () => {
  const { t } = useTranslation();
  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <p className={cx("flashsale-end")}>{t("flashsale-end")}</p>
    } else {
      // Render a countdown
      return (<>
        <div>
          <span>{t('day')}</span>
          <p>{days}</p>
        </div>
        <span>:</span>
        <div>
          <span>{t('hour')}</span>
          <p>{hours}</p>
        </div>
        <span>:</span>
        <div>
          <span>{t('minute')}</span>
          <p>{minutes}</p>
        </div>
        <span>:</span>
        <div>
          <span>{t('second')}</span>
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
