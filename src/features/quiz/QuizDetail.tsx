import React from 'react';
import { useAppSelector } from '../../hooks';

const QuizDetails: React.FC = () => {
  const quizState = useAppSelector((state) => state.quiz);

  if (!quizState.currentQuizId) return <p>No quiz started yet.</p>;

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h3 className="text-lg font-semibold mb-2">Quiz Details</h3>
      <p>
        <strong>Quiz ID:</strong> {quizState.currentQuizId}
      </p>
      <p>
        <strong>Score:</strong> {quizState.score !== null ? `${quizState.score}%` : 'In progress'}
      </p>
      <p>
        <strong>Certification Level:</strong>{' '}
        {quizState.certificationLevel || 'Not yet certified'}
      </p>
      <p>
        <strong>Answers submitted:</strong> {Object.keys(quizState.answers).length}
      </p>
    </div>
  );
};

export default QuizDetails;
