import React, {useState} from 'react'
import './App.css'
import Members from './Members'
import Games from './Games'
import User from './User'

function App() {
  // const width = window.innerWidth;
  // const height = window.innerHeight;
  // const [updateBalance, setUpdateBalance] = useState(true)


  return (
    <div className='App'>
      <div className='title'>
        BLOCK-CHAIN-BOOKIE
      </div>
      <div className='screen'>
        <div className='left-item'>
          {/* this will contain the flex box for the user in the connection */}
          <Members/>
        </div>
        <div className='middle-item'>
          <Games/>
        </div>
        <div className='right-item'>
          <User/>
        </div>
      </div>
    </div>
  )
}

export default App