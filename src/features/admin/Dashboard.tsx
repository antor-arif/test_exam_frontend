import React from 'react';
import { Link } from 'react-router-dom';
import { useGetQuizzesQuery } from '../../api/quizApi';
import { useGetUsersQuery } from '../../api/userApi';

const AdminDashboard = () => {
  const { data: quizData } = useGetQuizzesQuery({ page: 1, limit: 5 });
  const { data: userData } = useGetUsersQuery({ page: 1, limit: 5 });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Quizzes Overview</h2>
            <Link to="/admin/quizzes" className="text-blue-600 hover:underline">
              View All
            </Link>
          </div>
          
          {quizData ? (
            <>
              <p className="text-gray-600 mb-4">Total Quizzes: {quizData.totalCount}</p>
              <div className="space-y-2">
                <h3 className="font-medium">Recent Quizzes:</h3>
                <ul className="divide-y divide-gray-200">
                  {quizData.quizzes.map(quiz => (
                    <li key={quiz._id} className="py-2">
                      <Link to={`/admin/quizzes/${quiz._id}`} className="hover:text-blue-600">
                        {quiz.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p>Loading quiz data...</p>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Users Overview</h2>
            <Link to="/admin/users" className="text-blue-600 hover:underline">
              View All
            </Link>
          </div>
          
          {userData ? (
            <>
              <p className="text-gray-600 mb-4">Total Users: {userData.meta.totalCount || userData.meta.total || userData.data.length}</p>
              <div className="space-y-2">
                <h3 className="font-medium">Recent Users:</h3>
                <ul className="divide-y divide-gray-200">
                  {userData.data.map(user => (
                    <li key={user._id} className="py-2">
                      <Link to={`/admin/users/${user._id}`} className="hover:text-blue-600">
                        {user.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          to="/admin/quizzes/new" 
          className="bg-blue-600 text-white p-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors flex flex-col items-center justify-center"
        >
          <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span className="text-lg font-medium">Create New Quiz</span>
        </Link>
        
        {/* <Link 
          to="/admin/questions" 
          className="bg-green-600 text-white p-6 rounded-lg shadow-md hover:bg-green-700 transition-colors flex flex-col items-center justify-center"
        >
          <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span className="text-lg font-medium">Manage Questions</span>
        </Link> */}
        
        <Link 
          to="/admin/reports" 
          className="bg-purple-600 text-white p-6 rounded-lg shadow-md hover:bg-purple-700 transition-colors flex flex-col items-center justify-center"
        >
          <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          <span className="text-lg font-medium">View Reports</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;

