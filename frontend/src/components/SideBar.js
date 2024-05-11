import React, {useState, useRef } from 'react'
import '../Styling.css'

export function SideBar({pegs, card, setPegs, setCard, setBoard, player, code, setWinner, setLastCard, setCardUpdate}) {

  const [splitMove, setSplitMove] = useState(false);
  const [spaces, setSpaces] = useState(null);
  const [direction, setDirection] = useState(null);
  const inputRef = useRef(null);
  const value = card ? card.value : 'No Card Selected';

  return (
      <div className='turn-bar'>
          <div className='turn-header'><p>It's your turn!</p></div>
          {pegs.map((peg, index) => (
              <div key={index} className='player-selection'><p>
                  Peg {index+1}: {peg.color} {peg.num}
              </p></div>
          ))}
          <div className='player-selection'><p>{value}</p></div>

          {spaces && <div className='player-selection'><p>Split Move Spaces: {spaces}</p></div>}
          {splitMove && value === 'NINE' && direction == 'forward' && <div className='player-selection'><p>First Peg Direction: Forward</p></div>}
          {splitMove && value === 'NINE' && direction == 'backward' && <div className='player-selection'><p>First Peg Direction: Backward</p></div>}

          {value === 'SEVEN' && !splitMove && <div onClick={setSplitMove} className='split-move'>Making a Split Move?</div>}
          {value === 'SEVEN' && splitMove && !spaces && <div className='split-spaces'>
          <input type="text" placeholder="Enter Split Move Spaces" ref={inputRef} />
          <div onClick={() => setSpaces(inputRef.current.value)} className='confirm-turn'>Confirm Spaces</div>
          </div>}

          {value === 'NINE' && !splitMove && <div onClick={setSplitMove} className='split-move'>Making a Split Move?</div>}
          {value === 'NINE' && splitMove && !spaces && <div className='split-spaces'>
          <input type="text" placeholder="Enter Split Move Spaces" ref={inputRef} />
          <div onClick={() => setSpaces(inputRef.current.value)} className='confirm-turn'>Confirm Spaces</div>
          </div>}
          {value === 'NINE' && splitMove && !direction && <div className='split-spaces'>
          <div onClick={() => setDirection('forward')} className='confirm-turn'>Move first peg forward</div>
          <div onClick={() => setDirection('backward')} className='confirm-turn'>Move first peg backward</div>
          </div>}

          {card != null && pegs.length === 0 ? (
            <div onClick={handleConfirmTurn} className='confirm-turn'>Discard Card?</div>
          ) : card == null ? (
            <div className='cant-confirm-turn'>Confirm Turn</div>
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

      const res = await fetch(url, request);
      const data = await res.text();
      if (data === 'Game Over!'){
        setWinner(true);
      }

      if (data === 'Successful Move!'){
        setLastCard(card.value);
        setCardUpdate(true);
      }
      
    } catch (error) {
      // Error
    }
  };

  async function handleConfirmTurn(){
      const forward = direction == 'forward' || !direction;

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
            "roomName": code
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
          "roomName": code,
          "spaces": spaces,
          "forward": forward
        };
      
      await postTurn(turn);

      setCard();
      setPegs([]);
      setSplitMove(false);
      setSpaces();
      setBoard(true);
      setDirection();
  };
}