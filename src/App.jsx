import "./App.module.css"
import "./assets/global/global.css"
import { Routes, Route } from "react-router-dom"
import { Home } from "./home/home"
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default App
