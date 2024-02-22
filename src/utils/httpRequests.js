import axios from "axios"

const httpRequests = axios.create({
  baseURL: import.meta.env.VITE_ECOMMERCE_BASE_URL,
  withCredentials: true,
})

export default httpRequests;