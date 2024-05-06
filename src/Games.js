import React, { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";
import './Games.css'
import ResultModal from './ResultModal';
import config from './config';
import CountdownTimer from './CountdownTimer';

//https://coolors.co/palettes/trending

const ENDPOINT = config.ENDPOINT; 

function placeBet(id, bet, pick) {
  const socket = socketIOClient(ENDPOINT)
  const pick_type = pick === 'HEAD' ? 0 : 1;
  socket.emit('new_bet', [id, bet, pick_type]);
}

const calcResult = (isWin, pick) => {
  console.log("isWin pick:", isWin, pick)
  if(isWin) {
    return pick === 'HEAD' ? 'heads' : 'tails';
  }
  else {
    return pick === 'HEAD' ? 'tails' : 'heads';
  }
}

const Games = () => {
  const [data, setData] = useState([]);
  const [bet, setBet] = useState("");
  const [pick, setPick] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [haveResults, setHaveResults] = useState(false);
  const [result, setResult] = useState({});
  const [timerDone, setTimerDone] = useState(false);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    
    socket.on("games_updated", (games) => {
      setData(games);
      console.log(games)
    });

    socket.on("results_updated", (results) => {
      console.log("RESULT:", results)
      const r = Object.entries(results[0])[0];
      const id = r[0];
      const [isWin, winAmount] = r[1];
      console.log({ id: id, isWin: isWin, winAmount: winAmount })
      setResult({ id: id, isWin: isWin, winAmount: winAmount });
      setHaveResults(true);
    });

    fetchGames();

    return () => {socket.disconnect();}
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

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value !== ""){
      setBet(value);
    }
    else {
      setBet("");
    }
  }

  const checkTimerValue = (value) => {
    value = Number(value)
    if(value === 0) {
      setTimerDone(true);
    } else {
      setTimerDone(false);
    }
  }

  const TIME_STYLE = {
    fontSize: "225%",
    marginBottom: "5%",
  }

  return (
    <>
    <div className='game-layout'>
      {data.map((games, index) => (
          <div key={index}> 
            {Object.entries(games).map(([id, time])=> (
            <div key={id} className='game-card'>
                 <h1 className='game-title'>COIN FLIP</h1>
                 {/* POTENTIAL TO MAKE THE TIME A TIMER COUNTDOWN */}
                 <CountdownTimer time={time} TIME_STYLE={TIME_STYLE} checkTimerValue={checkTimerValue}/>
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
                id = {`game-bet-input-${id}`}
                className="game-bet-input"
                type="text"
                placeholder={"MIN BET: " + 1}
                value={bet}
                onChange={handleInputChange}
              />
              <button className="game-bet-button" onClick={() => placeBet(id, bet, pick)} disabled={!pick || isNaN(bet) || bet === "" || timerDone}>BET</button>
              <button className="game-bet-button" onClick={() => setShowResults(true)} disabled={!haveResults}> FLIP </button>
          </div>
          ))}
          </div>
      ))}
    </div>

    { showResults && (<ResultModal open={showResults} onClose={() => setShowResults(false)} bet={bet} pick={pick} result={calcResult(result.isWin, pick)} winAmount={result.winAmount}/>)}
    
    </>
  );
}

export default Games