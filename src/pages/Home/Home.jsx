import styles from "./Home.module.scss";
import classNames from "classnames/bind";
import ProductFlashSale from "../../components/ProductFlashSale";
import Category from "../../components/Category";
import BestSeller from "../../components/BestSeller/BestSeller";
import ProductFuture from "../../components/ProductFuture";
import SuggestProduct from "../../components/SuggestProduct";
import ProductArrival from "../../components/ProductArrival";
import Sidebar from "../../layouts/components/Sidebar";
import Slider from "../../layouts/components/Slider";
import ProductService from "../../components/ProductService";
import { toast, ToastContainer } from "react-toastify"
import Snowfall from "react-snowfall";

const cx = classNames.bind(styles);

const Home = () => {
  return (
    <div>
      {/* <Snowfall
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          zIndex: 2,
        }}
      /> */}
      <ToastContainer></ToastContainer>
      <div className={cx("wrapper")}>
        <Sidebar />
        <Slider />
      </div>
      <ProductFlashSale></ProductFlashSale>
      <Category></Category>
      <BestSeller></BestSeller>
      <ProductFuture></ProductFuture>
      <SuggestProduct></SuggestProduct>
      <ProductArrival></ProductArrival>
      <ProductService></ProductService>
    </div >
  )
};

export default Home;
