import cn from "classnames";
import { renderTypeClassnames } from "../../contants/types";
import { useSelectedPokemon } from "../../hooks/useSelectedPokemon";
import s from "./DefaultScreen.module.css";

export function DefaultScreen() {
	const { selectedPokemon, speciesInfo } = useSelectedPokemon();
	if (!selectedPokemon) return null;

	return (
		<div className={s.infoScreenContent}>
			<div className={s.infoScreenContentInfo}>
				<div className={s.infoScreenContentRow}>
					<span>Types</span>
					<div className={s.typesWrapper}>
						{selectedPokemon.types.map((type) => (
							<div
								key={type}
								className={cn(s.type, renderTypeClassnames(type, s))}
							>
								<p className={s.typeName}>{type.toUpperCase()}</p>
							</div>
						))}
					</div>
				</div>
				<p className={s.infoScreenContentRow}>
					<span>Weight</span>
					{`${selectedPokemon.weight}kg`}
				</p>
				<p className={s.infoScreenContentRow}>
					<span>Height</span>
					{`${selectedPokemon.height}cm`}
				</p>
				<p className={s.infoScreenContentRow}>
					<span>Description</span>
					{speciesInfo?.description}
				</p>
			</div>
		</div>
	);
}
