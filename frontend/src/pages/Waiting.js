import React, {useEffect} from 'react'
import {Outlet, Link, useNavigate} from 'react-router-dom'
import '../Styling.css';
import { onAuthStateChanged, signOut} from "firebase/auth";
import { auth } from '../firebase';
import title1 from "../assets/title_1T.png"
import { useState, useRef } from 'react';
import {useParams} from 'react-router-dom'
import io from 'socket.io-client';

function Waiting() {
    const [pressed, setPressed] = useState('')
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const [socket, setSocket] = useState(null);
    const [numUsers, setNumUsers] = useState(0);
    const [code, setCode] = useState('');
    const [roomFull, setRoomFull] = useState(false);
    const [roomExists, setRoomExists] = useState(true);
    const [roomNotMade, setRoomMade] = useState(false);

    const connectToServer = (code) => {
        return new Promise((resolve, reject) => {
            const socketUrl = `http://localhost:3306/`;
            const newSocket = io(socketUrl, { path: '/socket.io' });
            setSocket(newSocket);
    
            newSocket.on('connect', () => {
                newSocket.emit('requestUserCount', code); 
            });
    
            // Handle connection errors
            newSocket.on('connect_error', (error) => {
                console.error('Connection error:', error);
                reject(error);
            });
    
            newSocket.on('userCountResponse', (userCount) => {
                resolve(userCount); 
            });

            return () => {
                newSocket.disconnect();
            };
        });
    }
 
    const handleLogout = () => {               
        signOut(auth).then(() => {
        // Sign-out successful.
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
        // An error happened.
        });
    }

    const joinGame = async (code) => {
        if (code) {
            try {
                let count = await connectToServer(code); 
                if (count == 0){
                    setRoomExists(false);
                    setRoomFull(false);
                }
                else if (count > 3){
                    setRoomFull(true);
                    setRoomExists(true);
                } else {
                    navigate(`/${code}/game/${count}`);  
                }
            } catch (error) {
                console.error('Failed to connect to server:', error);
            }
        }
    }

    const makeGame = async (code) => {
        if (code) {
            try {
                let count = await connectToServer(code);  
                if (count > 0){
                    setRoomMade(true);
                } else {
                    const response = await createGame(code);
                    console.log(response);
                    navigate(`/${code}/game/${count}`);  
                }
            } catch (error) {
                console.error('Failed to connect to server:', error);
            }
        }
    }

    async function createGame(code) {
        try {
          const url = 'http://localhost:8080/game?roomName=' + code;
    
          const request = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          };
    
          const response = await fetch(url, request);
          return response.text();
        } catch (error) {
          throw error;
        }
      };
      

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
            {pressed === 'join' && roomFull && <p className='room-error-message'>That room is full.</p>}
            {pressed === 'join' && !roomExists && <p className='room-error-message'>That room doesn't exist.</p>}
            {pressed === 'make' && roomNotMade && <p className='room-error-message'>That room already exists.</p>}
            {pressed === 'join' ? 
                <div>
                    <input type="text" placeholder="Enter Game Code" ref={inputRef} />
                    <button onClick={() => joinGame(inputRef.current.value)}>Join Game</button>                </div>
                : pressed === 'make' ?
                <div>
                    <input type="text" placeholder="Create Game Code" ref={inputRef} />
                    <button onClick={() => makeGame(inputRef.current.value)}>Make Game</button>                </div>
                :
                <>
                    <button className="button-1" onClick={() => setPressed('join')}>
                        Join_Game
                    </button>
                    <button className="button-1" onClick={() => setPressed('make')}>
                        Make_Game
                    </button>
                </>
            }
            <button className="button-1" onClick={handleLogout}>
                Logout
            </button>
        </div>
    )
}

export default Waiting
