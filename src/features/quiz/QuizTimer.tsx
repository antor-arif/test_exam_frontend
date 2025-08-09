import React, { useEffect, useState } from 'react';

interface QuizTimerProps {
  durationSeconds: number;
  onTimeUp: () => void;
}

const QuizTimer: React.FC<QuizTimerProps> = ({ durationSeconds, onTimeUp }) => {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);

  useEffect(() => {
    setSecondsLeft(durationSeconds);
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [durationSeconds, onTimeUp]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="text-right font-mono text-lg text-red-600 font-bold">
      Time Left: {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
  );
};

export default QuizTimer;
