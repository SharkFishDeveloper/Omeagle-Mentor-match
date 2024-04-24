import { BrowserRouter,Routes,Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import HomePage from "./pages/HomePage"
import Login from "./screens/Login"
import Signup from "./screens/Signup"
import MentorLogin from "./screens/MentorLogin"
import MentorSignin from "./screens/MentorSignin"
import About from "./screens/About"
import Appbar from "./components/Appbar"

  function App() {

    return (
      <BrowserRouter>
      <Appbar/>
        <Routes>
          <Route path="/connect" element={<LandingPage/>} />
          <Route path="/" element={<HomePage/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/mentorlogin" element={<MentorLogin/>} />
          <Route path="/mentorsignup" element={<MentorSignin/>} />

        </Routes>
      </BrowserRouter>
    )
  }
  

export default App
