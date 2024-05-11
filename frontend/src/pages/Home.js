import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import '../Styling.css';
import { onAuthStateChanged, signOut} from "firebase/auth";
import { auth } from '../firebase';
import title1 from "../assets/title_1T.png"

function Home() {
    const navigate = useNavigate();
    const [id, setId] = useState();
 
    const handleLogout = () => {               
        signOut(auth).then(() => {
            navigate("/");
        }).catch((error) => {
            
        });
    }

    useEffect(()=>{
        // Gets user login
        onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is signed in
              const uid = user.uid;
              setId(uid);
            } else {
              // User is signed out
              navigate("/")
            }
          });
         
    }, [])

    return (
        <div className='home-page'>
            <div className="home-title">
                <img src={title1} alt="Pegs And Jokers" />
            </div>
            <Link className="button-1" to='/waiting'>Game</Link>
            <Link className="button-1" to={`/profile/${id}`}>Profile</Link>
            <button className="button-1" onClick={handleLogout}>
                Logout
            </button>
        </div>
    )
}

export default Home
