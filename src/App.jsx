import { BrowserRouter, Routes, Route } from "react-router-dom"
import { publicRoutes } from "./routes/routes.js";
import { Fragment, useEffect, useState } from 'react';
import LayoutDefault from "./layouts/LayoutDefault";
import './App.css'
import Loading from "./pages/Loading";
import LayoutManagement from "./layouts/LayoutManagement";



function App() {

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

  return (<>
    {false ? <Loading /> : <BrowserRouter>
      <Routes>
        {publicRoutes.map((route, index) => {
          const Layout = route?.layout === "management" ? LayoutManagement : LayoutDefault
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
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
