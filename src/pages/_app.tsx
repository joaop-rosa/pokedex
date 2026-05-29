import { Outlet } from "react-router-dom";
import { PartyProvider } from "../context/PartyProvider";
import { PokemonListProvider } from "../context/PokemonListProvider";
import { SelectedPokemonProvider } from "../context/SelectedPokemonProvider";
import { SocketProvider } from "../context/SocketProvider";

export default function App() {
	return (
		<SocketProvider>
			<PokemonListProvider>
				<PartyProvider>
					<SelectedPokemonProvider>
						<Outlet />
					</SelectedPokemonProvider>
				</PartyProvider>
			</PokemonListProvider>
		</SocketProvider>
	);
}
