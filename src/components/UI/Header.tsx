import cn from "classnames";
import { FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import s from "./Header.module.css";

interface HeaderProps {
	theme?: "light" | "dark";
	showBackButton?: boolean;
	backButtonUrl?: string;
	showLogout?: boolean;
	onLogout?: () => void;
}

export function Header({
	theme = "light",
	showBackButton,
	backButtonUrl,
	showLogout,
	onLogout,
}: HeaderProps) {
	return (
		<div className={cn(s.header, { [s.headerDark]: theme === "dark" })}>
			<div className={s.headerLeft}>
				{showBackButton && backButtonUrl && (
					<Link to={backButtonUrl} className={s.backButton}>
						← <span className={s.backButtonText}>Voltar para a lista</span>
					</Link>
				)}
			</div>
			<h1>
				<a href="/">Pokedex</a>
			</h1>
			<div className={s.headerRight}>
				{showLogout && (
					<button type="button" className={s.logoutButton} onClick={onLogout}>
						<FaSignOutAlt />
						<span className={s.logoutText}>Sair</span>
					</button>
				)}
			</div>
		</div>
	);
}
