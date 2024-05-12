import React, { useState, useEffect } from 'react'
import Place from './Place'
import '../Styling.css'

function Board({setPegs, pegs, newBoard, setBoard, setCards, setPlayer, user, turn, otherBoard, setOtherBoard, code}) {

    const [data, setData] = useState([]);

    async function getBoard() {
        try {
            const response = await fetch("http://18.118.26.199:8080/board?roomName=" + code, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const result = await response.json();
            setData(result);
        } catch (error) {
            //Error
            console.log("Error getting board");
        }
    }

    const boardSize = 19;
    const gridContainer = {
        display: 'grid',
        gridTemplateColumns: `repeat(${boardSize}, auto)`,

    }

    let initialBoard = []
    for (let i = 0; i < boardSize; i++) {
        let temp = []
        for (let j = 0; j < boardSize; j++) {
            temp.push(null)
        }
        initialBoard.push(temp)
    }

    const brown = '#61483e';
    const tan = '#dfb289';

    const [board] = useState(initialBoard)
    const [grid, setGrid] = useState()

    const start_locations = [
        // TOP
        [
            [3, 8], [2, 7], [2, 8], [2, 9], [1, 8]
        ],
        // RIGHT
        [
            [8, 15], [7, 16], [8, 16], [9, 16], [8, 17]
        ],
        // BOTTOM
        [
            [15, 10], [16, 9], [16, 10], [16, 11], [17, 10]
        ],
        // LEFT
        [
            [10, 3], [9, 2], [10, 2], [11, 2], [10, 1]
        ]
    ]

    const heaven_locations = [
        // TOP
        [
            [1, 3], [2, 3], [3, 3], [3, 4], [3, 5]
        ],
        // RIGHT
        [
            [3, 17], [3, 16], [3, 15], [4, 15], [5, 15]
        ],
        // BOTTOM
        [
            [17, 15], [16, 15], [15, 15], [15, 14], [15, 13]
        ],
        // LEFT
        [
            [15, 1], [15, 2], [15, 3], [14, 3], [13, 3]
        ]
    ]

    function checkSection(indexI, indexJ) {
        const startPosition = findStartIndex(indexI, indexJ);
        if (startPosition != null) {
            let pathColor = startPosition[0] % 2 == 0 ? brown : tan;
            let start = data.starts[startPosition[0]];
            let peg = start[startPosition[1]].peg
            if (peg != null) {
                return <Place piece={peg} pathColor={pathColor} position={'path'} setPegs={setPegs} pegs={pegs} turn={turn}/>;
            } else {
                return <Place pathColor={pathColor} position={'path'} />;
            }
        }

        const heavenPosition = findHeavenIndex(indexI, indexJ);
        if (heavenPosition != null) {
            let pathColor = heavenPosition[0] % 2 == 0 ? brown : tan;
            let heaven = data.heavens[heavenPosition[0]];
            let peg = heaven[heavenPosition[1]].peg
            if (peg != null) {
                return <Place piece={peg} pathColor={pathColor} position={'path'} setPegs={setPegs} pegs={pegs} turn={turn}/>;
            } else {
                return <Place pathColor={pathColor} position={'path'} />;
            }
        }

        return <Place />;
    }

    function findStartIndex(i, j) {
        for (let row = 0; row < start_locations.length; row++) {
            for (let col = 0; col < start_locations[row].length; col++) {
                if (start_locations[row][col][0] === i && start_locations[row][col][1] === j) {
                    return [row, col];
                }
            }
        }
        return null;
    }

    function findHeavenIndex(i, j) {
        for (let row = 0; row < heaven_locations.length; row++) {
            for (let col = 0; col < heaven_locations[row].length; col++) {
                if (heaven_locations[row][col][0] === i && heaven_locations[row][col][1] === j) {
                    return [row, col];
                }
            }
        }
        return null;
    }

    useEffect(() => {
        if (!data.loop) return;
        const hand = data.hands[user].cards;
        let cards = [];
        for (let i = 0; i < 5; i++){
            cards.push(hand[i].value)
        }
        setCards(cards);
        setPlayer(data.playerTurn);
        const sizeBoardSegment = 18;

        let newGrid = <div style={gridContainer}>
            {
                board.map((row, indexI) => {
                    //Top Row Holes
                    return row.map((item, indexJ) => {
                        //Num Player 0's
                        if (indexI == 0 && indexJ > 0) {
                            const pathColor = brown;
                            const peg = data.loop[indexJ - 1].peg
                            return <Place piece={peg} pathColor={pathColor} position={'path'} setPegs={setPegs} pegs={pegs} turn={turn}/>;
                        }
                        //Num Player 1's
                        else if (indexI > 0 && indexJ == row.length - 1) {
                            const pathColor = tan;
                            const peg = data.loop[sizeBoardSegment + indexI - 1].peg
                            return <Place piece={peg} pathColor={pathColor} position={'path'} setPegs={setPegs} pegs={pegs} turn={turn}/>;
                        }
                        //Num Player 2's
                        else if (indexI == initialBoard.length - 1 && indexJ < row.length - 1) {
                            const pathColor = brown;
                            const peg = data.loop[sizeBoardSegment * 2 + (row.length - 2 - indexJ)].peg
                            return <Place piece={peg} pathColor={pathColor} position={'path'} setPegs={setPegs} pegs={pegs} turn={turn}/>;
                        }
                        //Num Player 3's
                        else if (indexI < initialBoard.length - 1 && indexJ == 0) {
                            const pathColor = tan;
                            const peg = data.loop[sizeBoardSegment * 3 + (initialBoard.length - 2 - indexI)].peg
                            return <Place piece={peg} pathColor={pathColor} position={'path'} setPegs={setPegs} pegs={pegs} turn={turn}/>;
                        } else {
                            return checkSection(indexI, indexJ)
                        }
                    })
                })}
        </div>
        setGrid(newGrid)
    }, [data, turn, pegs])

    useEffect(() => {
        getBoard();
        setBoard(false);
        setOtherBoard(false);
    }, [newBoard, otherBoard])

    return (
        <div className="grid-container" data-testid='board-grid'>
            {grid}
        </div>
    )
}

export default Board
