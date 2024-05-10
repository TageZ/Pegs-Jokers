import React, {useState, useEffect} from 'react'
import Board from '../components/Board'
import NavBar from '../components/NavBar'
import LoadingPage from '../pages/Loading';
import PlayerList from '../components/PlayerList';
import { SideBar } from '../components/SideBar';
import { Hand } from '../components/Hand';
import io from 'socket.io-client';
import '../Styling.css'
import WinScreen from '../components/WinScreen';
import { useParams, useNavigate} from 'react-router-dom';
import { onAuthStateChanged, signOut, getAuth} from "firebase/auth";
import { auth } from '../firebase';


function Game({user}) {
    const navigate = useNavigate();
    const instance = {user}.user;
    const [pegs, setPegs] = useState([])
    const [card, setCard] = useState()
    const [lastCard, setLastCard] = useState();
    const [cardImage, setCardImage] = useState();
    const [cards, setCards] = useState([])
    const [player, setPlayer] = useState()
    const [newBoard, setBoard] = useState(true)
    const [otherBoard, setOtherBoard] = useState(true)
    const [winner, setWinner] = useState(false);
    const [otherWinner, setOtherWinner] = useState(false);
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

        newSocket.on('winnerResponse', (response) => {
            console.log('Game is Over:', response);
            setOtherWinner(true);
            setResponse('Received response: ' + response)
        });

        newSocket.on('winnerResponse', (response) => {
            console.log('Game is Over:', response);
            setOtherWinner(true);
            setResponse('Received response: ' + response)
        });

        newSocket.on('getUsers', (users) => {
            setUsers(users);
            console.log(users); 
        });

        newSocket.on('lastCard', (cardValue) => {
            setCardImage(require(`../assets/cards/${cardValue}.png`));
        })
        
        // Clean up on unmount
        return () => {
            newSocket.disconnect();
        };
    }, [id]);

    useEffect(() => {
        if (socket) {
            socket.emit('updateBoard', code);
            socket.emit('updateCard', `${code}, ${lastCard}`);
        }
    }, [newBoard]);

    useEffect(() => {
        if (socket) {
            socket.emit('winner', code);
        }
    }, [winner]);
      
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
            const uid = user.uid;
            setId(uid);
            }
        });
    });

    useEffect(() => {
        setTurn(instance === player)
    }, [instance, player])

    return otherWinner === true ? ( 
        <WinScreen player={instance} winner={player}/>
    ) : socket ? (
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
                <div className='side-bar'>
                    {turn && (  
                        <SideBar
                            pegs={pegs}
                            card={card}
                            setCard={setCard}
                            setPegs={setPegs}
                            setBoard={setBoard}
                            player={player}
                            code = {code}
                            setWinner={setWinner}
                            setLastCard={setLastCard}
                        />
                    )}
                </div> 
            </div>
            <PlayerList
                currentPlayer={player}
                player1={users[0]}
                player2={users[1]}
                player3={users[2]}
                player4={users[3]}
            />
            {cardImage && <div className='last-card'>
                <img src={cardImage}/>
            </div>}
        </div>
    ) : (
        <LoadingPage />
    );
}

export default Game
