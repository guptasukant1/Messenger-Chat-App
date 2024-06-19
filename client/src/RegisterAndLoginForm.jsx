import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./userContext";

export default function RegisterAndLoginForm() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isLoginOrReg, setIsLoginOrReg] = useState("register");
	const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);
	async function handleSubmit(ev) {
		ev.preventDefault();
		const url = isLoginOrReg === "register" ? "register" : "login";
		const { data } = await axios.post(url, { username, password });
		setLoggedInUsername(username);
		setId(data.id);
	}
	return (
		<div className="bg-blue-100 h-screen flex items-center">
			<form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
				<input
					value={username}
					onChange={(ev) => setUsername(ev.target.value)}
					type="text"
					placeholder="username"
					className="block w-full rounded-sm p-2 mb-2 border"
				/>
				<input
					value={password}
					onChange={(ev) => setPassword(ev.target.value)}
					type="password"
					placeholder="password"
					className="block w-full rounded-sm p-2 mb-2 border"
				/>
				<button
					type="submit"
					className="bg-blue-500 text-white block w-full rounded-sm p-2"
				>
					{isLoginOrReg === "register" ? "Register" : "Login"}
				</button>
				<div className="text-center mt-2">
					{isLoginOrReg === "register" && (
						<div>
							Already a member? &nbsp;
							<button type="button" onClick={() => setIsLoginOrReg("login")}>
								Login Here
							</button>
						</div>
					)}
					{isLoginOrReg === "login" && (
						<div>
							Don't have an account? &nbsp;
							<button type="button" onClick={() => setIsLoginOrReg("register")}>
								Register Here
							</button>
						</div>
					)}
				</div>
			</form>
		</div>
	);
}

