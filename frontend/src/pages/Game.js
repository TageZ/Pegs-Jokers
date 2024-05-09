import React, {useState, useEffect} from 'react'
import Board from '../components/Board'
import NavBar from '../components/NavBar'
import LoadingPage from '../pages/Loading';
import PlayerList from '../components/PlayerList';
import { SideBar } from '../components/SideBar';
import { Hand } from '../components/Hand';
import io from 'socket.io-client';
import '../Styling.css'
import { useParams, useNavigate} from 'react-router-dom';
import { onAuthStateChanged, signOut, getAuth} from "firebase/auth";
import { auth } from '../firebase';



function Game({user}) {
    const navigate = useNavigate();
    const instance = {user}.user;
    const [pegs, setPegs] = useState([])
    const [card, setCard] = useState()
    const [cards, setCards] = useState([])
    const [player, setPlayer] = useState()
    const [newBoard, setBoard] = useState(true)
    const [otherBoard, setOtherBoard] = useState(true)
    const [turn, setTurn] = useState(false);
    const [socket, setSocket] = useState(null);
    const [response, setResponse] = useState('Connected to server')
    const [users, setUsers] = useState([])
    const { code } = useParams(); // This retrieves the game code from the URL
    const [id, setId] = useState('');

    useEffect(() => {


        // Connect to the server
        const socketUrl = `http://localhost:3306/`;
        const newSocket = io(socketUrl, { path: '/socket.io' });
        setSocket(newSocket);
    
        // Listen for connection event
        newSocket.on('connect', () => {
            console.log('Connected to server');
            console.log(id);
            newSocket.emit('join', `${code}, ${id}`);
            setResponse('Connected to server');
        });
    
        // Listen for disconnect event
        newSocket.on('disconnect', () => {
            console.log('Disconnected from server');
            setResponse('Disconnected from server');
        });

        newSocket.on('updateBoardResponse', (response) => {
            console.log('Received move response:', response);
            setOtherBoard(true);
            setResponse('Received response: ' + response)
        });

        newSocket.on('getUsers', (users) => {
            setUsers(users);
            console.log(users)
        });
        
        // Clean up on unmount
        return () => {
            newSocket.disconnect();
        };
    }, [id]);

    useEffect(() => {
        if (socket) {
            socket.emit('updateBoard', code);
        }
    }, [newBoard]);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              const uid = user.uid;
              setId(uid);
            } else {
              // User is signed out
              // ...
              console.log("user is logged out")
              navigate("/")
            }
          });
    })

    const printUsers = () => {
        console.log(users)
    }

    useEffect(() => {
        setTurn(instance === player)
    }, [instance, player])

    return socket ? (
        <div className='game-page' data-testid="game-page">
            <NavBar title="Pegs & Jokers"/>
            <div className='game'>
                <div className='hand-section'>
                    <Hand setCard={setCard} hand={cards}/>
                </div>
                <div className='game-body'>
                    <Board
                        setCard={setCard}
                        setPegs={setPegs}
                        pegs={pegs}
                        newBoard={newBoard}
                        setBoard={setBoard}
                        setCards={setCards}
                        setPlayer={setPlayer}
                        user={instance}
                        turn={turn}
                        otherBoard={otherBoard}
                        setOtherBoard={setOtherBoard}
                        code = {code}
                    /> 
                </div>
                {turn && (
                    <div className='side-bar'>
                        <PlayerList
                            player1={users[0]}
                            player2={users[1]}
                        />
                        <SideBar
                            pegs={pegs}
                            card={card}
                            setCard={setCard}
                            setPegs={setPegs}
                            setBoard={setBoard}
                            player={player}
                            code = {code}
                        />
                    </div>
                )}
            </div>
        </div>
    ) : (
        <LoadingPage />
    );
}

export default Game
