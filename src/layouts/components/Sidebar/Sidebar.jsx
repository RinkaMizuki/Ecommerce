import { useEffect, useState } from "react"
import styles from "./Sidebar.module.scss";
import classNames from "classnames/bind";
import { TreeView } from "@mui/x-tree-view";
import { ExpandMore, ChevronRight } from "@mui/icons-material"
import useCustomFetch from "../../../hooks/useCustomFetch";
import MenuItem from "../MenuItem";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import { Link, useLocation, useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const Sidebar = () => {

  const [categories, setCategories] = useState([])
  const [getCategories] = useCustomFetch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getCategories("/Admin/categories")
      setCategories(response.data)
    }
    fetchData();
  }, [])

  const onNavigate = (c) => {
    navigate(`/category/${c.title}`, {
      state: {
        categoryId: c.id,
      }
    })
  }

  return (
    <>
      <div className={cx("sidebar-wrapper")}>
        <TreeView
          aria-label="Categories"
          defaultExpanded={[`${location.state?.parentCategoryId?.toString() || 0}`]}
          defaultCollapseIcon={<ExpandMore />}
          defaultExpandIcon={<ChevronRight />}
          className={cx("categories")}
          selected={[`${location?.state?.categoryId.toString()}`, `${location.state?.parentCategoryId?.toString()}`]}
        >
          {categories.length ? categories.map(c => (

            <MenuItem data={c} handleClick={() => onNavigate(c)} key={c.id} />
          )) : <Skeleton
            count={4}
            style={{ marginTop: "5px", height: "18px" }}
          />}
        </TreeView>
      </div >
      <div className={cx("line")}></div>
    </>
  )
};

export default Sidebar;
