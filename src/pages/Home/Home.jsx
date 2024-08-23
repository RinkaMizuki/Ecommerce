import ProductFlashSale from "../../components/ProductFlashSale";
import Category from "../../components/Category";
import ProductFuture from "../../components/ProductFuture";
import ProductSuggest from "../../components/ProductSuggest";
import ProductArrival from "../../components/ProductArrival";
import ProductService from "../../components/ProductService";
import { ToastContainer } from "react-toastify";
import ProductBestSeller from "../../components/ProductBestSeller/ProductBestSeller";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Helmet } from "react-helmet";

const Home = ({ categories }) => {
  return (
    <>
      <ToastContainer
        icon={({ type }) => {
          if (type === "info") return <RemoveCircleOutlineIcon />;
          else if (type === "success") return <AddCircleOutlineIcon />;
          else if (type === "error") return <HighlightOffIcon />;
          else return <WarningAmberIcon />;
        }}
        style={{
          marginTop: "60px",
        }}
      />
      <Helmet>
        <meta
          name="description"
          content="Welcome to MT STORE, your one-stop destination for cutting-edge technology products. At MT STORE, we pride ourselves on offering a wide range of high-quality gadgets, electronics, and accessories to meet all your tech needs."
        />
        <title>MT Store - Ecommerce</title>
        <link rel="canonical" href={window.location.origin} />
      </Helmet>
      <ProductFlashSale />
      <Category categories={categories} />
      <ProductBestSeller />
      <ProductFuture />
      <ProductSuggest />
      <ProductArrival />
      <ProductService />
    </>
  );
};

export default Home;
