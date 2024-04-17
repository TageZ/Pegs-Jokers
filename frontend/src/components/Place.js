import React, { useEffect, useState } from 'react';

function Place({ position = null, piece = null, pathColor=null}) {

    const [hole, setHole] = useState(); // Initialize color state with an empty string
    const [background, setBackground] = useState(pathColor == null ? '#444444' : pathColor)

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
        else if ((position == 'start' || position == 'end') && piece != null) { // If there is a piece, set the color to the piece's color
            setHole({
                background: piece.color,
                height: '15px',
                width: '15px',
                borderRadius: '50%',
                display: 'inline-block'
            });
        }else if (position == 'start'){
            setHole({
                background: 'black',
                height: '10px',
                width: '10px',
                borderRadius: '50%',
                display: 'inline-block'
            }); 
        }
        else if (position == 'end') { // If there is a piece, set the color to the piece's color
            setHole({
                background: 'black',
                height: '10px',
                width: '10px',
                borderRadius: '50%',
                display: 'inline-block'
            });
        }
        else if (piece !== null) { // If there is a piece, set the color to the piece's color
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

    return (
        <div className="grid-item">
            <div style={{background: background}} className='place-outline'>
                <div style={hole}></div>
            </div>
        </div>
    );
}

export default Place;