import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { BrowserRouter } from "react-router-dom"
import { PartyProvider } from "./context/PartyProvider"
import { SocketProvider } from "./context/SocketProvider"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <BrowserRouter>
    <SocketProvider>
      <PartyProvider>
        <App />
      </PartyProvider>
    </SocketProvider>
  </BrowserRouter>
)
