import React, { useState, useEffect } from 'react'
import '../Styling.css'

export function Hand({setCard, hand}){

    
    function handleConfirm(card) {
        setCard({ "value": card });
    }

    function displayCard(card) {
        const image = require(`../assets/cards/${card}.png`);

        return (
            <div onClick={() => handleConfirm(card)} className='card'>
                <img src={image}/>
            </div>
        )
    }

    function displayHand(){
        if (hand) {
            return (
                <div className="hand">
                    {hand.map((card, index) => (
                        <div key={index}>
                            {displayCard(card)}
                        </div>
                    ))}
                </div>
            );
        } else {
            return null; 
        }
    }

    return displayHand();
}