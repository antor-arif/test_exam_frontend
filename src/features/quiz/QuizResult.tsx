import React from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/index';
import { resetQuiz } from './quizSlice';
import { useNavigate, useParams } from 'react-router-dom';

const QuizResult: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const score = useAppSelector((state) => state.quiz.score);
  const certificationLevel = useAppSelector((state) => state.quiz.certificationLevel);

  const handleRestart = () => {
    dispatch(resetQuiz());
    navigate('/');
  };

  if (score === null || !certificationLevel) {
    return <p className="text-center mt-10">No results found.</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow-md text-center">
      <h2 className="text-3xl font-bold mb-4">Quiz Completed</h2>
      <p className="text-xl mb-2">Score: {score}%</p>
      <p className="text-xl mb-6">Certification Level: <strong>{certificationLevel}</strong></p>

      <button
        onClick={handleRestart}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Back to Quiz List
      </button>
    </div>
  );
};

export default QuizResult;
