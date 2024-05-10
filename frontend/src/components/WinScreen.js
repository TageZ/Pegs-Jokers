import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom'
import { getPlayer } from "../firebase";
import title1 from "../assets/title_1T.png"
import joker from "../images/king.png"
import '../WinScreen.css'
import '../Styling.css'

const WinScreen = ({ player, winner, playerID }) => {

  const[playerName, setPlayerName] = useState();

  const winnerTeam = winner % 2 === 0;
  const playerTeam = player % 2 === 0;
  const playerWon = winnerTeam === playerTeam;

  useEffect(() => {
    fetchPlayer(playerID);
  }, [playerID]);

  async function fetchPlayer(player) {
    if (player) {
        const [photo, name] = await getPlayer(player);
        await setPlayerName(name);
    }
  }
  
  if (playerWon){
    return (
      <div className="win-screen">
        <div className="win-screen-header">
          <h1 className="victory">
              VICTORY!
          </h1>
          <h1 className="win-text">
            Congrats {playerName}, you won!
          </h1>
        </div>
        <div className="win-screen-elements">
          <div className="win-screen-element">
              <img className='joker' src={joker}/>
          </div>
          <div className="win-screen-element">
            <Link className="button-1" to='/home'>Home</Link>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="win-screen">
        <div className="win-screen-header">
          <h1 className="victory">
              DEFEAT!
          </h1>
          <h1 className="win-text">
            Sorry {playerName}, you lost!
          </h1>
        </div>
        <div className="win-screen-elements">
          <div className="win-screen-element">
              <img className='joker' src={joker}/>
          </div>
          <div className="win-screen-element">
            <Link className="button-1" to='/home'>Home</Link>
          </div>
        </div>
      </div>
    );
  }
};

export default WinScreen;