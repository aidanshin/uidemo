import React, { useState, useEffect } from 'react'
import ReactDom from 'react-dom'
import './ResultModal.css'

const resultMessage = (winAmount, bet) => {
    winAmount = Number(winAmount);
    if(winAmount === 0) {
        return `YOU LOST: ${bet}`
    } else {
        return `YOU WIN: ${winAmount}`
    }
}

export default function ResultModal({open, onClose, pick, bet, result, winAmount}) {
  const [showResultMessage, setShowResultMessage] = useState(false);
  
  useEffect(() => {
    if(result !== '') {
        setTimeout(() => {
            setShowResultMessage(true);
        }, 5000);
    }
  }, [result]);

  if (!open) return null;

  return ReactDom.createPortal(
    <>
        <div className="overlay-layout" />
        <div className="modal-layout">
            <div className='modal-header'>
                <div className='modal-header-title'>COIN FLIP</div> 
                <hr className='modal-hr'></hr>
                {/* <div className='modal-header-exit'><button className="modal-header-exit-button" onClick={onClose}>EXIT</button></div>  */}
            </div>

            
            <div className="modal-coinresult">
                <div className={`modal-coin ${result}`}>
                    <div className='modal-coin-head'>HEAD</div>
                    <div className='modal-coin-tail'>TAIL</div>
                </div>
                {showResultMessage && 
                (<div className='result-display'>
                    {resultMessage(winAmount, bet)}
                    <button className="modal-header-exit-button" onClick={onClose}>EXIT</button>
                </div>)}
            </div>

            

            <div className='modal-userinfo'>
                <div className='modal-userinfo-data'>BET: {bet}</div>
                <div className='modal-userinfo-data'>PICK: {pick}</div>
            </div>

            
        </div>
    </>,
    document.getElementById('portal')
  )
}
