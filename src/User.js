import React, { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";
import './User.css'
import config from './config';

const ENDPOINT = config.ENDPOINT; 

const User = () => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("user_updated", (user) => {
      console.log(user)
      if (user && Array.isArray(user)) {
        const [bal] = user;
        setBalance(bal);
      }
    });

    fetchUser();

    return () => {
      socket.disconnect();
    };
  }, []);


  const fetchUser = () => {
    fetch('/user')
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if(data) {
          const [bal] = data.user
          setBalance(bal);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };


  return (
    <div className="user-layout">
      <h1 className='mainuser-title'>USER</h1>
      <hr className='mainuser-hr'></hr>
      <div className="mainuser-info">
          <div> BALANCE: {balance}</div>
      </div>
    </div>
  );
}

export default User;
