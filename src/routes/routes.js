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
import Cart from "../pages/Cart";
import Address from "../pages/Address";
import CategoryDetail from "../components/CategoryDetail";
import Checkout from "../pages/Checkout";
import Payment from "../pages/Payment";
import PaymentError from "../pages/PaymentError";
import GoogleLogin from "../pages/GoogleLogin";
import Link from "../pages/Link";
import FacebookLogin from "../pages/FacebookLogin";
import ResetPassword from "../pages/ResetPassword";
import Order from "../pages/Order";
import LoggedIn from "../HOC/LoggedIn";
import Review from "../pages/Review/Review";

const publicRoutes = [
  {
    path: config.routes.home,
    element: Home,
    layout: "filter"
  },
  {
    path: config.routes.register,
    element: LoggedIn(Register),
    layout: "default"
  },
  {
    path: config.routes.login,
    element: LoggedIn(Login),
    layout: "default"
  },
  {
    path: config.routes.resetPassword,
    element: ResetPassword,
    layout: null
  },
  {
    path: config.routes.googleLogin,
    element: GoogleLogin,
    layout: "default"
  },
  {
    path: config.routes.facebookLogin,
    element: FacebookLogin,
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
    path: config.routes.category,
    element: CategoryDetail,
    layout: "filter"
  },
  {
    path: config.routes.profile,
    element: Profile,
    layout: "management"
  },
  {
    path: config.routes.order,
    element: AuthRequired(Order),
    layout: "management"
  },
  {
    path: config.routes.cancel,
    element: AuthRequired(Order),
    layout: "management"
  },
  {
    path: config.routes.return,
    element: AuthRequired(Order),
    layout: "management"
  },
  {
    path: config.routes.link,
    element: AuthRequired(Link),
    layout: "management"
  },
  {
    path: config.routes.address,
    element: AuthRequired(Address),
    layout: "management"
  },
  {
    path: config.routes.review,
    element: AuthRequired(Review),
    layout: "management"
  },
  {
    path: config.routes.confirm,
    element: Confirm,
    layout: null
  },
  {
    path: config.routes.cart,
    element: AuthRequired(Cart),
    layout: "default",
  },
  {
    path: config.routes.checkout,
    element: AuthRequired(Checkout),
    layout: "default",
  },
  {
    path: config.routes.payment,
    element: AuthRequired(Payment),
    layout: "default",
  },
  {
    path: config.routes.paymentError,
    element: AuthRequired(PaymentError),
    layout: null,
  },
  {
    path: config.routes.error,
    element: Notfound,
    layout: null,
  }
]

export { publicRoutes }