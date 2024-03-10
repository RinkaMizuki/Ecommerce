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
import Confirm from "../pages/Confirm";
import Return from "../pages/Return";
import Cart from "../pages/Cart";
import Address from "../pages/Address";

const publicRoutes = [
  {
    path: config.routes.home,
    element: Home,
    layout: "default"
  },
  {
    path: config.routes.register,
    element: Register,
    layout: "default"
  },
  {
    path: config.routes.login,
    element: Login,
    layout: "default"
  },
  {
    path: config.routes.user,
    element: User,
    layout: "default"
  },
  {
    path: config.routes.favorite,
    element: AuthRequired(WishList),
    layout: "default"
  },
  {
    path: config.routes.contact,
    element: Contact,
    layout: "default"
  },
  {
    path: config.routes.about,
    element: About,
    layout: "default"
  },
  {
    path: config.routes.productDetail,
    element: ProductDetail,
    layout: "default"
  },
  {
    path: config.routes.profile,
    element: AuthRequired(Profile),
    layout: "management"
  },
  {
    path: config.routes.return,
    element: AuthRequired(Return),
    layout: "management"
  },
  {
    path: config.routes.address,
    element: AuthRequired(Address),
    layout: "management"
  },
  {
    path: config.routes.confirm,
    element: AuthRequired(Confirm),
    layout: null
  },
  {
    path: config.routes.cart,
    element: AuthRequired(Cart),
    layout: "default",
  },
  {
    path: config.routes.error,
    element: Notfound,
    layout: "default"
  }
]

export { publicRoutes }