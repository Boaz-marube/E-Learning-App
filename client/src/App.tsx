import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MyCourses from './pages/MyCourses';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import LessonPlayer from './pages/LessonPlayer';
import Notifications from './pages/Notifications';
import CreateCourse from './pages/CreateCourse';
import Quizzes from './pages/Quizzes';
import ManageQuizzes from './pages/ManageQuizzes';
import CreateQuiz from './pages/CreateQuiz';
import QuizTaker from './pages/QuizTaker';
import EditQuiz from './pages/EditQuiz';
import EditCourse from './pages/EditCourse';
import ForgotPassword from './pages/ForgotPassword';
import VerifyCode from './pages/VerifyCode';
import About from './pages/About';
import Contact from './pages/Contact';
import Search from './pages/Search';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-code" element={<VerifyCode />} />
                   <Route path="/about" element={<About />} />
                   <Route path="/contact" element={<Contact />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-courses" 
                element={
                  <ProtectedRoute>
                    <MyCourses />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/courses" 
                element={<Courses />} 
              />
              <Route 
                path="/search" 
                element={<Search />} 
              />
              <Route 
                path="/courses/:id" 
                element={<CourseDetail />} 
              />
              <Route 
                path="/courses/:id/lessons/:lessonId" 
                element={
                  <ProtectedRoute>
                    <LessonPlayer />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/notifications" 
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/create-course" 
                element={
                  <ProtectedRoute>
                    <CreateCourse />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/quizzes" 
                element={
                  <ProtectedRoute>
                    <Quizzes />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/instructor/quizzes" 
                element={
                  <ProtectedRoute>
                    <ManageQuizzes />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/instructor/create-quiz" 
                element={
                  <ProtectedRoute>
                    <CreateQuiz />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/quiz/:id" 
                element={
                  <ProtectedRoute>
                    <QuizTaker />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/instructor/edit-quiz/:id" 
                element={
                  <ProtectedRoute>
                    <EditQuiz />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/edit-course/:id" 
                element={
                  <ProtectedRoute>
                    <EditCourse />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
