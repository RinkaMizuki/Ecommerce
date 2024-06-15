import * as signalR from "@microsoft/signalr";
import { jwtDecode } from "jwt-decode";
import { getRefreshToken } from "../hooks/useCustomFetch";
import { store } from "../redux/store";

function getTokenFromCookie(name) {
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
            const type = store.getState().auth.login.type;
            await getRefreshToken(type);
            token = getTokenFromCookie("accessToken");
        }
    } else {
        const type = store.getState().auth.login.type;
        await getRefreshToken(type);
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