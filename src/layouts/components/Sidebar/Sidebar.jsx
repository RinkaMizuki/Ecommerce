import styles from "./Sidebar.module.scss";
import classNames from "classnames/bind";
import { TreeView } from "@mui/x-tree-view";
import { ExpandMore, ChevronRight } from "@mui/icons-material";
import MenuItem from "../MenuItem";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const cx = classNames.bind(styles);

const Sidebar = ({ categories, isShowLine = true, className, ...props }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    const onNavigate = (c) => {
        navigate(`/category/${c.title}`, {
            state: {
                categoryTitle: c.title,
            },
        });
    };

    return (
        <>
            <div
                className={cx("sidebar-wrapper", {
                    [className]: className,
                })}
                {...props}
            >
                <TreeView
                    sx={{
                        ".MuiTreeItem-iconContainer": {
                            width: "30px !important",
                            height: "30px !important",
                        },
                        ".MuiCollapse-root": {
                            marginLeft: "10px",
                        },
                    }}
                    aria-label="Categories"
                    defaultExpanded={[
                        `${
                            location.state?.parentCategoryTitle?.toLowerCase() ||
                            0
                        }`,
                    ]}
                    defaultCollapseIcon={<ExpandMore />}
                    defaultExpandIcon={<ChevronRight />}
                    className={cx("categories")}
                    selected={[
                        location?.state?.categoryTitle?.toString(),
                        location.state?.parentCategoryTitle?.toString(),
                        params?.title?.toLocaleLowerCase(),
                    ]}
                >
                    {categories.length ? (
                        categories.map((c) => (
                            <MenuItem
                                data={c}
                                handleClick={(e) => {
                                    if (
                                        e.target.nodeName === "svg" ||
                                        e.target.nodeName === "path"
                                    ) {
                                        console.log(
                                            "Clicked on an SVG element"
                                        );
                                        return;
                                    }
                                    console.log(e.target.nodeName);
                                    onNavigate(c);
                                }}
                                key={c.id}
                            />
                        ))
                    ) : (
                        <Skeleton
                            count={4}
                            style={{ marginTop: "5px", height: "18px" }}
                        />
                    )}
                </TreeView>
            </div>
            {isShowLine && <div className={cx("line")}></div>}
        </>
    );
};

export default Sidebar;
