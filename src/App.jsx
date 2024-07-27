import { BrowserRouter, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes/routes.js";
import { Fragment, useEffect, useState } from "react";
import LayoutDefault from "./layouts/LayoutDefault";
import "./App.css";
import LayoutManagement from "./layouts/LayoutManagement";
import { ModalContext } from "./context/ModalContext.jsx";
import LayoutFilter from "./layouts/LayoutFilter";
import { BrowserView, MobileView } from "react-device-detect";
import NoSupport from "./pages/NoSupport";
// import socket from "./services/socketioService.js";
// import { getTokenFromCookie } from "./services/signalrService.js";
// import { useContext } from "react";

function App() {
  const [toggleTopHeader, setToggleTopHeader] = useState(false);
  // const { handleShowModalStrange } = useContext(ModalContext);
  // useEffect(() => {
  //   socket.on("receiveLoginDetected", function ({ token }) {
  //     const currentToken = getTokenFromCookie("accessToken");
  //     if (currentToken === token) {
  //       handleShowModalStrange();
  //     }
  //   });
  // }, []);

  useEffect(() => {
    const handleScroll = function () {
      if (this.scrollY > 48) {
        setToggleTopHeader(true);
      } else {
        setToggleTopHeader(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <BrowserView>
        <BrowserRouter>
          <Routes>
            {publicRoutes.map((route, index) => {
              const Layout =
                route?.layout === "management"
                  ? LayoutManagement
                  : !route?.layout
                  ? Fragment
                  : route?.layout === "filter"
                  ? LayoutFilter
                  : LayoutDefault;
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    route?.layout ? (
                      <Layout toggleTopHeader={toggleTopHeader}>
                        <route.element />
                      </Layout>
                    ) : (
                      <Layout>
                        <route.element />
                      </Layout>
                    )
                  }
                ></Route>
              );
            })}
          </Routes>
        </BrowserRouter>
      </BrowserView>
      <MobileView>
        <NoSupport />
      </MobileView>
    </>
  );
}

export default App;
