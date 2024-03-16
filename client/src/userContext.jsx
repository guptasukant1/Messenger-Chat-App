import { createContext } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [username, setUsername] = useState('')
    const [id, setId] = useState(null)
  return (
    <UserContext.Provider value={{}}>
      {children}
    </UserContext.Provider>
  );
}