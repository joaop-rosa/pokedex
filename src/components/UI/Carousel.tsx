import type { ReactNode } from "react";
import cn from "classnames";
import s from "./Carousel.module.css";

interface CarouselProps {
	children: ReactNode;
	className?: string;
}

export function Carousel({ children, className }: CarouselProps) {
	return (
		<div 
			className={cn(s.carouselContainer, className)}
			onPointerDown={(e) => e.stopPropagation()}
		>
			<div className={s.innerCarousel}>{children}</div>
		</div>
	);
}
