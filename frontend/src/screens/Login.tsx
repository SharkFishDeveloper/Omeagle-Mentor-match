
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { BACKEND_URL } from '../../utils/backendUrl';
import axios from 'axios';
import { useUser } from '../Providers/Socket';

const Login = () => {
    const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [password,setpassword] = useState("");
    const {user,setUser} = useUser();

    const handleLogin = async(e)=>{
      try {
        e.preventDefault();
      const resp = await axios.post(`${BACKEND_URL}/app/user/login`,{
        password,email
      },{withCredentials:true})  
      console.log(resp.data.message);
      setUser(resp.data.user);
      
      return alert(resp.data.message)
      } catch (error) {
        console.log(error.response.data.message);
        
        return alert(error.response.data.message)
      }
    }
  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Login for an account</h2>
      </div>
        <input type="hidden" name="remember" value="true" />
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <input id="email-address" name="email" type="email" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address" onChange={(e)=>setEmail(e.target.value)}/>
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-2" placeholder="Password" onChange={(e)=>setpassword(e.target.value)}/>
          </div>
        </div>

        <div>
          <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none  " onClick={handleLogin}>
            Log in
          </button >
        </div>
        <p className="cursor-pointer " onClick={()=>navigate("/signup")} >Don't have an account ? Signup</p>
        <br />
        <p className="cursor-pointer " onClick={()=>navigate("/mentorlogin")} >Are you a mentor ?</p>
    </div>
  </div>
  </>
  )
}

export default Login