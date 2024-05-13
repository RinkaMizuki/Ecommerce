import { Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import styles from "./ProductSearch.module.scss";
import classNames from "classnames/bind";
import { Fragment } from "react";
import Avatar from "../Avatar";
import { useNavigate } from "react-router-dom";
import { SHOW_PRODUCT_MAX } from "../../layouts/components/Header/Header";
import useCustomFetch from "../../hooks/useCustomFetch";

const cx = classNames.bind(styles);

const Title = ({ title }) => {
  return (
    <span dangerouslySetInnerHTML={{
      __html: title
    }} className={cx("product-title")}></span>
  )
}

const ProductSearch = ({ products, onHideListSearch, onClearInputSearch }) => {

  const navigate = useNavigate();
  const [getCategoryById] = useCustomFetch();

  const formatCurrency = (currency) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currency)
  }

  const handleShowProductDetail = (productId) => {
    onClearInputSearch('');
    onHideListSearch(null);
    navigate(`/product-detail/${productId}`);
  }

  const handleShowMoreProduct = async () => {
    try {
      const res = await getCategoryById(`/Admin/categories/${products[0]?.categoryId}`);
      navigate(`/category/${res.data.title}`);
    } catch (error) {
      console.log(error);
    } finally {
      onClearInputSearch('');
      onHideListSearch(null);
    }
  }

  return (
    <List sx={{
      width: '150%',
      maxWidth: 360,
      bgcolor: 'background.paper',
      position: 'absolute',
      zIndex: 999999999,
      top: "120%",
      padding: !products?.length ? "20px" : "",
      borderRadius: "5px",
    }}
      className={cx('product-list-wrapper')}
    >
      {products?.length ? products.map((p, index) => (
        <Fragment key={p.id}>
          <ListItem alignItems="center" sx={{
            gap: "10px",
            cursor: "pointer"
          }} onClick={() => handleShowProductDetail(p.id)}>
            <ListItemAvatar>
              <Avatar src={p?.url || defaultAvatar} alt={p.image} className={cx("product-image")} />
            </ListItemAvatar>
            <ListItemText
              primary={<Title title={p?.title} />}
              secondary={
                <>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                    className={cx("product-price")}
                  >
                    {p?.price ? <>
                      <span className={cx("product-price-sale")}>{formatCurrency(p?.price * (1 - p?.discount / 100))}</span>
                      <span className={cx("product-price-real")}>{formatCurrency(p?.price)}</span>
                    </> :
                      <Skeleton />
                    }
                  </Typography>
                </>
              }
            />
          </ListItem>
          <Divider variant="fullWidth" component="li" />
          {index === SHOW_PRODUCT_MAX && <span className={cx("product-showmore")} onClick={handleShowMoreProduct}>Show more product...</span>}
        </Fragment>
      )) : <span className={cx("product-unavaiable")}>Product not avaiable...</span>}
    </List>
  )
};

export default ProductSearch;
