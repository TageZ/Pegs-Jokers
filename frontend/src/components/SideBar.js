import React, { useEffect, useState } from 'react'
import '../Styling.css'

export function SideBar({pegs, card, setPegs, setCard, setBoard, player, code}) {

  const [splitMove, setSplitMove] = useState(false);
  const value = card ? card.value : 'No Card Selected';


  return (
      <div className='turn-bar'>
          <h1 className='turn-header'>Play a move, {player}!</h1>
          {pegs.map((peg, index) => (
              <div key={index} className='selected-peg'>
                  Peg {index+1}: {peg.color} {peg.num}
              </div>
          ))}
          <p className='selected-card'>{value}</p>
          <div onClick={setSplitMove} className='split-move'>Is this a split move?</div>
          {card != null && pegs.length === 0 ? (
            <div onClick={handleConfirmTurn} className='confirm-turn'>Discard Card?</div>
          ) : (
            <div onClick={handleConfirmTurn} className='confirm-turn'>Confirm Turn</div>
          )}
      </div>
  )

  async function postTurn(turn) {
    try {
      const url = 'http://localhost:8080/play/turn';

      const request = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(turn)
      };

      const response = await fetch(url, request);
      console.log(response.text());
    } catch (error) {
      console.error('Error:', error);
    }
  };

  async function handleConfirmTurn(){
      const turn = pegs.length == 0 ? {
        "card": {
          "value": card.value
        },
        "roomName": code
      } : !pegs[1] ? {
          "card": {
            "value": card.value
          },
          "p": {
            "color": pegs[0].color,
            "num": pegs[0].num
          },
          "roomName": code
        } : !splitMove ?
        {
          "card": {
              "value": card.value
          },
          "p": {
              "color": pegs[0].color,
              "num": pegs[0].num
          },
          "p2": {
              "color": pegs[1].color,
              "num": pegs[1].num
            },
          "gameID": 1
        } :
        {
          "card": {
              "value": card.value
          },
          "p": {
              "color": pegs[0].color,
              "num": pegs[0].num
          },
          "p2": {
              "color": pegs[1].color,
              "num": pegs[1].num
            },
          "gameID": 1,
          "spaces": 3
        };
      
      await postTurn(turn);
  
      setCard();
      setPegs([]);
      setBoard(true);
  };
}