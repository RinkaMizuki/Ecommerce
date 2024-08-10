import { Tooltip } from "@mui/material";

const TooltipTime = ({
  children,
  date,
  position = "left",
  offsetX = -2,
  offsetY = -10,
}) => {
  return (
    <Tooltip
      title={new Date(date).toLocaleTimeString()}
      placement={position}
      slotProps={{
        popper: {
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [offsetX, offsetY],
              },
            },
          ],
        },
      }}
    >
      {children}
    </Tooltip>
  );
};

export default TooltipTime;
