import { useContext } from "react"
import { BattleContext } from "../context/BattleProvider"

const useBattle = () => useContext(BattleContext)

export { useBattle }
