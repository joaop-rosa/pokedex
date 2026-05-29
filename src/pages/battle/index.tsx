import cn from "classnames";
import { useState } from "react";
import { BattleActions } from "../../components/battle/BattleActions";
import { BattleField } from "../../components/battle/BattleField";
import { BattleMessages } from "../../components/battle/BattleMessages";
import { BattleProvider } from "../../context/BattleProvider";
import { useSocket } from "../../hooks/useSocket";
import s from "./index.module.css";

function BattleContent() {
	const { battle, finishBattle } = useSocket();
	const { isOver, winner } = battle || {};
	const [showLogMobile, setShowLogMobile] = useState(false);

	return (
		<div className={s.sectionBattle}>
			<div className={s.splitContainer}>
				<div className={s.mainArea}>
					<BattleField />
					<BattleActions />

					<button
						className={s.mobileLogToggle}
						onClick={() => setShowLogMobile(true)}
						type="button"
					>
						📝 Battle Log
					</button>
				</div>
				<div
					className={cn(s.sidebarArea, {
						[s.sidebarAreaMobileVisible]: showLogMobile,
					})}
				>
					<button
						className={s.closeLogMobile}
						onClick={() => setShowLogMobile(false)}
						type="button"
					>
						✕ Close Log
					</button>
					<BattleMessages />
				</div>
			</div>

			{isOver && (
				<div className={s.gameOverOverlay}>
					<h1 className={s.gameOverTitle}>{winner} won the battle!</h1>
					<button
						type="button"
						className={s.finishButton}
						onClick={finishBattle}
					>
						Finish Battle
					</button>
				</div>
			)}
		</div>
	);
}

export default function Battle() {
	return (
		<BattleProvider>
			<BattleContent />
		</BattleProvider>
	);
}
