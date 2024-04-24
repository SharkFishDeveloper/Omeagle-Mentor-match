import axios from "axios";
import { atom, selector } from "recoil";
import { BACKEND_URL } from "../../../utils/backendUrl";

export const userState = atom({
    key:'initialUserState',
    default:selector({
        key:"user initial atom",
        get:async()=>{
            try {
                const res = await axios.get(`${BACKEND_URL}/app/user`,{withCredentials:true});
                return res.data.user;
              } catch (error) {
                console.error('Error fetching user:', error);
                // throw error; // Rethrow the error to handle it elsewhere if needed
              }
        }
    })
})

