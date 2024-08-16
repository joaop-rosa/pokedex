import { useContext } from "react"
import { PartyContext } from "../context/PartyProvider"

const useParty = () => useContext(PartyContext)

export { useParty }
