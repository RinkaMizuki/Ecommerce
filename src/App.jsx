import { BrowserRouter, Routes, Route } from "react-router-dom"
import { publicRoutes } from "./routes/routes.js";
import { Fragment, useEffect, useState } from 'react';
import LayoutDefault from "./layouts/LayoutDefault";
import './App.css'
import Loading from "./pages/Loading";
import LayoutManagement from "./layouts/LayoutManagement";

function App() {
  const [toggleTopHeader, setToggleTopHeader] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const handleLoaded = () => {
      setLoading(false);
    }

    window.addEventListener("load", handleLoaded);

    return () => {
      window.removeEventListener("load", handleLoaded);
    }
  }, [])

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


  return (<>
    {false ? <Loading /> : <BrowserRouter>
      <Routes>
        {publicRoutes.map((route, index) => {
          const Layout = route?.layout === "management" ? LayoutManagement : !route?.layout ? Fragment : LayoutDefault
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
    </BrowserRouter>}
  </>)
}

export default App
