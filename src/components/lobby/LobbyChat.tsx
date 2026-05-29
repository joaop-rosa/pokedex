import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useSocket } from "../../hooks/useSocket";
import s from "./LobbyChat.module.css";

export function LobbyChat() {
	const { sendChatMessage, chatMessages } = useSocket();
	const [message, setMessage] = useState("");

	function handleSendMessage() {
		if (message.length) {
			sendChatMessage(message);
			setMessage("");
		}
	}

	return (
		<div className={s.lobbyChat}>
			<div className={s.messagesWrapper}>
				{chatMessages.map(({ name, message, hour, color }) => {
					const hourFormatted = `${new Date(hour).getHours()}:${
						new Date(hour).getMinutes() < 10
							? `0${new Date(hour).getMinutes()}`
							: new Date(hour).getMinutes()
					}`;

					return (
						<div key={hour} className={s.message}>
							<div className={s.messageHeader}>
								<h4 className={s.messageName} style={{ color }}>
									{name}
								</h4>
								<p className={s.messageHour}>{hourFormatted}</p>
							</div>

							<p className={s.messageText}>{message}</p>
						</div>
					);
				})}
			</div>
			<form
				className={s.inputWrapper}
				onSubmit={(e) => {
					e.preventDefault();
					handleSendMessage();
				}}
			>
				<input
					type="text"
					className={s.inputMessage}
					value={message}
					onChange={(event) => setMessage(event.target.value)}
					placeholder="SEND MESSAGE_"
				/>
				<button
					type="submit"
					className={s.submitButton}
					disabled={!message.trim().length}
				>
					<FaPaperPlane />
				</button>
			</form>
		</div>
	);
}
