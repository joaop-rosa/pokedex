import s from "./Battle.module.css"
import { BattleProvider } from "../context/BattleProvider"
import { BattleActions } from "../components/battle/BattleActions"
import { BattleField } from "../components/battle/BattleField"
import { BattleMessages } from "../components/battle/BattleMessages"

export default function Battle() {
  return (
    <BattleProvider>
      <div className={s.sectionBattle}>
        <div className={s.container}>
          <BattleField isOpponent />
          <BattleField />
          <BattleActions />
          <BattleMessages />
        </div>
      </div>
    </BattleProvider>
  )
}
