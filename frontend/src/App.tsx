import { BrowserRouter,Routes,Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import JoinRoom from "./pages/JoinRoom"

  function App() {

    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/room/:id" element={<JoinRoom/>} />
        </Routes>
      </BrowserRouter>
    )
  }
  

export default App
