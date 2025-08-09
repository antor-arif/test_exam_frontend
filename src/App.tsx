import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Header from './components/Header';
import { hasValidToken, clearAuthData } from './utils/authUtils';
import { clearCredentials } from './features/auth/authSlice';

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!hasValidToken()) {
      clearAuthData();
      dispatch(clearCredentials());
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <AppRoutes />
        </main>
      </div>
    </Router>
  );
};

export default App;
