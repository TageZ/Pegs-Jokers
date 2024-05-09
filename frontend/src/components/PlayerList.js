import React, { useState, useEffect } from "react";
import { auth, database, getPlayer } from "../firebase";
import { ref, get, child } from "firebase/database";



function PlayerList({player1, player2}){
    const [p1PhotoURL, setP1PhotoUrl] = useState(
        "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
    );
    const [p2PhotoURL, setP2PhotoUrl] = useState(
        "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
    );
    const [p1Name, setP1Name] = useState();
    const [p2Name, setP2Name] = useState();
  

    useEffect(() => {
        fetchPlayers(player1, player2);
      }, [player1, player2]);
    
    async function fetchPlayers(p1, p2) {
    if (p1) {
        const [photo1, pName1] = await getPlayer(p1);
        setP1PhotoUrl(photo1);
        setP1Name(pName1);
    }
    if (p2) {
        const [photo2, pName2] = await getPlayer(p2);
        setP2PhotoUrl(photo2);
        setP2Name(pName2);    
    }
    }

    return (
        <div className="players">
            <div className="player">
                {player1 && (
                <div className="display-name">
                    <div className="player-info">
                        <img src={p1PhotoURL} alt="Player 1 Picture" className="player-pic" />
                        <span className="player-name">{p1Name}</span>
                    </div>
                </div>
                )}
                {player2 && (
                <div className="display-name">
                    <div className="player-info">
                        <img src={p2PhotoURL} alt="Player 2 Picture" className="player-pic" />
                        <span className="player-name">{p2Name}</span>
                    </div>
                </div>
                )}
            </div>
        </div>
      );
};

export default PlayerList;