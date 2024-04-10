import Cart from "../Cart";
import ViewTitle from "../ViewTitle";
import styles from "./ProductBestSeller.module.scss"
import classNames from "classnames/bind";
import Lightbox from "../Lightbox";
import { useEffect, useState } from "react";
import useCustomFetch from "../../hooks/useCustomFetch";
import queryString from "query-string";
import { useTranslation } from "react-i18next";

const cx = classNames.bind(styles)

const ProductBestSeller = () => {

  const [productBestSeller, setProductBestSeller] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [productId, setProductId] = useState("");
  const [get] = useCustomFetch();
  const { t } = useTranslation();
  const closeLightBox = (id) => {
    setProductId(id);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const filterData = { sale: 'hot' };
        const queryStringData = queryString.stringify({ filter: JSON.stringify(filterData) })

        const response = await get(`Admin/products?${queryStringData}`);
        setProductBestSeller(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []);

  return (
    <div className={cx("bestseller-wrapper")}>
      <ViewTitle
        label={t('this-month')}
        title={t('best-sale')}
        btnView={true}
        className={cx("custom-btn")}
      />
      {productBestSeller?.map(p => {
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
      <div className={cx("bestseller-content")}>
        {productBestSeller?.map(p => (
          <Cart
            onCloseLightBox={closeLightBox}
            data={p}
            key={p.id}
          />
        ))}
      </div>
    </div>
  )
};

export default ProductBestSeller;
