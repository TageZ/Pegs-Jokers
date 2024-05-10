import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import '../Styling.css'
import { useEffect } from 'react'
import { auth } from '../firebase';
import { onAuthStateChanged} from "firebase/auth";
import UserProfile from '../components/UserProfile';
function Profile() {
    const navigate = useNavigate();

    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is signed in
              const uid = user.uid;
            } else {
              // User is signed out
              navigate("/")
            }
          });
         
    }, [])
    

    return (
        <div className="profile-page">
            <h1 className='text-white'>User Profile</h1>
            <UserProfile />
            <Link className="button-2" to='/home'>Home</Link>
        </div>
    )
}

export default Profile
