
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';


import Layout from './components/Layout';


import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import About from './pages/About';

import Dashboard from './pages/dashboard';
import CourseDetailsPage from './pages/CourseDetailsPage';




function App() {
  return (
    <Router>
      <AuthProvider>  {/*Many authentication-related components (like protected routes dasboard) need access to both routing and authentication context */}
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="courses" element={<Courses />} />
           
            <Route path="about" element={<About />} />
            <Route path="/courses/:id" element={<CourseDetailsPage />} />
          
            <Route path="dashboard" element={<Dashboard />} />
      
            
            {/* 404  Not Found error*/}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
                  <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
                  <p className="text-gray-600 mb-8">The page you are looking for might have been removed or is temporarily unavailable.</p>
                  <a href="/" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md">
                    Back to Home
                  </a>
                </div>
              </div>
            } />


          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;