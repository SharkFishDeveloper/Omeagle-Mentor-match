
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SocketProvider, UserProvider } from './Providers/Socket.tsx'
// import { RecoilRoot } from 'recoil'


ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    // <RecoilRoot>
    <UserProvider>
    <SocketProvider>
    <App />
    </SocketProvider>
    </UserProvider>
      
    // </RecoilRoot>
      
  // </React.StrictMode>,
)
