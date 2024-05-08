import React, {useEffect} from 'react'
import {Outlet, Link, useNavigate} from 'react-router-dom'
import '../Styling.css';
import { onAuthStateChanged, signOut} from "firebase/auth";
import { auth } from '../firebase';
import title1 from "../assets/title_1T.png"
import { useState } from 'react';

function Home() {
    const navigate = useNavigate();
    const [id, setId] = useState();
 
    const handleLogout = () => {               
        signOut(auth).then(() => {
        // Sign-out successful.
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
        // An error happened.
        });
    }

    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              const uid = user.uid;
              setId(uid);
              // ...
              console.log("uid", uid)
            } else {
              // User is signed out
              // ...
              console.log("user is logged out")
              navigate("/")
            }
          });
         
    }, [])

    return (
        <div className='home-page'>
            {/* <div>hello</div> */}
            <div className="home-title">
                <img src={title1} alt="Pegs And Jokers" />
                {/* <h1 className="title">Pegs and Jokers</h1> */}
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
