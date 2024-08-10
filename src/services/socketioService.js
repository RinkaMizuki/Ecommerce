import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_ECOMMERCE_SSO_BASE_URL}`, {
  withCredentials: true,
  autoConnect: true,
  path: "/authhub/socket.io",
  timeout: 10000,
});

export default socket;
