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
    const [numUsers, setNumUsers] = useState(0)
    const [code, setCode] = useState('')

    const connectToServer = (code) => {
        return new Promise((resolve, reject) => {
            const socketUrl = `http://localhost:3306/`;
            const newSocket = io(socketUrl, { path: '/socket.io' });
            setSocket(newSocket);
    
            newSocket.on('connect', () => {
                console.log('Connected to server');
                newSocket.emit('join', `${code}, username`); // Emit event to join the room
                newSocket.emit('requestUserCount', code); // Emit event to request user count
            });
    

    
            // Handle connection errors
            newSocket.on('connect_error', (error) => {
                console.error('Connection error:', error);
                reject(error);
            });
    
            newSocket.on('userCountResponse', (userCount) => {
                console.log(`Number of users in room ${code}: ${userCount}`);
                resolve(userCount);  // Resolve the promise with userCount
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
        if(code){
            await connectToServer(code);  // Ensure this completes before navigating
            navigate(`/${code}/game/${numUsers}`);
        }
    }

    // const makeGame = (code) => {
    //     console.log("CODE1: " + code)
    //     if(code){
    //         console.log("CODE: " + code)
    //         connectToServer(code)
    //         console.log(numUsers)
    //         navigate(`/${code}/game/${numUsers}`)
    //     }
    // }

    // const makeGame = async (code) => {
    //     console.log("CODE1: " + code);
    //     if (code) {
    //         console.log("CODE: " + code);
    //         try {
    //             await connectToServer(code);  // Wait for connectToServer to complete
    //             navigateToGame(code, numUsers);  // Then navigate
    //         } catch (error) {
    //             console.error('Failed to connect to server:', error);
    //         }
    //     }
    // }
    const makeGame = async (code) => {
        console.log("CODE1: " + code);
        if (code) {
            console.log("CODE: " + code);
            try {
                let count = await connectToServer(code);  // Wait for connectToServer to complete and get the userCount
                console.log(count);  // Log the userCount value
                navigate(`/${code}/game/${count - 1}`);  // Navigate with the correct userCount value
            } catch (error) {
                console.error('Failed to connect to server:', error);
            }
        }
    }

    const navigateToGame = (code, numUsers) => {
            navigate(`/${code}/game/${numUsers}`);
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
            {pressed === 'joined' ? 
                <div>
                    <input type="text" placeholder="Enter Game Code" ref={inputRef} />
                    <button onClick={() => makeGame(inputRef.current.value)}>Join Game</button>                </div>
                : pressed === 'make' ?
                <div>
                    <input type="text" placeholder="Create Game Code" ref={inputRef} />
                    <button onClick={() => makeGame(inputRef.current.value)}>Make Game</button>                </div>
                :
                <>
                    <button className="button-1" onClick={() => setPressed('make')}>
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
