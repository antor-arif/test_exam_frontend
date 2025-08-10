import React, { useState } from 'react';
import { useAppSelector } from '../../hooks';
import { Link } from 'react-router-dom';
import { useGetUserResultsQuery } from '../../api/userApi';

const MyResults: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  
  const user = useAppSelector((state) => state.auth.user);
  
  const { 
    data: resultsData, 
    isLoading, 
    error: resultsError,
    isFetching
  } = useGetUserResultsQuery({
    page: currentPage,
    limit: 10,
    quizId: selectedQuizId || undefined,
    level: selectedLevel || undefined
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleQuizFilter = (quizId: string | null) => {
    setSelectedQuizId(quizId);
    setCurrentPage(1);
  };
  
  const handleLevelFilter = (level: string | null) => {
    setSelectedLevel(level);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (resultsError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        Error: Unable to fetch results
      </div>
    );
  }

  const results = resultsData?.data || [];
  const meta = resultsData?.meta || { totalPages: 1 };
  
  if (results.length === 0 && !isFetching) {
    return (
      <div className="max-w-6xl mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold mb-6">My Test Results</h1>
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-center">
          <p className="text-yellow-800">You haven't taken any tests yet.</p>
          <Link to="/" className="inline-block mt-2 text-blue-600 hover:underline">
            Find a test to take
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Test Results</h1>
      
      {results.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Test Name</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Step</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Score</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Level Awarded</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Date</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {results.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">
                    {result.quiz?.name || 'Unknown Quiz'}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">{result.step}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{result.score}%</td>
                  <td className="py-4 px-4 text-sm">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        result.levelAwarded === 'Expert' ? 'bg-purple-100 text-purple-800' :
                        result.levelAwarded === 'Advanced' ? 'bg-green-100 text-green-800' :
                        result.levelAwarded === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                        result.levelAwarded === 'Basic' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {result.levelAwarded}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">{formatDate(result.date)}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    {result.hasCertificate ? (
                      <Link 
                        to={`/certificates/${result.certificateId}/view`}
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                        </svg>
                        View
                      </Link>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {meta.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isFetching}
              className="px-3 py-1 rounded-l border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Previous
            </button>
            
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={isFetching}
                className={`px-3 py-1 border-t border-b border-gray-300 ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === meta.totalPages || isFetching}
              className="px-3 py-1 rounded-r border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
            >
              Next
            </button>
          </nav>
        </div>
      )}
      
      {results.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Average Score</h3>
            <p className="text-3xl font-bold text-blue-600">
              {Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)}%
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Tests Completed</h3>
            <p className="text-3xl font-bold text-blue-600">
              {results.length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Highest Level</h3>
            <p className="text-3xl font-bold text-blue-600">
              {results.reduce((highest, r) => {
                const levels = ['Fail', 'Basic', 'Intermediate', 'Advanced', 'Expert'];
                const currentIndex = levels.indexOf(r.levelAwarded);
                const highestIndex = levels.indexOf(highest);
                return currentIndex > highestIndex ? r.levelAwarded : highest;
              }, 'Fail')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyResults;
