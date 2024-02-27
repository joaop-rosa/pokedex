import "./App.module.css"
import "./assets/global/global.css"
import { Routes, Route } from "react-router-dom"
import { Home } from "./screens/Home"
import { Lobby } from "./screens/Lobby"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/lobby" element={<Lobby />} />
    </Routes>
  )
}

export default App
