import React, { useState } from 'react';

const ReportTypes = {
  USER_ACTIVITY: 'user-activity',
  QUIZ_PERFORMANCE: 'quiz-performance',
  COMPETENCY_ANALYSIS: 'competency-analysis',
  CERTIFICATE_ISSUED: 'certificate-issued',
};

const Reports: React.FC = () => {
  const [activeReport, setActiveReport] = useState(ReportTypes.USER_ACTIVITY);
  const [dateRange, setDateRange] = useState('last-30-days');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Reports & Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium mb-4">Report Types</h2>
          
          <nav className="space-y-2">
            <button
              className={`w-full text-left px-3 py-2 rounded-md ${
                activeReport === ReportTypes.USER_ACTIVITY 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveReport(ReportTypes.USER_ACTIVITY)}
            >
              User Activity
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded-md ${
                activeReport === ReportTypes.QUIZ_PERFORMANCE 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveReport(ReportTypes.QUIZ_PERFORMANCE)}
            >
              Quiz Performance
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded-md ${
                activeReport === ReportTypes.COMPETENCY_ANALYSIS 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveReport(ReportTypes.COMPETENCY_ANALYSIS)}
            >
              Competency Analysis
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded-md ${
                activeReport === ReportTypes.CERTIFICATE_ISSUED 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveReport(ReportTypes.CERTIFICATE_ISSUED)}
            >
              Certificates Issued
            </button>
          </nav>

          <div className="mt-6">
            <h2 className="text-lg font-medium mb-4">Filters</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="last-7-days">Last 7 Days</option>
                  <option value="last-30-days">Last 30 Days</option>
                  <option value="this-month">This Month</option>
                  <option value="last-month">Last Month</option>
                  <option value="this-year">This Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              
              {activeReport === ReportTypes.QUIZ_PERFORMANCE && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quiz
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Quizzes</option>
                    <option value="quiz1">JavaScript Basics</option>
                    <option value="quiz2">React Fundamentals</option>
                    <option value="quiz3">Advanced CSS</option>
                  </select>
                </div>
              )}
              
              {activeReport === ReportTypes.COMPETENCY_ANALYSIS && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Competency
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Competencies</option>
                    <option value="comp1">JavaScript</option>
                    <option value="comp2">React</option>
                    <option value="comp3">CSS</option>
                    <option value="comp4">Node.js</option>
                  </select>
                </div>
              )}
              
              <button
                onClick={handleGenerateReport}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              >
                {isLoading ? 'Generating...' : 'Generate Report'}
              </button>
              
              <button
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Export to CSV
              </button>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-3 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium mb-4">
            {activeReport === ReportTypes.USER_ACTIVITY && 'User Activity Report'}
            {activeReport === ReportTypes.QUIZ_PERFORMANCE && 'Quiz Performance Report'}
            {activeReport === ReportTypes.COMPETENCY_ANALYSIS && 'Competency Analysis Report'}
            {activeReport === ReportTypes.CERTIFICATE_ISSUED && 'Certificates Issued Report'}
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-80">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div>
              {activeReport === ReportTypes.USER_ACTIVITY && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-blue-800">Total Users</h3>
                      <p className="text-3xl font-bold mt-2">256</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-green-800">Active Users (30d)</h3>
                      <p className="text-3xl font-bold mt-2">178</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-purple-800">New Users (30d)</h3>
                      <p className="text-3xl font-bold mt-2">42</p>
                    </div>
                  </div>
                  
                  <div className="h-80 border border-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">User activity chart would appear here</p>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium mb-2">Recent User Activity</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">John Doe</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Completed JavaScript Quiz</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 hours ago</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Jane Smith</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Started React Quiz</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3 hours ago</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Michael Johnson</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Registered account</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5 hours ago</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {activeReport === ReportTypes.QUIZ_PERFORMANCE && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-blue-800">Total Attempts</h3>
                      <p className="text-3xl font-bold mt-2">342</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-green-800">Avg. Score</h3>
                      <p className="text-3xl font-bold mt-2">78%</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-purple-800">Pass Rate</h3>
                      <p className="text-3xl font-bold mt-2">68%</p>
                    </div>
                  </div>
                  
                  <div className="h-80 border border-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Quiz performance chart would appear here</p>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium mb-2">Performance by Quiz</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attempts</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Score</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pass Rate</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">JavaScript Basics</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">156</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">82%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">75%</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">React Fundamentals</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">98</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">75%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">62%</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Advanced CSS</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">88</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">71%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">58%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {activeReport === ReportTypes.COMPETENCY_ANALYSIS && (
                <div className="space-y-6">
                  <div className="h-80 border border-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Competency distribution chart would appear here</p>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium mb-2">Competency Breakdown</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Competency</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Beginner</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intermediate</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Advanced</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expert</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">JavaScript</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">42</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">67</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">38</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">React</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">55</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">35</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">22</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">CSS</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">38</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">52</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">29</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Node.js</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">62</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">28</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {activeReport === ReportTypes.CERTIFICATE_ISSUED && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-blue-800">Total Certificates</h3>
                      <p className="text-3xl font-bold mt-2">187</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-green-800">This Month</h3>
                      <p className="text-3xl font-bold mt-2">32</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-purple-800">Advanced Level+</h3>
                      <p className="text-3xl font-bold mt-2">76</p>
                    </div>
                  </div>
                  
                  <div className="h-80 border border-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Certificate issuance trend chart would appear here</p>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium mb-2">Recent Certificates</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">John Doe</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">JavaScript Basics</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Advanced</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">May 15, 2023</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">View</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Jane Smith</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">React Fundamentals</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Intermediate</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">May 12, 2023</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">View</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Michael Johnson</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Advanced CSS</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Expert</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">May 10, 2023</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">View</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
