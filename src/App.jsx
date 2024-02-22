import { BrowserRouter, Routes, Route } from "react-router-dom"
import { publicRoutes } from "./routes/routes.js";
import { Fragment } from 'react';
import LayoutDefault from "./layouts/LayoutDefault";
import './App.css'



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {publicRoutes.map((route, index) => {
          const Layout = route.layout === "admin" ? Fragment : LayoutDefault
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
    </BrowserRouter>
  )
}

export default App
