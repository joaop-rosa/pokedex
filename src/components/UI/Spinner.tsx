import React from "react";
import s from "./Spinner.module.css";
import Pokeball from "../../assets/icons/pokeball.svg?react";
import cn from "classnames";

type SpinnerProps = {
	containerClassname?: string;
};

export function Spinner({ containerClassname }: SpinnerProps) {
	return (
		<div className={cn(s.spinnerWrapper, containerClassname)}>
			<Pokeball className={s.spinner} />
		</div>
	);
}
