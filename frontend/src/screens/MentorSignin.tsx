import React, { useState } from 'react'
import Appbar from '../components/Appbar'
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../../utils/backendUrl';
import axios from 'axios';
import { useUser } from '../Providers/Socket';

const MentorSignin = () => {
    const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [username,setusername] = useState("");
    const [password,setpassword] = useState("");
    const {user,setUser} = useUser();
  
    const handleSignup = async(e)=>{
      try {
        e.preventDefault();
      const resp = await axios.post(`${BACKEND_URL}/app/mentor/signup`,{
      username,password,email
    },{withCredentials:true})  
    console.log(resp.data.message);
    alert(resp.data.message);
    setUser(resp.data.user);
      } catch (error) {
        console.log(error.response.data.message)
        alert(error.response.data.message)
      }
    }
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <p>Want to become a mentor ? </p>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign up for an account</h2>
        </div>
      
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input id="email-address" name="email" type="email" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address" onChange={(e)=>setEmail(e.target.value)}/>
            </div>
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input id="name" name="name" type="text" autoComplete="name" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-2" placeholder="Name" onChange={(e)=>setusername(e.target.value)}/>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-2" placeholder="Password" onChange={(e)=>setpassword(e.target.value)}/>
            </div>
          </div>
  
          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={handleSignup}>
              Signup
            </button>
          </div>
          <p className="cursor-pointer " onClick={()=>navigate("/mentorlogin")} >Already have an account ? Login</p>
        
      </div>
    </div>
    </>
  )
}

export default MentorSignin