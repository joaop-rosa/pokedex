import { Outlet } from "react-router-dom";
import { SocketProvider } from "../context/SocketProvider";
import { PokemonListProvider } from "../context/PokemonListProvider";
import { PartyProvider } from "../context/PartyProvider";
import { SelectedPokemonProvider } from "../context/SelectedPokemonProvider";

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
