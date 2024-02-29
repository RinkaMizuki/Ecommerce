import config from "../configs";

//Pages
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import User from "../pages/User";
import Contact from "../pages/Contact";
import WishList from "../components/WishList/WishList";

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
    element: WishList,
  },
  {
    path: config.routes.contact,
    element: Contact,
  },
]

export { publicRoutes }