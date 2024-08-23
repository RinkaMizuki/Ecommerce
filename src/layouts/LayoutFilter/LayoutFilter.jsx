import classNames from "classnames/bind";
import styles from "./LayoutFilter.module.scss";
import ScrollButton from "../../components/ScrollButton";
import LayoutDefault from "../LayoutDefault/LayoutDefault";
import Sidebar from "../components/Sidebar";
import Slider from "../components/Slider";
import React, { useEffect, useState } from "react";
import useCustomFetch from "../../hooks/useCustomFetch";

const cx = classNames.bind(styles);

const LayoutFilter = ({ toggleTopHeader, children }) => {
  const [categories, setCategories] = useState([]);
  const [getCategories] = useCustomFetch();
  useEffect(() => {
    const fetchData = async () => {
      const response = await getCategories("/Admin/categories");
      setCategories(response.data);
    };
    fetchData();
  }, []);

  return (
    <LayoutDefault toggleTopHeader={toggleTopHeader}>
      <div className={cx("wrapper")}>
        <ScrollButton />
        <Sidebar categories={categories} />
        <Slider />
      </div>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { categories })
      )}
    </LayoutDefault>
  );
};

export default LayoutFilter;
