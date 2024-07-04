import { Tooltip } from "@mui/material";

const TooltipTime = ({ children, date, position = "left-start" }) => {
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
                                offset: [0, -14],
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
