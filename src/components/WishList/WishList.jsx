import { useEffect, useState } from "react";
import Button from "../Button";
import Cart from "../Cart";
import styles from "./WishList.module.scss";
import classNames from "classnames/bind";
import queryString from "query-string";
import useCustomFetch from "../../hooks/useCustomFetch";
import { Lightbox } from "react-modal-image";
import { useSelector } from "react-redux";
import { getLocalFavoriteProductId } from "../../services/favoriteService";

const cx = classNames.bind(styles)

const WishList = () => {
  const [productSuggest, setProductSuggest] = useState([]);
  const [productFavorite, setProductFavorite] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productId, setProductId] = useState("");
  const userLogin = useSelector(state => state.auth.login.currentUser);
  const [listIdFavorite, setListIdFavorite] = useState(getLocalFavoriteProductId(userLogin?.user?.id || []));

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
    fetchData();
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {

        const filterData = {
          idFavorites: listIdFavorite,
          total: listIdFavorite.length
        };
        const queryStringData = queryString.stringify({ filter: JSON.stringify(filterData) })

        const response = await get(`Admin/products?${queryStringData}`);
        setProductFavorite(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [listIdFavorite])

  useEffect(() => {

    const handleStorageChange = () => {
      const ids = getLocalFavoriteProductId(userLogin.user.id);
      setListIdFavorite(ids);
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
    window.addEventListener(`FavoriteDataEvent_${userLogin?.user?.id}`, handleStorageChange);

    return () => {
      window.removeEventListener(`FavoriteDataEvent_${userLogin?.user?.id}`, handleStorageChange);
    };
  }, [])

  const closeLightBox = (id) => {
    setProductId(id);
  }

  return (
    <div className={cx("main-container",)}
    >
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
          <h2 className={cx("title")}>Wishlist ({listIdFavorite.length})</h2>
          {!!productFavorite.length && <Button className={cx("btn-move")}>Move All Bag</Button>}
        </div>
        <div className={cx({
          "wrapper-wishlist-result": productFavorite.length,
          "wrapper-wishlist-no-result": !productFavorite.length,
        })}>
          {productFavorite.length ? productFavorite?.map(p => (
            <Cart
              isRemove={true}
              className={cx("item")}
              key={p.id}
              data={p}
              hiddenStar={true}
            />
          )) : <span className={cx("no-result")}>Không có sản phẩm yêu thích</span>}
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
    </div>
  )
};

export default WishList;
