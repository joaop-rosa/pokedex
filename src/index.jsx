import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { BrowserRouter } from "react-router-dom"
import { PartyProvider } from "./context/PartyProvider"
import { PokemonListProvider } from "./context/PokemonListProvider"
import { SocketProvider } from "./context/SocketProvider"
import { SelectedPokemonProvider } from "./context/SelectedPokemonProvider"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <BrowserRouter>
    <PokemonListProvider>
      <SelectedPokemonProvider>
        <PartyProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </PartyProvider>
      </SelectedPokemonProvider>
    </PokemonListProvider>
  </BrowserRouter>
)
