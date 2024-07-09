import "./App.module.css"
import "./assets/global/global.css"
import { Routes, Route } from "react-router-dom"
import { Home } from "./screens/Home"
import { Lobby } from "./screens/Lobby"
import Battle from "./screens/Battle"
import { SocketProvider } from "./context/SocketProvider"

function App() {
  return (
    <SocketProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/battle" element={<Battle />} />
      </Routes>
    </SocketProvider>
  )
}

export default App
