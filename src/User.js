import React, { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";
import './User.css'
import config from './config';

const ENDPOINT = config.ENDPOINT; 

const User = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("user_updated", (user) => {
      setData(user);
      console.log(user)
    });

    fetchUser();

    return () => socket.disconnect();
  }, []);

  const fetchUser = () => {
    fetch('/user')
      .then(res => res.json())
      .then(data => {
        setData(data.user);
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  return (
    <div className="user-layout">
      <h1 className='mainuser-title'>User</h1>
      <hr className='mainuser-hr'></hr>
      <div>
        {data.map((user, index) => (
            <div className="mainuser-info" key={index}>
                <div> BALANCE: {user.balance}</div>
            </div>
    ))}
      </div>
    </div>
  );
}

export default User