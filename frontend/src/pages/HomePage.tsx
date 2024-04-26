
import  { useState } from 'react'
import { useUser } from '../Providers/Socket'



const HomePage = () => {
  const user = useUser();
  let userlength = false;
  if(user?.user?.timeslots){
    userlength = true;
  }
  // console.log("userlength",userlength,"rating",user?.user.timeslots)
  console.log("This is user",user);
  const [history,setHistory] = useState(false);
  const [mentorHistory,setmentorHistory] = useState(false);
  return (
    <div>
    <p>{user ? <p>{userlength ? "Hey , mentor":"Hello ,user "}</p>: 'Loading...'}</p>
    {!userlength ? (
      <>
        {user && (
          <button onClick={() => setHistory(!history)} className="text-black font-bold text-xl">
            <p>{history ? "Close " : "See roomId for connecting with mentors"}</p>
          </button>
        )}
        {user && history && (
  <div className="flex">
    <div className="mr-8">
      <h2 className="text-lg font-bold">Mentor Names:</h2>
      {user.user?.mentorName ? (
              user.user.mentorName.map((name, index) => (
                <li key={index} className="list-disc ml-4">{name}</li>
              ))
            ) : (
              <li className="list-disc ml-4">Nothing</li>
            )}
    </div>
    <div>
      <h2 className="text-lg font-bold">Room IDs:</h2>
      <ul>
            {user.user?.roomId ? (
              user.user.roomId.map((roomId, index) => (
                <li key={index} className="list-disc ml-4">{roomId}</li>
              ))
            ) : (
              <li className="list-disc ml-4">Nothing</li>
            )}
          </ul>
    </div>
  </div>
)}
      </>
    ) : (
      <>
      <button onClick={() => setmentorHistory(!mentorHistory)} className="text-black font-bold text-xl">
      <p>{history ? "Close " : "See roomId for connecting with users "}</p>
    </button>
    {user && mentorHistory && (
  <div className="flex">
    <div className="mr-8">
      <h2 className="text-lg font-bold">Mentor Names:</h2>
      <ul>
  {user.user?.usersName ? (
    user.user.usersName.map((name, index) => (
      <li key={index} className="list-disc ml-4">{name}</li>
    ))
  ) : (
    <li className="list-disc ml-4">Nothing</li>
  )}
</ul>
    </div>
    <div>
      <h2 className="text-lg font-bold">Room IDs:</h2>
      <ul>
    {user.user?.roomId ? (
      user.user.roomId.map((roomId, index) => (
        <li key={index} className="list-disc ml-4">{roomId}</li>
      ))
    ) : (
      <li className="list-disc ml-4">Nothing</li>
    )}
  </ul>
    </div>
  </div>
)}
    </>
    
    )}
  </div>
  )

}

export default HomePage