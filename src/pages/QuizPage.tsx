import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setAnswer, setResult } from '../features/quiz/quizSlice';
import QuizTimer from '../features/quiz/QuizTimer';

const Quiz: React.FC = () => {
  const dispatch = useAppDispatch();
  const quizState = useAppSelector((state) => state.quiz);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const timerPerQuestion = 60; 

  useEffect(() => {
    setQuestions([
      {
        id: 'q1',
        question: 'What is 2 + 2?',
        options: ['2', '3', '4', '5'],
      },

    ]);
  }, []);

  if (questions.length === 0) return <p>Loading questions...</p>;

  const currentQ = questions[currentQuestionIndex];

  const handleAnswer = (answer: string) => {
    dispatch(setAnswer({ questionId: currentQ.id, answer }));
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
    } else {
      dispatch(setResult({ score: 80, certificationLevel: 'A2 Certified' }));
      alert('Quiz Completed!');
    }
  };

  const handleTimeUp = () => {
    handleAnswer('');
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <QuizTimer durationSeconds={timerPerQuestion} onTimeUp={handleTimeUp} />
      <h2 className="text-xl font-semibold mb-4">{currentQ.question}</h2>
      <div className="space-y-2">
        {currentQ.options.map((opt: string) => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            className="block w-full text-left p-2 border rounded hover:bg-blue-100"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;
