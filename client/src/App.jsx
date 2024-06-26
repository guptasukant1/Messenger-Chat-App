import axios from 'axios'
import { UserContextProvider } from "./userContext";
import Routes from "./routes";

function App() {
  axios.defaults.baseURL = 'http://localhost:4000'
  axios.defaults.withCredentials = true
  return (
			<UserContextProvider>
				<Routes />
			</UserContextProvider>
		);
}

export default App
