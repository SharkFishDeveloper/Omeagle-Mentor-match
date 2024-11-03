
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SocketProvider, UserProvider } from './Providers/Socket.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <UserProvider>
    <SocketProvider>
    <App />
    </SocketProvider>
    </UserProvider>
)
