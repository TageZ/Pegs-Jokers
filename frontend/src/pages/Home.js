import React, {useEffect} from 'react'
import {Outlet, Link, useNavigate} from 'react-router-dom'
import '../Styling.css';
import { onAuthStateChanged, signOut} from "firebase/auth";
import { auth } from '../firebase';

function Home() {
    const navigate = useNavigate();
 
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
              // ...
              console.log("uid", uid)
            } else {
              // User is signed out
              // ...
              console.log("user is logged out")
            }
          });
         
    }, [])

    return (
        <div className='home-page'>
            <div className="title-container">
                <h1 className="title">Pegs and Jokers</h1>
            </div>
            <Link className="button-1" to='/game'>Game</Link>
            <Link className="button-1" to='/profile'>Profile</Link>
            <button className="button-1" onClick={handleLogout}>
                Logout
            </button>
        </div>
    )
}

export default Home
