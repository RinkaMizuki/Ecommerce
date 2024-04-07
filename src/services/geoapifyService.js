import { httpRequestGeoapify } from "../utils/httpRequests";

const getCoordinates = async (address) => {
  const res = await httpRequestGeoapify.get(`?text=${address}&apiKey=${import.meta.env.VITE_ECOMMERCE_GEOAPIFY_APIKEY}`)
  return res;
}

export { getCoordinates }