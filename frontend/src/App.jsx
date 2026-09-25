import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import NavBar from './components/NavBar';
import RequireAuth from './components/RequireAuth';
import LandingPage from './pages/LandingPage';
import ProfilePage from './pages/ProfilePage';
import Dashboard from './pages/Dashboard';
import SignUp from './pages/SignUp';
import LoginPage from './pages/LoginPage';
import CourseCatalog from './pages/CourseCatalog';
import ErrorPage from './pages/ErrorPage';
import CoursePage from './pages/CoursePage';
import LessonPage from './pages/LessonPage';
import './App.css';

export function AppRoutes() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/courses' element={<CourseCatalog />} />
        <Route
          path='/courses/:courseId/lessons/:lessonId'
          element={
            <RequireAuth allowedRole='learner'>
              <LessonPage />
            </RequireAuth>
          }
        />
        <Route path='/courses/:courseId' element={<CoursePage />} />
        <Route
          path='/dashboard'
          element={
            <RequireAuth allowedRole='learner'>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path='/coursecatalog'
          element={<Navigate to='/courses' replace />}
        />
        <Route path='/modules' element={<Navigate to='/courses' replace />} />
        <Route
          path='/modules/:moduleId/course/:courseId'
          element={<Navigate to='/courses' replace />}
        />
        <Route
          path='/modules/:moduleId'
          element={<Navigate to='/courses' replace />}
        />
        <Route path='/errorpage' element={<ErrorPage />} />
        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
