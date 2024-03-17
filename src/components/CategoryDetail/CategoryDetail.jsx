import classNames from "classnames/bind";
import styles from "./CategoryDetail.module.scss";
import Aside from "./Aside";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";
import useCustomFetch from "../../hooks/useCustomFetch"
import Cart from "../Cart";
import { Lightbox } from "react-modal-image";

const cx = classNames.bind(styles);

const CategoryDetail = () => {

  const [loading, setLoading] = useState(false);
  const [listProductByCate, setListProductByCate] = useState([]);
  const [productId, setProductId] = useState("");

  const params = useParams();
  const location = useLocation();
  const [getListProductByCate] = useCustomFetch();

  const closeLightBox = (id) => {
    setProductId(id);
  }

  useLayoutEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getListProductByCate(`/Admin/products/category/${location?.state?.categoryId}`);
        setListProductByCate(res.data);
      } catch (error) {
        console.log(error);
      }
      finally {
        setLoading(false);
      }
    }
    fetchData()
  }, [params.title])

  return (
    <div className={cx("category-detail-container")}>
      {listProductByCate?.map(p => {
        if (p.id == productId) {
          return (
            <div style={{ fontFamily: "Poppins" }} key={p.id}>
              <Lightbox
                imageBackgroundColor="transparent"
                hideZoom={true}
                hideDownload={true}
                onClose={closeLightBox}
                large={p.url}
                alt={p.image}
              />
            </div>
          )
        }
        return null;
      })}
      <Aside data={listProductByCate} />
      <div className={cx("line-space")}></div>
      <div className={cx("content-wrapper")}>
        <h2 className={cx("category-title")}>{params?.title}</h2>
        <div className={cx("category-sort")}>
          <span>Sắp xếp theo </span>
          <span className={cx("button-sort", "active")}><div className={cx("icon")}><svg height="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M416 288h-95.1c-17.67 0-32 14.33-32 32s14.33 32 32 32H416c17.67 0 32-14.33 32-32S433.7 288 416 288zM544 32h-223.1c-17.67 0-32 14.33-32 32s14.33 32 32 32H544c17.67 0 32-14.33 32-32S561.7 32 544 32zM352 416h-32c-17.67 0-32 14.33-32 32s14.33 32 32 32h32c17.67 0 31.1-14.33 31.1-32S369.7 416 352 416zM480 160h-159.1c-17.67 0-32 14.33-32 32s14.33 32 32 32H480c17.67 0 32-14.33 32-32S497.7 160 480 160zM192.4 330.7L160 366.1V64.03C160 46.33 145.7 32 128 32S96 46.33 96 64.03v302L63.6 330.7c-6.312-6.883-14.94-10.38-23.61-10.38c-7.719 0-15.47 2.781-21.61 8.414c-13.03 11.95-13.9 32.22-1.969 45.27l87.1 96.09c12.12 13.26 35.06 13.26 47.19 0l87.1-96.09c11.94-13.05 11.06-33.31-1.969-45.27C224.6 316.8 204.4 317.7 192.4 330.7z"></path></svg></div>
            Giá Cao - Thấp</span>
          <span className={cx("button-sort")}><div className={cx("icon")}><svg height="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M320 224H416c17.67 0 32-14.33 32-32s-14.33-32-32-32h-95.1c-17.67 0-32 14.33-32 32S302.3 224 320 224zM320 352H480c17.67 0 32-14.33 32-32s-14.33-32-32-32h-159.1c-17.67 0-32 14.33-32 32S302.3 352 320 352zM320 96h32c17.67 0 31.1-14.33 31.1-32s-14.33-32-31.1-32h-32c-17.67 0-32 14.33-32 32S302.3 96 320 96zM544 416h-223.1c-17.67 0-32 14.33-32 32s14.33 32 32 32H544c17.67 0 32-14.33 32-32S561.7 416 544 416zM192.4 330.7L160 366.1V64.03C160 46.33 145.7 32 128 32S96 46.33 96 64.03v302L63.6 330.7c-6.312-6.883-14.94-10.38-23.61-10.38c-7.719 0-15.47 2.781-21.61 8.414c-13.03 11.95-13.9 32.22-1.969 45.27l87.1 96.09c12.12 13.26 35.06 13.26 47.19 0l87.1-96.09c11.94-13.05 11.06-33.31-1.969-45.27C224.6 316.8 204.4 317.7 192.4 330.7z"></path></svg></div>
            Giá Thấp - Cao</span>
          <span className={cx("button-sort")}>
            <i className="fa-solid fa-arrow-up-z-a"></i>
            Tên A - Z
          </span>
          <span className={cx("button-sort")}>
            <i className="fa-solid fa-arrow-down-z-a"></i>
            Tên Z - A
          </span>
        </div>
        <div className={cx("product-wrapper")}>
          {listProductByCate?.map(p => (
            <Cart
              key={p.id}
              onCloseLightBox={closeLightBox}
              data={p}
            />
          ))}
        </div>
      </div>
    </div>
  )
};

export default CategoryDetail;
