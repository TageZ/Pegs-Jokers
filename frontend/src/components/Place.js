import React, { useEffect, useState } from 'react';
import '../Styling.css'

function Place({ position = null, piece = null, pathColor=null, setPegs, turn}) {

    const [hole, setHole] = useState(); // Initialize color state with an empty string
    const [background, setBackground] = useState(pathColor == null ? '#444444' : pathColor)

    const brown = '#61483e';
    const tan = '#dfb289';

    useEffect(() => {
        // Check if the position is 'path' and the piece is null to set the color to black
        if (position === 'path' && piece === null) {
            setHole({
                background: 'black',
                height: '10px',
                width: '10px',
                borderRadius: '50%',
                display: 'inline-block'
            });
        } 
        else if (piece != null) {
            setHole({
                background: piece.color,
                height: '15px',
                width: '15px',
                borderRadius: '50%',
                display: 'inline-block'
            });
        } else { // Reset color if neither condition is met
            setHole({
                background: '#444444',
                height: '10px',
                width: '10px',
                borderRadius: '50%',
                display: 'inline-block'
            });
        }
    }, [piece]); // Watch for changes in position and piece props

    const handlePegClick = () => {
        if (turn && piece) {
            setPegs(pegs => pegs ? [...pegs, piece] : [piece]);
        }
    };

    return (
        <div className="grid-item">
            <div className='place-outline' style={{ background: background }}>
                <div onClick={handlePegClick} style={hole} className={turn ? (piece ? (background === tan ? 'zoom-on-hover-dark' : 'zoom-on-hover-light') : '') : ''}></div>
            </div>
        </div>
    );
}

export default Place;