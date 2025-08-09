import React, { useEffect } from 'react';
import { useGetQuizQuestionsByStepQuery } from '../../api/quizApi';
import { useAppDispatch } from '../../hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { setQuizQuestions, setCurrentQuizId, setCurrentStep } from './quizSlice';

const QuizStart: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { data: questions, isLoading: loadingQuestions, error: questionsError } = 
    useGetQuizQuestionsByStepQuery({ quizId: quizId!, step: 1 }, { skip: !quizId });

  useEffect(() => {
    if (quizId) {
      dispatch(setCurrentQuizId(quizId));
    } else {
      navigate('/');
    }
  }, [quizId, navigate, dispatch]);


  useEffect(() => {
    if (questions && questions?.questions?.length > 0) {
      dispatch(setQuizQuestions(questions?.questions));
      dispatch(setCurrentStep(1));
      navigate(`/quiz/${quizId}/step/1`);
    }
  }, [questions, dispatch, navigate, quizId]);

  const isLoading = loadingQuestions;
  const error = questionsError;

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow-md text-center">
      {isLoading && (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mb-4"></div>
          <p className="text-lg">
            Loading questions for Step 1...
          </p>
        </div>
      )}
      {error && (
        <div className="text-red-600">
          <p className="text-xl mb-2">Error</p>
          <p>{(error as any)?.data?.message || 'Failed to initialize quiz'}</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizStart;
