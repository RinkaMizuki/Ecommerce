import { useEffect, useState } from "react"
import styles from "./Sidebar.module.scss";
import classNames from "classnames/bind";
import { TreeView } from "@mui/x-tree-view";
import { ExpandMore, ChevronRight } from "@mui/icons-material"
import useCustomFetch from "../../../hooks/useCustomFetch";
import MenuItem from "../MenuItem";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

const cx = classNames.bind(styles);

const Sidebar = () => {

  const [categories, setCategories] = useState([])
  const [getCategories] = useCustomFetch();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getCategories("/Admin/categories")
      setCategories(response.data)
    }
    fetchData()
  }, [])

  return (
    <div className={cx("sidebar-wrapper")}>
      <TreeView
        aria-label="Categories"
        defaultCollapseIcon={<ExpandMore />}
        defaultExpandIcon={<ChevronRight />}
        sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
      >
        {categories.length ? categories.map(c => (
          <MenuItem data={c} key={c.id} />
        )) : <Skeleton
          count={4}
          style={{ marginTop: "5px", height: "18px" }}
        />}
      </TreeView>
      <div className={cx("line")}></div>
    </div>
  )
};

export default Sidebar;
