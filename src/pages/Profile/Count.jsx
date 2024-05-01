import { memo, useState } from "react";
import Countdown from "react-countdown";

const Count = ({ onResend }) => {

  const [key, setKey] = useState(false);

  const handleResendOtp = () => {
    onResend();
    setKey(k => !k);
  }

  const Completionist = () => <span style={{
    textDecoration: "underline",
    color: "var(--primary)",
    cursor: "pointer",
  }} onClick={handleResendOtp}>Resend</span>;
  // Renderer callback with condition
  const renderer = ({ seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <Completionist />;
    } else {
      // Render a countdown
      return <span >{seconds == 0 ? 60 : seconds}s</span>;
    }
  };

  return (
    <div style={{
      position: 'absolute',
      right: "5px"
    }}>
      <Countdown
        key={key}
        date={Date.now() + 60000}
        renderer={renderer}
      />
    </div>
  )
};

export default memo(Count);
