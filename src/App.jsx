import "./App.module.css"
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
