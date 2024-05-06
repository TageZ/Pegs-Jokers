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
    const game_room = code

    // useEffect(() => {
    //     // Connect to the server
    //     const socketUrl = `http://localhost:3306/`;
    //     const newSocket = io(socketUrl, { path: '/socket.io' });
    //     setSocket(newSocket);
    
    //     // Listen for connection event
    //     newSocket.on('connect', () => {
    //         console.log('Connected to server');
    //         setResponse('Connected to server');
    //     });
    
    //     // Listen for disconnect event
    //     newSocket.on('disconnect', () => {
    //         console.log('Disconnected from server');
    //         setResponse('Disconnected from server');
    //     });

    //     newSocket.on('moveResponse', (response) => {
    //         console.log('Received move response:', response);
    //         setOtherBoard(true);
    //         setResponse('Recieved response: ' + response)
    //     });

    //     newSocket.on('getUsers', (users) => {
    //         setUsers(users);
    //         console.log(users)
    //     });

    //     newSocket.emit('join', `${game_room}, ${user}`);
    //     console.log(`WebSocket: User ${user} joined room: ${game_room}`);
    //     newSocket.emit('getUsers', `${game_room}`);
    
    //     // Clean up on unmount
    //     return () => {
    //         newSocket.disconnect();
    //     };
    // }, []);

    useEffect(() => {
        // Connect to the server
        const socketUrl = `http://localhost:3306/`;
        const newSocket = io(socketUrl, { path: '/socket.io' });
        setSocket(newSocket);
    
        // Listen for connection event
        newSocket.on('connect', () => {
            console.log('Connected to server');
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
            socket.emit('updateBoard', "UPDATE BOARD");
        }
    }, [newBoard]);


    const printUsers = () => {
        console.log(users)
    }

    useEffect(() => {
        setTurn(instance === player)
    }, [instance, player])

    console.log(socket);

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
                    /> 
                </div>
                {turn && (
                    <div className='side-bar'>
                        <SideBar
                            pegs={pegs}
                            card={card}
                            setCard={setCard}
                            setPegs={setPegs}
                            setBoard={setBoard}
                            player={player}
                        />
                    </div>
                )}
            </div>
            <button>Join WebSocket Room</button>
        <button onClick={() => printUsers()}>Print Users</button>
    </div>
    ) : (
        <LoadingPage />
    );
}

export default Game
