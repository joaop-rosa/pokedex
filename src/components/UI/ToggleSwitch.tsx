import cn from "classnames";
import s from "./ToggleSwitch.module.css";

export function ToggleSwitch({ onChange, isDisabled = false }) {
	return (
		<label className={s.switch}>
			<input onChange={onChange} type="checkbox" disabled={isDisabled} />
			<span className={cn(s.slider, { [s.sliderDisabled]: isDisabled })} />
		</label>
	);
}
