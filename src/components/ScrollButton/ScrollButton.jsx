import { useEffect, useState } from "react";
import styles from "./ScrollButton.module.scss"
import classNames from "classnames/bind";

const cx = classNames.bind(styles)

const ScrollButton = () => {

  const [offset, setOffset] = useState(0);

  const handleScrollTop = () => {
    if (offset >= 100) {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }
  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    // clean up code
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button className={cx("scroll-btn", {
      show: !!(offset >= 100),
      hidden: !(offset >= 100),
    })}
      onClick={handleScrollTop}
    >
      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg>
    </button>
  )
};

export default ScrollButton;
