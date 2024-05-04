import React, { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";
import './Games.css'
import ResultModal from './ResultModal';
//https://coolors.co/palettes/trending
const ENDPOINT = "http://127.0.0.1:50000"; 
const games = ["Coin Flip", "Dice Roll"]

const Games = () => {
  const [data, setData] = useState([]);
  const [bet, setBet] = useState("");
  const [pick, setPick] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    
    socket.on("games_updated", (games) => {
      setData(games);
      console.log(games)
    });

    socket.on("results_updated", (results) => {
      console.log(results);
    });

    fetchGames();

    return () => socket.disconnect();
  }, []);

  const fetchGames = () => {
    fetch('/games')
      .then(res => res.json())
      .then(data => {
        setData(data.games);
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  

  // const updatePickSelection = (userPick) => {
  //   setPick(userPick);
  // }

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value !== ""){
      setBet(value);
    }
    else {
      setBet("");
    }
  }

  const placeBet = (id) => {
    const socket = socketIOClient(ENDPOINT);
    const pick_type = pick === 'HEAD' ? 0 : 1;
    socket.emit('new_bet', [id, bet, pick_type]);
  }

  

  return (
    <>
    <div className='game-layout'>
      {data.map((games, index) => (
          <div key={index}> 
            {Object.entries(games).map(([id, time])=> (
            <div key={id} className='game-card'>
                 <h1 className='game-title'>COIN FLIP</h1>
                 <p className='game-pot'>{time}</p>
                 <div className='game-pick-selection'>
                   <button
                  onClick={() => setPick('HEAD')}
                  style = {{
                    backgroundColor: pick === 'HEAD' ? 'black' : 'aliceblue',
                    color: pick === 'HEAD' ? 'aliceblue' : 'black'
                  }} 
                  className='game-pick-button'
                >
                  HEAD
                </button>
                <button 
                  onClick={() => setPick('TAIL')}
                  style = {{
                    backgroundColor: pick === 'TAIL' ? 'black' : 'aliceblue',
                    color: pick === 'TAIL' ? 'aliceblue' : 'black'
                  }} 
                  className='game-pick-button'
                >
                  TAIL
                </button>
              </div>
              <input
                className="game-bet-input"
                type="text"
                placeholder={"MIN BET: " + 0}
                value={bet}
                onChange={handleInputChange}
              />
              <button className="game-bet-button" onClick={placeBet(id)} disabled={!pick || isNaN(bet)}>BET</button>
              <button className="game-bet-button" onClick={() => setShowResults(true)}> RESULTS </button>
          </div>
          ))}
          </div>
      ))}
    </div>
    { showResults && (<ResultModal open={showResults} onClose={() => setShowResults(false)} bet={5} pick={"TAIL"} result={"heads"} winAmount={10}/>)}
    </>
  );
}

export default Games