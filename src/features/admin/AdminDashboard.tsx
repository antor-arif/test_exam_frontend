import React, { useEffect, useState, useCallback } from 'react';
import { useGetUsersQuery, User, UserQueryParams } from '../../api/userApi';

const AdminDashboard: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loadingStates, setLoadingStates] = useState<{
    viewDetails: Record<string, boolean>;
    edit: Record<string, boolean>;
    delete: Record<string, boolean>;
    pagination: {
      first: boolean;
      prev: boolean;
      next: boolean;
      last: boolean;
    }
  }>({
    viewDetails: {},
    edit: {},
    delete: {},
    pagination: {
      first: false,
      prev: false,
      next: false,
      last: false
    }
  });
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    
    return () => {
      clearTimeout(handler);
    };
  }, [search]);
  
  const queryParams: UserQueryParams = {
    page,
    limit,
    search: debouncedSearch
  };
  
  const { data, error, isLoading } = useGetUsersQuery(queryParams);

  useEffect(() => {
    if (data?.data) {
      setUsers(data.data);
    }
  }, [data]);


  const totalPages = data?.meta?.totalPages || 1;
  const totalUsers = data?.meta?.total || 0;
  const hasNextPage = page < totalPages;
  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(startIndex + limit - 1, totalUsers);


  const setLoadingState = (type: 'viewDetails' | 'edit' | 'delete', id: string, value: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [id]: value
      }
    }));
  };
  
  const setPaginationLoadingState = (button: 'first' | 'prev' | 'next' | 'last', value: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        [button]: value
      }
    }));
  };


  const handleViewDetails = (userId: string) => {
    setLoadingState('viewDetails', userId, true);

    setTimeout(() => {
      setLoadingState('viewDetails', userId, false);
      alert(`View details for user: ${userId}`);
    }, 800);
  };
  
  const handleEdit = (userId: string) => {
    setLoadingState('edit', userId, true);

    setTimeout(() => {
      setLoadingState('edit', userId, false);
      alert(`Edit user: ${userId}`);
    }, 800);
  };
  
  const handleDelete = (userId: string) => {
    setLoadingState('delete', userId, true);
    setTimeout(() => {
      setLoadingState('delete', userId, false);
      alert(`Delete user: ${userId}`);
    }, 800);
  };
  
  const handlePageChange = (newPage: number) => {
    let paginationType: 'first' | 'prev' | 'next' | 'last';
    
    if (newPage === 1) paginationType = 'first';
    else if (newPage === totalPages) paginationType = 'last';
    else if (newPage < page) paginationType = 'prev';
    else paginationType = 'next';
    
    setPaginationLoadingState(paginationType, true);
    
    setTimeout(() => {
      setPage(newPage);
      setPaginationLoadingState(paginationType, false);
    }, 500);
  };
  
  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(event.target.value));
    setPage(1); 
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };
  
  const clearSearch = () => {
    setSearch('');
    setPage(1);
  };
  return (
    <div className="w-full max-w-6xl mx-auto mt-4 sm:mt-10 p-3 sm:p-6 bg-white rounded shadow-md">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Admin Dashboard - User Management</h1>
      
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="relative w-full sm:w-1/2">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={handleSearchChange}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {search && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <label htmlFor="limit" className="text-xs sm:text-sm font-medium">Items per page:</label>
          <select
            id="limit"
            value={limit}
            onChange={handleLimitChange}
            className="border rounded px-2 py-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {isLoading && <div className="text-center py-8">Loading users...</div>}
      {error && <div className="text-center py-8 text-red-600">Error loading users</div>}

      {!isLoading && !error && users && (
        <>
          {users.length > 0 ? (
            <>
              <div className="overflow-x-auto -mx-3 sm:mx-0">
                <table className="w-full table-auto border-collapse border border-gray-300 text-xs sm:text-sm md:text-base">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-2 sm:px-4 py-1 sm:py-2 text-left">Name</th>
                      <th className="border border-gray-300 px-2 sm:px-4 py-1 sm:py-2 text-left hidden sm:table-cell">Email</th>
                      <th className="border border-gray-300 px-2 sm:px-4 py-1 sm:py-2 text-left">Role</th>
                      <th className="border border-gray-300 px-2 sm:px-4 py-1 sm:py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 sm:px-4 py-1 sm:py-2">
                          <div>{user.name}</div>
                          <div className="text-xs text-gray-500 sm:hidden">{user.email}</div>
                        </td>
                        <td className="border border-gray-300 px-2 sm:px-4 py-1 sm:py-2 hidden sm:table-cell">{user.email}</td>
                        <td className="border border-gray-300 px-2 sm:px-4 py-1 sm:py-2">
                          <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-2xs sm:text-xs ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : user.role === 'teacher' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-1 sm:py-2">
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-center justify-center">
                            <button 
                              className="w-full sm:w-auto text-2xs sm:text-xs px-2 sm:px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              title="View user details"
                              onClick={() => handleViewDetails(user._id)}
                              disabled={loadingStates.viewDetails[user._id]}
                            >
                              {loadingStates.viewDetails[user._id] ? (
                                <span className="flex items-center justify-center">
                                  <svg className="animate-spin -ml-0.5 mr-1 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  <span className="sm:inline">Loading...</span>
                                </span>
                              ) : 'View'}
                            </button>
                            <button 
                              className="w-full sm:w-auto text-2xs sm:text-xs px-2 sm:px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Edit user details"
                              onClick={() => handleEdit(user._id)}
                              disabled={loadingStates.edit[user._id]}
                            >
                              {loadingStates.edit[user._id] ? (
                                <span className="flex items-center justify-center">
                                  <svg className="animate-spin -ml-0.5 mr-1 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  <span className="sm:inline">Loading...</span>
                                </span>
                              ) : 'Edit'}
                            </button>
                            <button 
                              className="w-full sm:w-auto text-2xs sm:text-xs px-2 sm:px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete user"
                              onClick={() => handleDelete(user._id)}
                              disabled={loadingStates.delete[user._id]}
                            >
                              {loadingStates.delete[user._id] ? (
                                <span className="flex items-center justify-center">
                                  <svg className="animate-spin -ml-0.5 mr-1 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  <span className="sm:inline">Loading...</span>
                                </span>
                              ) : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Info */}
              <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 text-center">
                Showing {startIndex} to {endIndex} of {totalUsers} users
              </div>
              
              {/* Pagination Controls */}
              <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 mt-3 sm:mt-6">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1 || loadingStates.pagination.prev}
                  className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${
                    page <= 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 transition'
                  } disabled:opacity-50`}
                  aria-label="Go to previous page"
                >
                  {loadingStates.pagination.prev ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-0.5 mr-1 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline">Loading...</span>
                    </span>
                  ) : (
                    <>Previous</>
                  )}
                </button>
                <div className="px-2 sm:px-3 py-1 bg-gray-100 rounded text-xs sm:text-sm whitespace-nowrap">
                  Page {page} of {totalPages}
                </div>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={!hasNextPage || loadingStates.pagination.next}
                  className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${
                    !hasNextPage ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 transition'
                  } disabled:opacity-50`}
                  aria-label="Go to next page"
                >
                  {loadingStates.pagination.next ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-0.5 mr-1 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline">Loading...</span>
                    </span>
                  ) : (
                    <>Next</>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-xl text-gray-500">No users found</p>
              {debouncedSearch && (
                <button 
                  onClick={clearSearch}
                  className="mt-3 text-blue-600 hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
