import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import "./i18n.js";
import GlobalStyles from "./components/GlobalStyles/index.js";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import ModalContextProvider from "./context/ModalContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    // <React.StrictMode>
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <GlobalStyles>
                <ModalContextProvider>
                    <App />
                </ModalContextProvider>
            </GlobalStyles>
        </PersistGate>
    </Provider>
    // </React.StrictMode>,
);
