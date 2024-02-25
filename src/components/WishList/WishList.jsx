import { useEffect, useState } from "react";
import Button from "../Button";
import Cart from "../Cart";
import styles from "./WishList.module.scss";
import classNames from "classnames/bind";
import queryString from "query-string";
import useCustomFetch from "../../hooks/useCustomFetch";
import { Lightbox } from "react-modal-image";

const cx = classNames.bind(styles)

const WishList = () => {
  const [productSuggest, setProductSuggest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [productId, setProductId] = useState("");
  const [get] = useCustomFetch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const filterData = { suggest: 'forYou', random: 8 };
        const queryStringData = queryString.stringify({ filter: JSON.stringify(filterData) })

        const response = await get(`Admin/products?${queryStringData}`);
        setProductSuggest(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Call the fetchData function
    fetchData();
  }, [])

  const closeLightBox = (id) => {
    setProductId(id);
  }

  return (
    <div className={cx("main-container")}>
      {productSuggest?.map(p => {
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
      <div className={cx("top-container")}>
        <div className={cx("wrapper-header")}>
          <h2 className={cx("title")}>Wishlist (4)</h2>
          <Button className={cx("btn-move")}>Move All Bag</Button>
        </div>
        <div className={cx("wrapper-wishlist")}>
          {productSuggest?.map(p => (
            <Cart
              isRemove={true}
              className={cx("item")}
              key={p.id}
              data={p}
              hiddenStar={true}
            />
          ))}
        </div>
      </div>
      <div className={cx("spacing-line")}>
        <div></div>
      </div>
      <div className="bottom-container">
        <div className={cx("wrapper-header")}>
          <div className={cx("title-time-text")}>
            <span>Just For You</span>
            <div className={cx("box-primary")}></div>
          </div>
          <Button className={cx("btn-see")}>See All</Button>
        </div>
        <div className={cx("wrapper-foryou")}>
          {productSuggest?.map(p => (
            <Cart key={p.id} data={p} hiddenHeart={true} onCloseLightBox={closeLightBox} />
          ))}
        </div>
      </div>
    </div >
  )
};

export default WishList;
