const TooltipTitle = ({
  title,
  children,
  position = "top-start",
  arrow = true,
  offsetX = 0,
  offsetY = 0,
  enterDelay = 200,
  leaveDelay = 200,
  ...props
}) => {
  const classes = useStyles();
  return (
    <Tooltip
      {...props}
      leaveDelay={leaveDelay}
      enterDelay={enterDelay}
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
      classes={{
        tooltip: classes.customTooltip,
      }}
      disableInteractive
      title={title}
      placement={position}
      arrow={arrow}
    >
      {children}
    </Tooltip>
  );
};

export default TooltipTitle;
