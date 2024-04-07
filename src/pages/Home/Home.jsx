import styles from "./Home.module.scss";
import classNames from "classnames/bind";
import ProductFlashSale from "../../components/ProductFlashSale";
import Category from "../../components/Category";
import ProductFuture from "../../components/ProductFuture";
import ProductSuggest from "../../components/ProductSuggest";
import ProductArrival from "../../components/ProductArrival";
import Sidebar from "../../layouts/components/Sidebar";
import Slider from "../../layouts/components/Slider";
import ProductService from "../../components/ProductService";
import { ToastContainer } from "react-toastify"
import Snowfall from "react-snowfall";
import ProductBestSeller from "../../components/ProductBestSeller/ProductBestSeller";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ScrollButton from "../../components/ScrollButton";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useEffect } from "react";
import { Helmet } from "react-helmet";

const cx = classNames.bind(styles);

const Home = () => {

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }, [])

  return (
    <>
      {/* <Snowfall
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          zIndex: 2,
        }}
      /> */}
      <ToastContainer
        icon={({ type }) => {
          if (type === "info") return <RemoveCircleOutlineIcon />;
          else if (type === "success") return <AddCircleOutlineIcon />;
          else if (type === "error") return <HighlightOffIcon />;
          else return <WarningAmberIcon />
        }}
        style={{
          marginTop: "60px",
        }}
      ></ToastContainer>
      <Helmet>
        <meta name="description" content="Welcome to MT STORE, your one-stop destination for cutting-edge technology products. At MT STORE, we pride ourselves on offering a wide range of high-quality gadgets, electronics, and accessories to meet all your tech needs." />
        <title>Ecommerce - MT Store</title>
        <link rel="canonical" href={window.location.origin} />
      </Helmet>
      <div className={cx("wrapper")}>
        <ScrollButton />
        <Sidebar />
        <Slider />
      </div>
      <ProductFlashSale></ProductFlashSale>
      <Category></Category>
      <ProductBestSeller></ProductBestSeller>
      <ProductFuture></ProductFuture>
      <ProductSuggest></ProductSuggest>
      <ProductArrival></ProductArrival>
      <ProductService></ProductService>
    </>
  )
};

export default Home;
