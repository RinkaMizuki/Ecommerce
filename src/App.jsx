import { BrowserRouter, Routes, Route } from "react-router-dom"
import { publicRoutes } from "./routes/routes.js";
import { Fragment, useEffect, useState } from 'react';
import LayoutDefault from "./layouts/LayoutDefault";
import './App.css'
import LayoutManagement from "./layouts/LayoutManagement";
import ModalContextProvider from "./context/ModalContext.jsx";
import LayoutFilter from "./layouts/LayoutFilter";
import { BrowserView, MobileView } from 'react-device-detect';
import NoSupport from "./pages/NoSupport";

function App() {
  const [toggleTopHeader, setToggleTopHeader] = useState(false);

  useEffect(() => {
    const handleScroll = function (e) {
      if (this.scrollY > 48) {
        setToggleTopHeader(true);
      } else {
        setToggleTopHeader(false);
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])


  return (
    <>
      <BrowserView>
        <BrowserRouter>
          <ModalContextProvider>
            <Routes>
              {publicRoutes.map((route, index) => {
                const Layout = route?.layout === "management" ? LayoutManagement : !route?.layout ? Fragment : route?.layout === "filter" ? LayoutFilter : LayoutDefault
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      route?.layout ? <Layout toggleTopHeader={toggleTopHeader}>
                        <route.element />
                      </Layout> : <Layout>
                        <route.element />
                      </Layout>
                    }
                  >
                  </Route>
                )
              })}
            </Routes>
          </ModalContextProvider>
        </BrowserRouter>
      </BrowserView >
      <MobileView>
        <NoSupport />
      </MobileView>
    </>

  )
}

export default App
