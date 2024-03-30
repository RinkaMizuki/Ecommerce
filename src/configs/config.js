const configRoutes = {
  home: "/",
  register: "/register",
  login: "/login",
  googleLogin: "signin-google",
  user: "/user",
  favorite: "/favorite",
  contact: "/contact",
  about: "/about",
  productDetail: "/product-detail/:productId",
  category: "/category/:title",
  manager: "/manager",
  profile: "/manager/profile",
  return: "/manager/returns",
  confirm: "/confirm-email",
  cart: "/cart",
  address: "/manager/address",
  checkout: "/cart/checkout",
  payment: "/payment",
  paymentError: "/payment/error",
  error: "*",
}

export default configRoutes;