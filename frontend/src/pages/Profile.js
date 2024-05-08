import React from 'react'
import {Outlet, Link, useNavigate} from 'react-router-dom'
import '../Styling.css'
import { useEffect } from 'react'
import NavBar from '../components/NavBar'
import { auth } from '../firebase';
import { onAuthStateChanged, signOut} from "firebase/auth";
import UserProfile from '../components/UserProfile';
import {useParams} from 'react-router-dom'



function Profile() {
    const navigate = useNavigate();

    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              const uid = user.uid;
              // ...
              console.log("uid", uid)
              console.log("email", user.email)
            } else {
              // User is signed out
              // ...
              console.log("user is logged out")
              navigate("/")
            }
          });
         
    }, [])
    

    return (
        <div className="profile-page">
            {/* <NavBar title = "Pegs & Jokers"/> */}
            <h1 className='text-white'>User Profile</h1>
            <UserProfile />
            <Link className="button-2" to='/home'>Home</Link>
        </div>
    )
}

export default Profile
