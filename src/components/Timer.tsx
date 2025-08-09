import React, { useEffect, useState } from 'react';

interface TimerProps {
  minutes: number;
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ minutes, onTimeUp }) => {
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
  const totalSeconds = minutes * 60;

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUp();
      return;
    }
    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [secondsLeft, onTimeUp]);

  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  
 
  const percentLeft = (secondsLeft / totalSeconds) * 100;
  

  let timerColor = 'text-green-600';
  if (percentLeft < 50) timerColor = 'text-yellow-600';
  if (percentLeft < 25) timerColor = 'text-orange-600';
  if (percentLeft < 10) timerColor = 'text-red-600';

  return (
    <div className="flex flex-col items-center">
      <div className={`text-lg font-mono font-semibold ${timerColor}`}>
        Time Left: {m.toString().padStart(2, '0')}:{s.toString().padStart(2, '0')}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
        <div 
          className={`h-2.5 rounded-full ${
            percentLeft < 10 ? 'bg-red-600' : 
            percentLeft < 25 ? 'bg-orange-500' : 
            percentLeft < 50 ? 'bg-yellow-500' : 
            'bg-green-600'
          }`}
          style={{ width: `${percentLeft}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Timer;
