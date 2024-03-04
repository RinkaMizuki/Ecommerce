import config from "../configs";

//Pages
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import User from "../pages/User";
import Contact from "../pages/Contact";
import WishList from "../components/WishList";
import About from "../pages/About/About";
import ProductDetail from "../components/ProductDetail";
import Notfound from "../pages/Notfound";
import Profile from "../pages/Profile";
import AuthRequired from "../HOC/AuthRequired";

const publicRoutes = [
  {
    path: config.routes.home,
    element: Home,
  },
  {
    path: config.routes.register,
    element: Register,
  },
  {
    path: config.routes.login,
    element: Login,
  },
  {
    path: config.routes.user,
    element: User,
  },
  {
    path: config.routes.favorite,
    element: AuthRequired(WishList),
  },
  {
    path: config.routes.contact,
    element: Contact,
  },
  {
    path: config.routes.about,
    element: About,
  },
  {
    path: config.routes.productDetail,
    element: ProductDetail
  },
  {
    path: config.routes.profile,
    element: AuthRequired(Profile),
    layout: "management"
  },
  {
    path: config.routes.error,
    element: Notfound
  }
]

export { publicRoutes }