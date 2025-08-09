import React, { useEffect, useState } from 'react';
import { useGetQuizzesQuery, Quiz, QuizQueryParams, useGetUserQuizResultsQuery } from '../../api/quizApi';
import { useAppDispatch, useAppSelector } from '../../hooks/index';
import { setCurrentQuizId } from './quizSlice';
import { useNavigate } from 'react-router-dom';

const QuizList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [quizzesList, setQuizzesList] = useState<Quiz[]>([]);
  const [failedQuizzes, setFailedQuizzes] = useState<Set<string>>(new Set());
  
  const { data, error, isLoading } = useGetQuizzesQuery({
    page,
    limit: 6
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(state => state.auth.user);

  
  const { data: userQuizResults } = useGetUserQuizResultsQuery('all', {
    skip: !user || !user.id
  });

  useEffect(() => {
    if (data) {
      setQuizzesList(data.quizzes);
    }
  }, [data]);

  useEffect(() => {
    if (userQuizResults) {
      const failedIds = new Set<string>();
      userQuizResults?.data?.forEach((result: any) => {
        if (result.levelAwarded === "Fail") {
          failedIds.add(result?.quiz?.id);
        }
      });
      setFailedQuizzes(failedIds);
    }
  }, [userQuizResults]);

  const handleStartQuiz = (quizId: string) => {
    dispatch(setCurrentQuizId(quizId));
    navigate(`/quiz/${quizId}/start`);
  };

  const totalPages = data?.totalPages || 1;
  const hasNextPage = page < totalPages;
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isLoading) return <div className="text-center mt-10">Loading quizzes...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error loading quizzes</div>;

  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-10 px-3 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Available Tests</h1>
      
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
        {quizzesList && quizzesList.length > 0 ? (
          quizzesList.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
            >
              <div className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold mb-2">{quiz?.name}</h2>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                  {quiz?.description || 'No description available'}
                </p>
                <div className="flex flex-wrap gap-y-2 justify-between items-center">
                  <span className="text-xs sm:text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded">
                    {quiz?.totalQuestions} questions
                  </span>
                  <span className="text-xs sm:text-sm bg-green-600 text-white py-1 px-2 rounded">
                    {quiz?.niche}
                  </span>
                  {failedQuizzes.has(quiz._id) ? (
                    <div className="w-full mt-2">
                      <div className="bg-red-100 text-red-800 text-xs sm:text-sm py-2 px-3 rounded">
                        You have previously failed this quiz and cannot retake it.
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartQuiz(quiz._id)}
                      className="w-full sm:w-auto mt-2 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition text-center"
                    >
                      Start Test
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-10">
            <p className="text-xl text-gray-500">No quizzes available</p>
          </div>
        )}
      </div>

      {quizzesList.length > 0 && (
        <div className="flex flex-wrap justify-center items-center gap-2 mt-8 sm:mt-10">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded ${
              page === 1
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            aria-label="Previous page"
          >
            Previous
          </button>
          <span className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={!hasNextPage}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded ${
              !hasNextPage
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizList;
