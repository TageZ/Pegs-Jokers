import React from 'react';

const WinScreen = ({ player }) => {
  return (
    <div className="winscreen">
      <h2>Congratulations, {player}!</h2>
      <p>You've won the game.</p>
    </div>
  );
};

export default WinScreen;