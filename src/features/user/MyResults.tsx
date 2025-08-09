import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks';
import { Link } from 'react-router-dom';

interface TestResult {
  _id: string;
  quizId: string;
  quizName: string;
  step: number;
  score: number;
  levelAwarded: string;
  date: string;
  certificateUrl?: string;
}

const MyResults: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAppSelector((state) => state.auth.user);
  
  // Mock data for demonstration - replace with actual API call
  useEffect(() => {
    // Simulating API fetch
    setTimeout(() => {
      const mockResults: TestResult[] = [
        {
          _id: '1',
          quizId: 'quiz1',
          quizName: 'JavaScript Fundamentals',
          step: 1,
          score: 85,
          levelAwarded: 'Intermediate',
          date: '2025-08-05T10:30:00Z',
          certificateUrl: '/certificates/js-cert.pdf'
        },
        {
          _id: '2',
          quizId: 'quiz1',
          quizName: 'JavaScript Fundamentals',
          step: 2,
          score: 92,
          levelAwarded: 'Advanced',
          date: '2025-08-06T14:45:00Z',
          certificateUrl: '/certificates/js-adv-cert.pdf'
        },
        {
          _id: '3',
          quizId: 'quiz2',
          quizName: 'React Basics',
          step: 1,
          score: 78,
          levelAwarded: 'Intermediate',
          date: '2025-08-07T09:15:00Z'
        }
      ];
      
      setResults(mockResults);
      setLoading(false);
    }, 1000);
    
    // Real implementation would look like:
    /*
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/user/results', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }
        
        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(err.message || 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
    */
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Test Results</h1>
      
      {results.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-center">
          <p className="text-yellow-800">You haven't taken any tests yet.</p>
          <Link to="/" className="inline-block mt-2 text-blue-600 hover:underline">
            Find a test to take
          </Link>
        </div>
      ) : (
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
                <tr key={result._id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{result.quizName}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{result.step}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{result.score}%</td>
                  <td className="py-4 px-4 text-sm">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        result.levelAwarded === 'Advanced' ? 'bg-green-100 text-green-800' :
                        result.levelAwarded === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                        result.levelAwarded === 'Beginner' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {result.levelAwarded}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">{formatDate(result.date)}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    {result.certificateUrl ? (
                      <a 
                        href={result.certificateUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                        </svg>
                        View
                      </a>
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
      
      {/* Quick Stats Section */}
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
                const levels = ['Fail', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
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
