import cn from "classnames";
import { type ReactNode, useState } from "react";
import s from "./Accordion.module.css";

interface AccordionProps {
	content: ReactNode;
	header: ReactNode | ((isOpen: boolean) => ReactNode);
	containerClassname?: string;
	onClick?: () => void;
}

export function Accordion({
	content,
	header,
	containerClassname,
	onClick,
}: AccordionProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className={cn(s.accordion, containerClassname)}>
			<button
				type="button"
				onClick={() => {
					if (!isOpen) onClick?.();
					setIsOpen((prev) => !prev);
				}}
				className={s.accordionHeader}
			>
				{typeof header === "function" ? header(isOpen) : header}
			</button>
			<div
				className={cn(s.accordionContent, { [s.accordionContentOpen]: isOpen })}
			>
				{content}
			</div>
		</div>
	);
}
