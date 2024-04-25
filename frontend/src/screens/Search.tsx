import React, { useState } from 'react'
import MentorTags from "../../utils/SearchMentorTags";
import axios from 'axios';
import { BACKEND_URL } from '../../utils/backendUrl';
import { useNavigate } from 'react-router-dom';


export interface Mentor {
    id: string;
    email: string;
    password: string;
    username: string;
    university: string;
    specializations: string[];
    rating: number;
    userMentored: number;
    mentoredId: string[];
    comments: string[]; // You may want to define a proper interface for comments
    imageUrl: string;
    popularity: number;
    timeslots: string[]; // You may want to define a proper interface for timeslots
    usersName: string[];
    roomId: string[];
    price: number;
}


const Search = () => {
    const navigate = useNavigate();
    const [username,setUsername] = useState("");
    const [university,setuniversity] = useState("");
    const [openTag,setOpenTag] = useState(false);
    const [selectedTags, setSelectedTags] = useState<string[]|undefined>([]);
    const [mentors,setMentors] = useState([]);

    const handleTagSelection = (e) => {
        const selectedTag = e.target.value;
        if (selectedTags?.includes(selectedTag)) {
            setSelectedTags(selectedTags.filter(tag => tag !== selectedTag));
        } else {
            setSelectedTags([...selectedTags, selectedTag]);
        }
    };

    const handleSearch = async()=>{
        const resp = await axios.post(`${BACKEND_URL}/app/mentor/search`,{
            username,selectedTags,university
        },{withCredentials:true});
        setMentors(resp.data.users);
        console.log(resp.data);
    }

    const handleSingleMentorCard = (id:string)=>{

        console.log(id)
        navigate(`/mentor/${id}`,{state:{id}});
    }

  return (
    <div className="flex-col">
    <input type="text" placeholder='Enter mentor username' onChange={(e)=>setUsername(e.target.value)}/> 
    <input type="text" placeholder='Enter university' onChange={(e)=>setuniversity(e.target.value)}/>
    <button onClick={()=>setOpenTag(!openTag)}>{openTag?"Enter tags":"Close tage"}</button> 
    {openTag && (
        <select name="tags" multiple 
        onChange={handleTagSelection}
        >
            {MentorTags.map(tag=>(
                <option value={tag} style={{backgroundColor:selectedTags?.includes(tag) ? 'green' : 'white'}}>{tag}</option>
    
            ))}
        </select>
    )}
    <div>Selected Tags: {selectedTags?.join(' ,')}</div>
    <br />
    <button onClick={handleSearch}>Search</button>
   {/* {mentors && (<p>{JSON.stringify(mentors)}</p>)} */}
    {mentors && mentors.map(mentor=>(
      <div onClick={()=>handleSingleMentorCard(mentor.id)}>
         <MentorCard mentor={mentor} />
      </div>
    ))}
    </div>

  )
}



const MentorCard = ({mentor}:{mentor:Mentor})=>{
    return (
        <>
    <div className="mentor-tag">
    <img src={mentor.imageUrl} alt="Mentor" />
    <h3>{mentor.username}</h3>
    <p>University: {mentor.university}</p>
    <p>Specializations: {mentor.specializations.join(', ')}</p>
    <p>Rating: {mentor.rating}</p>
    <p>Price: ${mentor.price}</p>
    </div>
    </>
    )
}


export default Search;