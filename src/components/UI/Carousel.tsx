import cn from "classnames";
import React, { type ReactNode, useEffect, useRef, useState } from "react";
import s from "./Carousel.module.css";

interface CarouselProps {
	children: ReactNode;
	className?: string;
	initialIndex?: number;
	noGap?: boolean;
}

export function Carousel({
	children,
	className,
	initialIndex = 0,
	noGap,
}: CarouselProps) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [activeIndex, setActiveIndex] = useState(initialIndex);

	// Center on initial index
	useEffect(() => {
		if (scrollRef.current && initialIndex > 0) {
			const container = scrollRef.current;
			setTimeout(() => {
				const inner = container.firstElementChild as HTMLElement;
				if (inner?.children[initialIndex]) {
					const child = inner.children[initialIndex] as HTMLElement;
					const offset =
						child.offsetLeft -
						container.offsetWidth / 2 +
						child.offsetWidth / 2;
					container.scrollTo({ left: offset, behavior: "instant" });
				}
			}, 50);
		}
	}, [initialIndex]);

	// Observer for active index centering
	// biome-ignore lint/correctness/useExhaustiveDependencies: Need to re-run when children change
	useEffect(() => {
		const container = scrollRef.current;
		if (!container) return;
		const inner = container.firstElementChild as HTMLElement;
		if (!inner) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const index = Array.from(inner.children).indexOf(entry.target);
						if (index !== -1) setActiveIndex(index);
					}
				});
			},
			{
				root: container,
				rootMargin: "0px -49% 0px -49%",
				threshold: 0,
			},
		);

		Array.from(inner.children).forEach((child) => {
			observer.observe(child);
		});
		return () => observer.disconnect();
	}, [children]);

	const isDragging = useRef(false);
	const startX = useRef(0);
	const scrollLeft = useRef(0);
	const hasDragged = useRef(false);

	const handlePointerDownCapture = (e: React.PointerEvent) => {
		e.stopPropagation();
		e.nativeEvent.stopPropagation();

		if (e.pointerType !== "mouse") return;

		isDragging.current = true;
		hasDragged.current = false;
		if (scrollRef.current) {
			startX.current = e.pageX - scrollRef.current.offsetLeft;
			scrollLeft.current = scrollRef.current.scrollLeft;
			scrollRef.current.style.scrollSnapType = "none";
		}
	};

	const handlePointerMove = (e: React.PointerEvent) => {
		if (!isDragging.current || !scrollRef.current) return;
		e.preventDefault();
		const x = e.pageX - scrollRef.current.offsetLeft;
		const walk = (x - startX.current) * 1.5;

		if (Math.abs(walk) > 5) {
			hasDragged.current = true;
		}

		scrollRef.current.scrollLeft = scrollLeft.current - walk;
	};

	const handlePointerUp = () => {
		isDragging.current = false;
		if (scrollRef.current) {
			scrollRef.current.style.scrollSnapType = "x mandatory";
		}
	};

	const handleClickCapture = (e: React.MouseEvent) => {
		if (hasDragged.current) {
			e.stopPropagation();
			e.preventDefault();
		}
	};

	const mappedChildren = React.Children.map(children, (child, index) => {
		if (React.isValidElement(child)) {
			return React.cloneElement(child, {
				"data-active": index === activeIndex,
			} as React.HTMLAttributes<HTMLElement>);
		}
		return child;
	});

	return (
		<div
			ref={scrollRef}
			className={cn(s.carouselContainer, className)}
			onPointerDownCapture={handlePointerDownCapture}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerLeave={handlePointerUp}
			onClickCapture={handleClickCapture}
		>
			<div className={cn(s.innerCarousel, { [s.noGap]: noGap })}>
				{mappedChildren}
			</div>
		</div>
	);
}
