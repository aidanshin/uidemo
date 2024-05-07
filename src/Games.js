import React, { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";
import './Games.css'
import ResultModal from './ResultModal';
import config from './config';
import CountdownTimer from './CountdownTimer';

//https://coolors.co/palettes/trending

const ENDPOINT = config.ENDPOINT; 

function placeBet(id, bet, pick) {
  console.log("ID", id, "Bet", bet, "pick", pick)
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
  // const [data, setData] = useState([]);
  // const [bet, setBet] = useState("");
  // const [pick, setPick] = useState(false);
  // const [showResults, setShowResults] = useState(false);
  // const [haveResults, setHaveResults] = useState(false);
  // const [result, setResult] = useState({});
  // const [timerDone, setTimerDone] = useState(false);
  const [data, setData] = useState([]);
  const [bet, setBet] = useState({});
  const [pick, setPick] = useState({});
  const [showResults, setShowResults] = useState({});
  const [haveResults, setHaveResults] = useState({});
  const [result, setResult] = useState({});
  const [timerDone, setTimerDone] = useState({});

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    
    socket.on("games_updated", (games) => {
      setData(games);
      console.log("games_updated: ", games)
      
    });

    socket.on("results_updated", (results) => {
      console.log("RESULT:", results)
      const r = Object.entries(results[0])[0];
      const id = r[0];
      const [isWin, winAmount] = r[1];
      console.log({ id: id, isWin: isWin, winAmount: winAmount })
      setResult(prevResult => ({...prevResult, [id]  : {isWin: isWin, winAmount: winAmount }}));
      setHaveResults(prevHaveResults => ({...prevHaveResults, [id]: true}));
      setShowResults(prevShowResults => ({...prevShowResults, [id]: false}));
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

  const handleInputChange = (e, id) => {
    const value = e.target.value;
    // console.log("Input Value:", value)
    if (!isNaN(value) && value !== ""){
      setBet(prevBet => ({...prevBet, [id] : value}));
    }
    else {
      setBet(prevBet => ({...prevBet, [id] : ""}));
    }
  }

  const checkTimerValue = (value, id) => {
    value = Number(value)
    if(value === 0) {
      setTimerDone(prevTimerDone => ({...prevTimerDone, [id] : true}));
    } else {
      setTimerDone(prevTimerDone => ({...prevTimerDone, [id] : false}));
    }
  }

  const TIME_STYLE = {
    fontSize: "225%",
    marginBottom: "5%",
  }
  

  return (
    <>
    <div className='game-parent-layout'>
      {data.map((games, index) => (
          <div key={index} className='game-layout'> 
            {Object.entries(games).map(([id, time])=> (
            <div key={id} className='game-card'>
                 <h1 className='game-title'>COIN FLIP</h1>
                 {/* POTENTIAL TO MAKE THE TIME A TIMER COUNTDOWN */}
                 <CountdownTimer time={time} TIME_STYLE={TIME_STYLE} checkTimerValue={checkTimerValue} id={id}/>
                 <div className='game-pick-selection'>
                   <button
                  onClick={() => setPick(prevPick => ({...prevPick, [id] : 'HEAD'}))}
                  style = {{
                    backgroundColor: pick[id] === 'HEAD' ? 'black' : 'aliceblue',
                    color: pick[id] === 'HEAD' ? 'aliceblue' : 'black'
                  }} 
                  className='game-pick-button'
                >
                  HEAD
                </button>
                <button 
                  onClick={() => setPick(prevPick => ({...prevPick, [id] : 'TAIL'}))}
                  style = {{
                    backgroundColor: pick[id] === 'TAIL' ? 'black' : 'aliceblue',
                    color: pick[id] === 'TAIL' ? 'aliceblue' : 'black'
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
                value={bet[id] ?? ''}
                onChange={(e) => handleInputChange(e, id)}
              />
              <button className="game-bet-button" onClick={() => placeBet(id, bet[id], pick[id])} disabled={!(pick[id]) || bet[id] === "" || timerDone[id]}>BET</button>
              <button className="game-flip-button" onClick={() => setShowResults(prevShowResults => ({...prevShowResults, [id] : true}))} disabled={!haveResults[id]}> FLIP </button>
              { showResults[id] && (
                <ResultModal 
                  open={showResults[id]} 
                  onClose={() => setShowResults(prevState => ({...prevState, [id]: false}))} 
                  bet={bet[id]} 
                  pick={pick[id]} 
                  result={calcResult(result[id].isWin, pick[id])} 
                  winAmount={result[id].winAmount}
                />
              )}
          </div>
          ))}
          </div>
      ))}
    </div>

    {/* { showResults && (<ResultModal open={showResults} onClose={() => setShowResults(false)} bet={bet} pick={pick} result={calcResult(result.isWin, pick)} winAmount={result.winAmount}/>)} */}
    
    </>
  );
}

export default Games