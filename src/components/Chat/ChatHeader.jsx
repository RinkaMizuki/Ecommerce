import { Avatar, Typography } from "@mui/material";

const ChatHeader = ({ admin, setIsShowChat, isShowChat, adminStatus }) => {
    return (
        <div className="card-header d-flex justify-content-between align-items-center p-3">
            <div className="d-flex align-items-center gap-3">
                <Avatar src={admin?.url} />
                <div>
                    <h3
                        className="mb-0"
                        style={{
                            fontWeight: "bold",
                            fontSize: "20px",
                        }}
                    >
                        {admin?.userName || "Unknown"}
                    </h3>
                    <Typography
                        variant="h6"
                        component="h6"
                        sx={{
                            fontSize: "13px",
                            color: "#b4b4b4",
                        }}
                    >
                        <span
                            style={{
                                display: "inline-block",
                                marginRight: "5px",
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                boxSizing: "unset",
                                backgroundColor: `${
                                    adminStatus?.adminId === admin?.userId &&
                                    adminStatus?.status
                                        ? "#4daa57"
                                        : "#8d8d8d"
                                }`,
                            }}
                        ></span>
                        {adminStatus?.adminId === admin?.userId &&
                        adminStatus?.status
                            ? "Active"
                            : "Inactive"}
                    </Typography>
                </div>
            </div>
            <button
                onClick={() => setIsShowChat(!isShowChat)}
                type="button"
                data-mdb-button-init
                data-mdb-ripple-init
                className="btn btn-danger btn-sm"
                data-mdb-ripple-color="dark"
            >
                Close
            </button>
        </div>
    );
};
export default ChatHeader;
