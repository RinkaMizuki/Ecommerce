import config from "../configs";

//Pages
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import User from "../pages/User";

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
    element : User,
  },
]

export { publicRoutes }