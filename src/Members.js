import React, { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";
import "./Members.css"
import config from './config';

const ENDPOINT = config.ENDPOINT; 

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    // socket.on("connect", () => {
    //   console.log("Connected to server");
    // });
    // socket.on("disconnect", () => {
    //   console.log("Disconnected from server");
    // });
    socket.on("members_updated", (members) => {
      setData(members);
      console.log(members);
    });

    fetchMembers();

    return () => socket.disconnect();
  }, []);

  const fetchMembers = () => {
    fetch('/members')
      .then(res => res.json())
      .then(data => {
        setData(data.members);
        console.log(data.members)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  return (
    <div className="users">
      <h1 className='user-title'>ONLINE</h1>
      <hr className ='user-hr'></hr>
      <div className="members">
      {data.map((members, index) => (
        <div key={index}>
          {Object.entries(members).map(([ip, port]) => (
        <div key={ip}>
          IP: {ip}, Port: {port}
        </div>
      ))}
  </div>
))}
      </div>
    </div>
  );
}

export default App;
