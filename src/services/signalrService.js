import * as signalR from "@microsoft/signalr";
import { jwtDecode } from "jwt-decode";
import { getRefreshToken } from "../hooks/useCustomFetch";

export function deleteTokenFromCookie(name, path = "/", domain = "localhost") {
    if (getTokenFromCookie(name)) {
        document.cookie =
            name +
            "=" +
            (path ? ";path=" + path : "") +
            (domain ? ";domain=" + domain : "") +
            ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
}
export function getTokenFromCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

const accessTokenFactory = async () => {
    let token = getTokenFromCookie("accessToken");
    // Kiểm tra xem token đã hết hạn chưa
    if (token) {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp < Date.now() / 1000) {
            // Nếu token đã hết hạn, làm mới token
            await getRefreshToken();
            token = getTokenFromCookie("accessToken");
        }
    } else {
        await getRefreshToken();
        token = getTokenFromCookie("accessToken");
    }

    return token;
};

const chathubConnection = new signalR.HubConnectionBuilder()
    .withUrl(`${import.meta.env.VITE_ECOMMERCE_BASE_URL}/admin/chathub`, {
        accessTokenFactory: async () => await accessTokenFactory(),
        withCredentials: true,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Error)
    .build();

export { chathubConnection };
