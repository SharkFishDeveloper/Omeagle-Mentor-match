import axios from 'axios'
import React, { useEffect } from 'react'
import { BACKEND_URL } from '../../utils/backendUrl'
import Appbar from '../components/Appbar'

const HomePage = () => {
    useEffect(()=>{
        const getData =async ()=>{
            const ans = await axios.get(`${BACKEND_URL}/app/user/login`);
            console.log(ans.data);
        }
        getData();
    })
  return (
    <div>
        <Appbar/>
    </div>
  )
}

export default HomePage