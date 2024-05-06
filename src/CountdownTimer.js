import React, { useState, useEffect } from 'react';

function CountdownTimer({time, TIME_STYLE, checkTimerValue}) {
  const [timeDiff, setTimeDiff] = useState(0);

  useEffect(() => {
    const endTime = new Date(time).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = endTime - now;
      setTimeDiff(Math.floor(difference / 1000));

      checkTimerValue(timeDiff)
      
      if (difference < 0) {
        clearInterval(timer);
        setTimeDiff(0);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [time, timeDiff, checkTimerValue]);

  const formatTime = (time) => {
    // const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60) + minutes * 60;

    return `[${seconds}]`;
  };

  return (
    <div style={TIME_STYLE}>
      {formatTime(timeDiff)}
    </div>
  );
}

export default CountdownTimer;
