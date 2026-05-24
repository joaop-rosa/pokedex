import { BattleActions } from "../../components/battle/BattleActions";
import { BattleField } from "../../components/battle/BattleField";
import { BattleMessages } from "../../components/battle/BattleMessages";
import { BattleProvider } from "../../context/BattleProvider";
import s from "./index.module.css";

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
	);
}
