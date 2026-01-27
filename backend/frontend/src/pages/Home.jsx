import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseService from '../services/CourseService';

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    let active = true;
  
    const fetchFeaturedCourses = async () => {
      setLoading(true);
      try {
        const courses = await CourseService.getAllCourses(); 
        if (active) setFeaturedCourses((courses || []).slice(0, 3));
      } catch (error) {
        if (active) setError('Failed to fetch courses');
        console.error('Error fetching courses:', error);
      } finally {
        if (active) setLoading(false);
      }
    };
  
    fetchFeaturedCourses();
    return () => { active = false; }; 
  }, []);
  

  return (
    <div>
     
      <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Unlock Your Potential with Learn</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Access high-quality courses taught by industry experts and transform your career today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/courses"
                className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50"
              >
                Browse Courses
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-transparent border-2 border-white px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-700"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Courses</h2>
          
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Loading courses...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500">{error}</p>
              <p className="mt-2 text-gray-600">Please try again later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.length > 0 ? (
                featuredCourses.map((course) => (
                  <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="h-48 bg-indigo-100 flex items-center justify-center">
                      <img 
                        src={course.image_url || 'https://via.placeholder.com/300x200?text=Course+Image'} 
                        alt={course.description} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                    
                      <p className="text-gray-600 mb-4">{course.description?.substring(0, 100)}...</p>
                      <Link
                        to={`/courses/${course.courseId}`}
                        className="text-indigo-600 font-medium hover:text-indigo-500"
                      >
                        Learn More →
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-gray-500">No featured courses available yet.</p>
                </div>
              )}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link
              to="/courses"
              className="inline-block rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              View All Courses
            </Link>
          </div>
        </div>
      </section>

<section className="py-16 bg-sky-100">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-bold text-center mb-12">Why Choose Learn</h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <div
        className="group rounded-2xl border border-indigo-100 bg-white p-8 text-center shadow-sm
                   transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-105 hover:shadow-xl
                   focus-within:-translate-y-1 focus-within:scale-105 focus-within:shadow-xl outline-none"
        tabIndex={0}
        role="article"
      >
        <div className="bg-indigo-100 group-hover:bg-indigo-200 transition-colors rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-5">
          <h4 className="text-indigo-700 font-bold text-xl">01</h4>
        </div>
        <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
        <p className="text-gray-600">
          Learn from industry professionals with years of experience in their fields.
        </p>
      </div>

  
      <div
        className="group rounded-2xl border border-indigo-100 bg-white p-8 text-center shadow-sm
                   transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-105 hover:shadow-xl
                   focus-within:-translate-y-1 focus-within:scale-105 focus-within:shadow-xl outline-none"
        tabIndex={0}
        role="article"
      >
        <div className="bg-indigo-100 group-hover:bg-indigo-200 transition-colors rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-5">
          <h4 className="text-indigo-700 font-bold text-xl">02</h4>
        </div>
        <h3 className="text-xl font-semibold mb-2">Flexible Learning</h3>
        <p className="text-gray-600">
          Access courses anytime, anywhere, and learn at your own pace.
        </p>
      </div>

     
      <div
        className="group rounded-2xl border border-indigo-100 bg-white p-8 text-center shadow-sm
                   transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-105 hover:shadow-xl
                   focus-within:-translate-y-1 focus-within:scale-105 focus-within:shadow-xl outline-none"
        tabIndex={0}
        role="article"
      >
        <div className="bg-indigo-100 group-hover:bg-indigo-200 transition-colors rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-5">
          <h4 className="text-indigo-700 font-bold text-xl">03</h4>
        </div>
        <h3 className="text-xl font-semibold mb-2">Verified Certificates</h3>
        <p className="text-gray-600">
          Earn recognized certificates upon completion to showcase your skills.
        </p>
      </div>
    </div>
  </div>
</section>


     
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of students who are already advancing their careers with Learn.
          </p>
          <Link
            to="/register"
            className="inline-block rounded-md bg-white px-6 py-3 text-lg font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;