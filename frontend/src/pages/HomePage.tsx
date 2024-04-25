import axios from 'axios'
import React, { useEffect } from 'react'
import { BACKEND_URL } from '../../utils/backendUrl'
import { useUser } from '../Providers/Socket'



const HomePage = () => {
  const user = useUser();
  return (
    <div>
  <p>User - {user ? JSON.stringify(user) : 'Loading...'}</p>
  {user && <p>See roomId for connecting with mentors</p>}
    </div>
  )
}

export default HomePage