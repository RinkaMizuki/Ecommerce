import LayoutDefault from "../../layouts/LayoutDefault/LayoutDefault";
import styles from "./Home.module.scss";
import classNames from "classnames/bind";
import ProductFlashSale from "../../components/ProductFlashSale";
import Category from "../../components/Category";
import BestSeller from "../../components/BestSeller/BestSeller";
import ProductFuture from "../../components/ProductFuture";
import SuggestProduct from "../../components/SuggestProduct";
import ProductArrival from "../../components/ProductArrival";
import ProductService from "../../components/ProductService";

const cx = classNames.bind(styles);
const Home = () => {
  return (
    <div>
      <LayoutDefault>
        <ProductFlashSale></ProductFlashSale>
        <Category></Category>
        <BestSeller></BestSeller>
        <ProductFuture></ProductFuture>
        <SuggestProduct></SuggestProduct>
        <ProductArrival></ProductArrival>
        <ProductService></ProductService>
      </LayoutDefault>
    </div >
  )
};

export default Home;
