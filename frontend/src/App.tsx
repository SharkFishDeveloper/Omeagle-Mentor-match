import { BrowserRouter,Routes,Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import HomePage from "./pages/HomePage"
import Login from "./screens/Login"
import Signup from "./screens/Signup"
import Search from "./screens/Search"
import MentorLogin from "./screens/MentorLogin"
import MentorSignin from "./screens/MentorSignin"
import About from "./screens/About"
import Appbar from "./components/Appbar"
import MentorCard from "./components/MentorCard"
import UpdateMentor from "./components/UpdateMentor"

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
          <Route path="/search" element={<Search/>} />
          <Route path="/mentor/:id" element={<MentorCard/>} />
          <Route path="/update-mentor" element={<UpdateMentor/>} />
        </Routes>
      </BrowserRouter>
    )
  }
  

export default App
