import React, {useState, useEffect} from 'react'
import Board from '../components/Board'
import NavBar from '../components/NavBar'
import LoadingPage from '../pages/Loading';
import { SideBar } from '../components/SideBar';
import { Hand } from '../components/Hand';
import io from 'socket.io-client';
import '../Styling.css'
import { useParams } from 'react-router-dom';


function Game({user}) {
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

    useEffect(() => {
        // Connect to the server
        const socketUrl = `http://localhost:3306/`;
        const newSocket = io(socketUrl, { path: '/socket.io' });
        setSocket(newSocket);
    
        // Listen for connection event
        newSocket.on('connect', () => {
            console.log('Connected to server');
            newSocket.emit('join', `${code}, username`);
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
    }, []);

    useEffect(() => {
        if (socket) {
            socket.emit('updateBoard', code);
        }
    }, [newBoard]);


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
                {turn ? (
                    <div className='side-bar'>
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
                ) : (
                    <div className='turn-bar'></div>
                )}
            </div>
        </div>
    ) : (
        <LoadingPage />
    );
}

export default Game
