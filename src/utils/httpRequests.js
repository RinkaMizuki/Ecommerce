import axios from "axios";

const httpRequests = axios.create({
    baseURL: import.meta.env.VITE_ECOMMERCE_BASE_URL,
    withCredentials: true,
    //timeout: 5000,
});

export const httpRequestAddress = axios.create({
    baseURL: import.meta.env.VITE_ECOMMERCE_PROVINCES_BASE_URL,
});

export const httpRequestGoogle = axios.create({
    baseURL: import.meta.env.VITE_ECOMMERCE_GOOGLE_TOKEN_URI,
});

export const httpRequestSso = axios.create({
    baseURL: import.meta.env.VITE_ECOMMERCE_SSO_BASE_URL,
    withCredentials: true,
    //timeout: 5000,
});

export const httpRequestGeoapify = axios.create({
    baseURL: `https://api.geoapify.com/v1/geocode/search`,
});

export default httpRequests;
