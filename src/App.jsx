import Snowfall from "react-snowfall"
import Home from "./pages/Home"
import './App.css'

function App() {

  return (
    <>
      <Snowfall
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          zIndex: 2,
        }}
      />
      <div className="snow-wrapper">
      </div>
      <Home />
    </>
  )
}

export default App
