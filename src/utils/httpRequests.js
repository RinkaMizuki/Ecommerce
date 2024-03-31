import axios from "axios"

const httpRequests = axios.create({
  baseURL: import.meta.env.VITE_ECOMMERCE_BASE_URL,
  withCredentials: true,
})

export const httpRequestAddress = axios.create({
  baseURL: import.meta.env.VITE_ECOMMERCE_PROVINCES_BASE_URL,
})

export const httpRequestGoogle = axios.create({
  baseURL: import.meta.env.VITE_ECOMMERCE_TOKEN_URI
})

export default httpRequests;