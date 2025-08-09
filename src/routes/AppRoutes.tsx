import React, { JSX } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../features/auth/Login';
import QuizList from '../features/quiz/QuizList';
import { useAppSelector } from '../hooks/index';
import QuizStart from '../features/quiz/QuizStart';
import QuizStep from '../features/quiz/QuizStep';
import QuizResult from '../features/quiz/QuizResult';
import Register from '../features/auth/Register';
import ForgotPassword from '../features/auth/ForgotPassword';
import ResetPassword from '../features/auth/ResetPassword';
import RoleProtectedRoute from '../components/RoleProtectedRoute';
import VerifyOTP from '../features/auth/VerifyOTP';
import Profile from '../features/user/Profile';
import MyResults from '../features/user/MyResults';
import Certificates from '../features/user/Certificates';
import PublicRoute from '../components/PublicRoute';

// Admin components
import AdminDashboard from '../features/admin/Dashboard';
import QuizManagement from '../features/admin/QuizManagement';
import QuizForm from '../features/admin/QuizForm';
import QuestionManagement from '../features/admin/QuestionManagement';
import QuestionForm from '../features/admin/QuestionForm';
import UserManagement from '../features/admin/UserManagement';
import Reports from '../features/admin/Reports';

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const isAuth = useAppSelector((state) => state.auth.isAuthenticated);
  return isAuth ? children : <Navigate to="/login" replace />;
};


const Home: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  return <QuizList />;
};


const AppRoutes: React.FC = () => {
  return (
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
         <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path="/forgot-password" element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } />
        <Route path="/reset-password" element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        } />
        <Route path="/verify-otp" element={
          <PublicRoute>
            <VerifyOTP />
          </PublicRoute>
        } />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/quiz/:quizId/start"
          element={
            <PrivateRoute>
              <QuizStart />
            </PrivateRoute>
          }
        />
        <Route
          path="/quiz/:quizId/step/:step"
          element={
            <PrivateRoute>
              <QuizStep />
            </PrivateRoute>
          }
        />
        <Route
          path="/quiz/:quizId/result"
          element={
            <PrivateRoute>
              <QuizResult />
            </PrivateRoute>
          }
        />
        
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleProtectedRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/quizzes"
          element={
            <PrivateRoute>
              <RoleProtectedRoute allowedRoles={['admin']}>
                <QuizManagement />
              </RoleProtectedRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/quizzes/new"
          element={
            <PrivateRoute>
              <RoleProtectedRoute allowedRoles={['admin']}>
                <QuizForm />
              </RoleProtectedRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/quizzes/:id/edit"
          element={
            <PrivateRoute>
              <RoleProtectedRoute allowedRoles={['admin']}>
                <QuizForm />
              </RoleProtectedRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/quizzes/:quizId/questions"
          element={
            <PrivateRoute>
              <RoleProtectedRoute allowedRoles={['admin']}>
                <QuestionManagement />
              </RoleProtectedRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/quizzes/:quizId/questions/new"
          element={
            <PrivateRoute>
              <RoleProtectedRoute allowedRoles={['admin']}>
                <QuestionForm />
              </RoleProtectedRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/quizzes/:quizId/questions/:questionId/edit"
          element={
            <PrivateRoute>
              <RoleProtectedRoute allowedRoles={['admin']}>
                <QuestionForm />
              </RoleProtectedRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute>
              <RoleProtectedRoute allowedRoles={['admin']}>
                <UserManagement />
              </RoleProtectedRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <PrivateRoute>
              <RoleProtectedRoute allowedRoles={['admin']}>
                <Reports />
              </RoleProtectedRoute>
            </PrivateRoute>
          }
        />
        <Route
        path="/profile"
        element={
            <PrivateRoute>
            <Profile />
            </PrivateRoute>
        }
        />
        <Route
        path="/my-results"
        element={
            <PrivateRoute>
            <RoleProtectedRoute allowedRoles={['student']}>
                <MyResults />
            </RoleProtectedRoute>
            </PrivateRoute>
        }
        />
        <Route
        path="/certificates"
        element={
            <PrivateRoute>
            <RoleProtectedRoute allowedRoles={['student']}>
                <Certificates />
            </RoleProtectedRoute>
            </PrivateRoute>
        }
        />
        <Route
        path="/completed-tests"
        element={
            <PrivateRoute>
            <RoleProtectedRoute allowedRoles={['student']}>
                <MyResults />
            </RoleProtectedRoute>
            </PrivateRoute>
        }
        />
        <Route
        path="/performance"
        element={
            <PrivateRoute>
            <RoleProtectedRoute allowedRoles={['student']}>
                <MyResults />
            </RoleProtectedRoute>
            </PrivateRoute>
        }
        />
      </Routes>
  );
};

export default AppRoutes;
