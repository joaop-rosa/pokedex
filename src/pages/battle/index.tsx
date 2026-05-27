import { useState } from "react";
import { BattleActions } from "../../components/battle/BattleActions";
import { BattleField } from "../../components/battle/BattleField";
import { BattleMessages } from "../../components/battle/BattleMessages";
import { BattleProvider } from "../../context/BattleProvider";
import { useSocket } from "../../hooks/useSocket";
import s from "./index.module.css";
import cn from "classnames";

function BattleContent() {
	const { battle, finishBattle } = useSocket();
	const { isOver, winner } = battle || {};
	const [showLogMobile, setShowLogMobile] = useState(false);

	return (
		<div className={s.sectionBattle}>
			<div className={s.splitContainer}>
				<div className={s.mainArea}>
					{/* O componente BattleField agora controlará a arena completa (Jogador + Oponente) */}
					<BattleField />
					<BattleActions />
				</div>
				<div className={cn(s.sidebarArea, { [s.sidebarAreaMobileVisible]: showLogMobile })}>
					<button 
						className={s.closeLogMobile} 
						onClick={() => setShowLogMobile(false)}
						type="button"
					>
						✕ Fechar Histórico
					</button>
					<BattleMessages />
				</div>
			</div>

			<button 
				className={s.mobileLogToggle}
				onClick={() => setShowLogMobile(true)}
				type="button"
			>
				📝 Histórico
			</button>

			{isOver && (
				<div className={s.gameOverOverlay}>
					<h1 className={s.gameOverTitle}>{winner} venceu a partida!</h1>
					<button
						type="button"
						className={s.finishButton}
						onClick={finishBattle}
					>
						Finalizar Batalha
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
