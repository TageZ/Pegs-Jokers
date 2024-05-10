import React from 'react'
import {Outlet, Link, useNavigate} from 'react-router-dom'
import "../Styling.css"
import { auth } from '../firebase';
import title1 from "../assets/title_1T.png"
import King from "../images/king.png"
function Landing() {
    var user = auth.currentUser;
    console.log(user)



    return (
        <div className="landing-page">
            <img className='king' src={King}/>
            <div class="title-options-container">
                <div className="title-container">
                    {/* <ServerConnector /> */}
                    <img src={title1} alt="Pegs And Jokers" />
                    {/* <h1 className="title">Pegs and Jokers</h1> */}
                </div>
                <div className="landing-options">
                    {
                        user == null ? <div><Link className="button-1" to='/login'>Login</Link></div> : <Link className="button-1" to='/home'>Login</Link>
                    }
                    <Link className="button-1" to='/signup'>Sign Up</Link>
                </div>
            </div>
        </div>
    )
}

export default Landing
