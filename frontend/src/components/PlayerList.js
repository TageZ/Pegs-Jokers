import React, { useState, useEffect } from "react";
import { auth, database, getPlayer } from "../firebase";
import { ref, get, child } from "firebase/database";



function PlayerList({player1, player2, player3, player4}){
    const [p1PhotoURL, setP1PhotoUrl] = useState(
        "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
    );
    const [p2PhotoURL, setP2PhotoUrl] = useState(
        "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
    );
    const [p3PhotoURL, setP3PhotoUrl] = useState(
        "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
    );
    const [p4PhotoURL, setP4PhotoUrl] = useState(
        "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
    );

    const [p1Name, setP1Name] = useState();
    const [p2Name, setP2Name] = useState();
    const [p3Name, setP3Name] = useState();
    const [p4Name, setP4Name] = useState();
  

    useEffect(() => {
        fetchPlayers(player1, player2, player3, player4);
      }, [player1, player2, player3, player4]);
    
    async function fetchPlayers(p1, p2, p3, p4) {
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
    if (p3) {
        const [photo3, pName3] = await getPlayer(p3);
        setP3PhotoUrl(photo3);
        setP3Name(pName3);
    }
    if (p4) {
        const [photo4, pName4] = await getPlayer(p4);
        setP4PhotoUrl(photo4);
        setP4Name(pName4);    
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
                {player3 && (
                <div className="display-name">
                    <div className="player-info">
                        <img src={p3PhotoURL} alt="Player 3 Picture" className="player-pic" />
                        <span className="player-name">{p3Name}</span>
                    </div>
                </div>
                )}
                {player4 && (
                <div className="display-name">
                    <div className="player-info">
                        <img src={p4PhotoURL} alt="Player 4 Picture" className="player-pic" />
                        <span className="player-name">{p4Name}</span>
                    </div>
                </div>
                )}
            </div>
        </div>
      );
};

export default PlayerList;