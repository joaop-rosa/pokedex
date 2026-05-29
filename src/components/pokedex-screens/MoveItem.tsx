import { useQueryClient } from "@tanstack/react-query";
import cn from "classnames";
import { upperCase, upperFirst } from "lodash";
import { useState } from "react";
import { renderTypeClassnames } from "../../contants/types";
import { fetchMoveFn } from "../../hooks/useApi";
import { Accordion } from "../UI/Accordion";
import { Spinner } from "../UI/Spinner";
import s from "./MoveItem.module.css";

export function MoveItem({ move }) {
	const [moveContent, setMoveContent] = useState(null);
	const queryClient = useQueryClient();

	function renderMoveContent() {
		const fixNull = (number) => {
			if (!number) return "--";
			return number;
		};

		return (
			<div className={s.moveContent}>
				<p className={s.moveInfo}>
					<strong>Power: </strong>
					{fixNull(moveContent.power)}
				</p>
				<p className={s.moveInfo}>
					<strong>Accuracy: </strong>
					{fixNull(moveContent.accuracy)}
				</p>
				<p className={s.moveInfo}>
					<strong>PP: </strong>
					{fixNull(moveContent.pp)}
				</p>
				<p className={s.moveInfo}>
					<strong>Type: </strong>
					<span
						className={cn(
							s.moveInfoType,
							renderTypeClassnames(moveContent.type, s),
						)}
					>
						{upperCase(moveContent.type)}
					</span>
				</p>
				<p className={s.moveInfo}>
					<strong>Damage class: </strong>
					{moveContent.damageClass}
				</p>
				{moveContent.priority ? (
					<p className={s.moveInfo}>
						<strong>Has priority</strong>
					</p>
				) : null}
				<p className={s.moveInfo}>{moveContent.description}</p>
			</div>
		);
	}

	async function handleFetchMove() {
		if (!moveContent) {
			const moveDetailed = await queryClient.fetchQuery({
				queryKey: ["move", move.url],
				queryFn: () => fetchMoveFn(move.url),
			});
			setMoveContent(moveDetailed);
		}
	}
	return (
		<Accordion
			header={(isOpen) => (
				<div className={s.moveHeader}>
					<h4>{upperFirst(move.name)}</h4>
					<span className={s.moveButtonOpen}>{isOpen ? "-" : "+"}</span>
				</div>
			)}
			onClick={handleFetchMove}
			containerClassname={s.move}
			content={
				moveContent ? (
					renderMoveContent()
				) : (
					<Spinner containerClassname={s.spinner} />
				)
			}
		/>
	);
}
