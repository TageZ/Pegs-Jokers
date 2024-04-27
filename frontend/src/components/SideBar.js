import React, { useEffect, useState } from 'react'
import '../Styling.css'

export function SideBar({pegs, card, hand, setHand, is_split_move, setPegs, setCard}) {
  const [data, setData] = useState([])

  const value = card ? card.value : 'No Card Selected';

  useEffect(() => {
    if (data.value){
      console.log(data);
      setHand(hand => hand ? [...hand, data.value] : [data.value]);
    }
  }, [data]);

  return (
      <div className='turn-bar'>
          <h1 className='turn-header'>Play a Turn!</h1>
          {pegs.map((peg, index) => (
              <div key={index} className='peg'>
                  Peg {index+1}: {peg.color} {peg.num}
              </div>
          ))}
          <p className='card'>{value}</p>
          <div onClick={handleConfirmTurn} className='confirm-turn'>Confirm Turn</div>
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

      const res = await fetch(url, request);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  function handleConfirmTurn(){
      const turn = !pegs[1] ? {
          "card": {
            "value": card.value
          },
          "p": {
            "color": pegs[0].color,
            "num": pegs[0].num
          },
          "gameID": 1
        } : !is_split_move ?
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
          "spaces": 5
        };
      
      postTurn(turn);
  
      setCard();
      setPegs([]);
  };
}