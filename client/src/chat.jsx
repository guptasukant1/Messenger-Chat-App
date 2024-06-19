import { useContext, useEffect, useState } from "react";
import Avatar from "./avatar";
import Logo from "./logo";
import { UserContext } from "./userContext";

export default function Chat() {
	const [ws, setWs] = useState(null);
	const [onlinePeople, setOnlinePeople] = useState({});
	const [selectedUserId, setSelectedUserId] = useState(null);
	const { username, id } = useContext(UserContext);
	const [newMessageText, setNewMessageText] = useState("");
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		const ws = new WebSocket("ws://localhost:4000");
		setWs(ws);
		ws.addEventListener("message", handleMessage);
	}, []);
	function showOnlinePeople(peopleArray) {
		const people = {};
		// biome-ignore lint/complexity/noForEach: <explanation>
		peopleArray.forEach(({ userId, username }) => {
			people[userId] = username;
		});
		setOnlinePeople(people);
	}
	function handleMessage(ev) {
		const messageData = JSON.parse(ev.data);
		if ("online" in messageData) {
			showOnlinePeople(messageData.online);
		} else {
			// console.log({messageData});
			setMessages(prev =>([...prev, {isOur: false, text: messageData.text}]))
		}
		// e.data.text().then(messageString =>{
		// 	console.log(messageString);
		// })
		// console.log(ev.data);
	}

	function sendMessage(ev) {
		ev.preventDefault();
		ws.send(
			JSON.stringify({
				recipient: selectedUserId,
				text: newMessageText,
			}),
		);
		setNewMessageText('')
		setMessages(prev => ([...prev, {text: newMessageText, sender: id}]))

	}

	const otherOnlinePeople = { ...onlinePeople };
	delete otherOnlinePeople[id];

	return (
		<div className="flex h-screen">
			<div className="bg-blue-100 w-1/4  ">
				<Logo />
				{Object.keys(otherOnlinePeople).map((userId) => (
					// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
					<div
						key={userId}
						onClick={() => setSelectedUserId(userId)}
						className={
							// biome-ignore lint/style/useTemplate: <explanation>
							"border-b border-gray-300 flex items-center gap-2 cursor-pointer " +
							(userId === selectedUserId ? "bg-blue-50" : "")
						}
					>
						{userId === selectedUserId && (
							<div className="w-1 bg-blue-500 h-12 rounded-r-md"> </div>
						)}
						<div className="flex gap-2 py-2 pl-4 items-center">
							<Avatar username={onlinePeople[userId]} userId={userId} />
							<span className="text-gray-800">{onlinePeople[userId]}</span>
						</div>
					</div>
				))}
			</div>
			<div className="flex flex-col bg-blue-200 w-3/4 p-2">
				<div className="flex-grow">
					{!selectedUserId && (
						<div className="flex h-full flex-grow items-center justify-center">
							<div className="text-gray-500">
								&larr; Select a person from the sidebar
							</div>
						</div>
					)}
				</div>
				{!!selectedUserId && (
					<div>
						{messages.map(message=>{
							<div>{message.text}</div>
						})}
					</div>
				)}
				<div>
					{!!selectedUserId && (
						<form className="flex gap-2 mx-2 " onSubmit={sendMessage}>
							<input
								type="text"
								placeholder="Type your message here..."
								className="bg-white border p-2 flex-grow rounded-sm"
								value={newMessageText}
								onChange={(ev) => setNewMessageText(ev.target.value)}
							/>
							<button
								type="submit"
								className="bg-blue-500 p-2 text-white rounded-sm"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="w-6 h-6"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
									/>
								</svg>
							</button>
						</form>
					)}
				</div>
			</div>
		</div>
	);
}