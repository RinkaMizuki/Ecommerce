import classNames from "classnames/bind";
import styles from "./CategoryDetail.module.scss";
import Aside from "./Aside";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import useCustomFetch from "../../hooks/useCustomFetch"
import Cart from "../Cart";
import queryString from "query-string";
import { icons } from "./Icons";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Helmet } from "react-helmet";
import Lightbox from "../Lightbox";

const cx = classNames.bind(styles);

const priceDiscount = "Price - (Price * Discount / 100)"
const title = "Title"

const sortActive = {
  priceMinMax: {
    active: false,
    icon: icons.priceMinMaxIcon,
    type: "price",
    content: "Giá Thấp - Cao",
    sortBy: priceDiscount,
    sortType: "ASC"
  },
  priceMaxMin: {
    active: false,
    icon: icons.priceMaxMinIcon,
    type: "price",
    content: "Giá Cao - Thấp",
    sortBy: priceDiscount,
    sortType: "DESC"
  },
  titleAZ: {
    active: false,
    icon: icons.titleAZIcon,
    type: "title",
    content: "Tên A - Z",
    sortBy: title,
    sortType: "ASC"
  },
  titleZA: {
    active: false,
    icon: icons.titleZAIcon,
    type: "title",
    content: "Tên Z - A",
    sortBy: title,
    sortType: "DESC"
  },
}

const CategoryDetail = () => {

  const [loading, setLoading] = useState(false);
  const [listProductByCate, setListProductByCate] = useState([]);
  const [productId, setProductId] = useState("");
  const [sortTab, setSortTab] = useState(sortActive);
  const [sortArray, setSortArray] = useState([]);
  const [filterValue, setFilterValue] = useState({
    price: {},
    saleFilter: "",
  })
  const params = useParams();
  const location = useLocation();
  const [getListProductByCate] = useCustomFetch();
  const filterRef = useRef(null);

  const closeLightBox = (id) => {
    setProductId(id);
  }

  const fetchData = async (sale = "", priceRange = {}, sortList = []) => {
    try {
      setLoading(true);
      const filterObj = {
        category: location?.state?.categoryId || params.title,
      };
      let filterString = {
        filter: JSON.stringify(filterObj)
      }

      if (sale) {
        filterObj.sale = sale;
        filterString = {
          filter: JSON.stringify(filterObj)
        }
      }

      if (priceRange.hasOwnProperty("priceLeft") && priceRange.hasOwnProperty("priceRight")) {
        filterObj.priceRange = [
          priceRange.priceLeft,
          priceRange.priceRight
        ]
        filterString = {
          filter: JSON.stringify(filterObj)
        }
      }

      const filter = queryString.stringify(filterString);
      const range = queryString.stringify({
        range: JSON.stringify([0, 11])
      });
      const sort = queryString.stringify({
        sort: JSON.stringify(sortList)
      })

      const res = await getListProductByCate(`/Admin/products?${filter}&${range}&${sort}`, {
        headers: {
          "Range": "products=0-11"
        }
      });
      setListProductByCate(res.data);
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false);
    }
  }

  const handleFilter = async (sale, priceRange, sort) => {
    await fetchData(sale, priceRange, sort);
  }
  const handleSort = async (e, type) => {
    let updatedSortTab = { ...sortTab };
    for (const key in updatedSortTab) {
      if (updatedSortTab[key].type == type) {
        updatedSortTab[key].active = false;
      }
    }
    if (e.target.getAttribute("data-sort")) {
      updatedSortTab[e.target.getAttribute("data-sort")].active = true;
      const temp = updatedSortTab[e.target.getAttribute("data-sort")];
      delete updatedSortTab[e.target.getAttribute("data-sort")];
      updatedSortTab[e.target.getAttribute("data-sort")] = temp;
    }
    setSortTab(updatedSortTab);
    setSortArray(Object.values(updatedSortTab).reverse().filter(o => o.active));
    const filterValue = filterRef.current.getCurrentFilterValue();
    setFilterValue(filterValue)
  }

  const extractSortCriteria = (sortArray = []) => {
    if (!sortArray.length) {
      return [];
    }
    const result = [];

    sortArray.forEach((item) => {
      result.push(item.sortBy);
      result.push(item.sortType);
    });

    return result;
  };


  useEffect(() => {
    handleFilter(filterValue.saleFilter, filterValue.price, extractSortCriteria(sortArray));
  }, [sortArray, params.title, sortTab])

  return (
    <div className={cx("category-detail-container")}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>MT Store - {params.title.charAt(0).toUpperCase() + params.title.slice(1)}</title>
        <link rel="canonical" href={`${window.location.origin}/manager/profile`} />
      </Helmet>
      {listProductByCate?.map(p => {
        if (p.id == productId) {
          return (
            <div style={{ fontFamily: "Poppins" }} key={p.id}>
              <Lightbox
                onClose={closeLightBox}
                url={p.url}
                alt={p.title}
              />
            </div>
          )
        }
        return null;
      })}
      <Aside data={listProductByCate} handleFilter={handleFilter} ref={filterRef} />
      <div className={cx("line-space")}></div>
      <div className={cx("content-wrapper")}>
        <div className={cx("title-wrapper")}>
          <h2 className={cx("category-title")}>{params?.title}</h2>
          {Object.keys(sortArray).map((key, index) => {
            const icon = sortArray[key].active ? sortArray[key].icon : null;
            const content = sortArray[key].active ? sortArray[key].content : null;
            return (icon && content ? <span key={index} className={cx("button-sort")} style={{
              minWidth: "155px"
            }}
            ><div className={cx("icon")} >{icon}
              </div>
              <span className={cx("remove-sort-icon")}
                onClick={(e) => handleSort(e, sortArray[key].type)}>
                <HighlightOffIcon />
              </span>
              {content}</span> : <></>)
          })}
        </div>
        <div className={cx("category-sort")}>
          <span>Sắp xếp theo </span>
          <span className={cx("button-sort", {
            active: sortTab.priceMaxMin.active
          })}
            data-sort="priceMaxMin"
            onClick={(e) => handleSort(e, "price")}
          ><div className={cx("icon")} data-sort="priceMaxMin"><svg data-sort="priceMaxMin" height="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path data-sort="priceMaxMin" d="M416 288h-95.1c-17.67 0-32 14.33-32 32s14.33 32 32 32H416c17.67 0 32-14.33 32-32S433.7 288 416 288zM544 32h-223.1c-17.67 0-32 14.33-32 32s14.33 32 32 32H544c17.67 0 32-14.33 32-32S561.7 32 544 32zM352 416h-32c-17.67 0-32 14.33-32 32s14.33 32 32 32h32c17.67 0 31.1-14.33 31.1-32S369.7 416 352 416zM480 160h-159.1c-17.67 0-32 14.33-32 32s14.33 32 32 32H480c17.67 0 32-14.33 32-32S497.7 160 480 160zM192.4 330.7L160 366.1V64.03C160 46.33 145.7 32 128 32S96 46.33 96 64.03v302L63.6 330.7c-6.312-6.883-14.94-10.38-23.61-10.38c-7.719 0-15.47 2.781-21.61 8.414c-13.03 11.95-13.9 32.22-1.969 45.27l87.1 96.09c12.12 13.26 35.06 13.26 47.19 0l87.1-96.09c11.94-13.05 11.06-33.31-1.969-45.27C224.6 316.8 204.4 317.7 192.4 330.7z"></path></svg></div>
            Giá Cao - Thấp</span>
          <span className={cx("button-sort", {
            active: sortTab.priceMinMax.active
          })}
            onClick={(e) => handleSort(e, "price")}
            data-sort="priceMinMax"
          ><div className={cx("icon")} data-sort="priceMinMax"><svg data-sort="priceMinMax" height="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path data-sort="priceMinMax" d="M320 224H416c17.67 0 32-14.33 32-32s-14.33-32-32-32h-95.1c-17.67 0-32 14.33-32 32S302.3 224 320 224zM320 352H480c17.67 0 32-14.33 32-32s-14.33-32-32-32h-159.1c-17.67 0-32 14.33-32 32S302.3 352 320 352zM320 96h32c17.67 0 31.1-14.33 31.1-32s-14.33-32-31.1-32h-32c-17.67 0-32 14.33-32 32S302.3 96 320 96zM544 416h-223.1c-17.67 0-32 14.33-32 32s14.33 32 32 32H544c17.67 0 32-14.33 32-32S561.7 416 544 416zM192.4 330.7L160 366.1V64.03C160 46.33 145.7 32 128 32S96 46.33 96 64.03v302L63.6 330.7c-6.312-6.883-14.94-10.38-23.61-10.38c-7.719 0-15.47 2.781-21.61 8.414c-13.03 11.95-13.9 32.22-1.969 45.27l87.1 96.09c12.12 13.26 35.06 13.26 47.19 0l87.1-96.09c11.94-13.05 11.06-33.31-1.969-45.27C224.6 316.8 204.4 317.7 192.4 330.7z"></path></svg></div>
            Giá Thấp - Cao</span>
          <span className={cx("button-sort", {
            active: sortTab.titleAZ.active
          })}
            data-sort="titleAZ"
            onClick={(e) => handleSort(e, "title")}
          >
            <i data-sort="titleAZ" className="fa-solid fa-arrow-up-z-a"></i>
            Tên A - Z
          </span>
          <span className={cx("button-sort", {
            active: sortTab.titleZA.active
          })}
            data-sort="titleZA"
            onClick={(e) => handleSort(e, "title")}
          >
            <i data-sort="titleZA" className="fa-solid fa-arrow-down-z-a"></i>
            Tên Z - A
          </span>
        </div>
        <div className={cx("product-wrapper", {
          center: !listProductByCate.length
        })}>
          {listProductByCate.length ? listProductByCate?.map(p => (
            <Cart
              key={p.id}
              onCloseLightBox={closeLightBox}
              data={p}
            />
          )) : <span className={cx("product-filter-text")}>Sản phẩm hiện tại không có sẵn.</span>}
        </div>
      </div>
    </div>
  )
};

export default CategoryDetail;
