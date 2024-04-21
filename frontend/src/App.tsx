import { BrowserRouter,Routes,Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import HomePage from "./pages/HomePage"
import Login from "./screens/Login"
import Signup from "./screens/Signup"
import MentorLogin from "./screens/MentorLogin"
import MentorSignin from "./screens/MentorSignin"

  function App() {

    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/home" element={<HomePage/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/mentorlogin" element={<MentorLogin/>} />
          <Route path="/mentorsignup" element={<MentorSignin/>} />

        </Routes>
      </BrowserRouter>
    )
  }
  

export default App
