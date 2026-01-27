import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseService from '../services/CourseService';


const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
 

  
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'programming', name: 'Programming' },
    { id: 'design', name: 'Design' },
    { id: 'business', name: 'Business' },
    { id: 'marketing', name: 'Marketing' }
  ];

  useEffect(() => {

    let active = true;
    (async () => {

      try {
        setLoading(true);
        const data = await CourseService.getAllCourses(); 
        if (active) setCourses(Array.isArray(data) ? data : []);
      } catch (e) {
        if (active) setError('Failed to fetch courses');
        console.error('Error fetching courses:', e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

 
  
  const filteredCourses = courses.filter((course) => {  
    const matchesCategory =    selectedCategory === 'all' ||  (course.category ?? '').toLowerCase() === selectedCategory.toLowerCase();
  
    const matchesSearch = course.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Our Courses</h1>
        <p className="mt-4 text-xl text-gray-600">Browse our wide range of courses and find the perfect one for you</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === category.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full md:w-64 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <svg
            className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>



      {/* Courses Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-500 text-xl">{error}</p>
          <p className="mt-2 text-gray-600">Please try again later.</p>
        </div>
      ) : (
        <>
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
                  <div className="h-48 bg-indigo-100">
                    <img 
                      src={course.image_url|| 'https://placehold.co/300x200'} 
                      alt={course.description} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">

                    <h3 className="text-xl font-semibold mb-2">{course.category}</h3>
                    
                    <p className="text-gray-600 mb-4 h-20 overflow-hidden">{course.description}</p>
                 
                    <Link
                        to={`/courses/${course.courseId}`}
                        className="text-indigo-600 font-medium hover:text-indigo-500"
                      >
                        Learn More →
                      </Link>
                    
                  </div>
                </div>
              ))}
            </div>
          ) : 
          (
            <div className="text-center py-20">
              <p className="text-gray-500 text-xl">No courses found matching your criteria.</p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                className="mt-4 text-indigo-600 hover:text-indigo-800"
              >
                Clear filters
              </button>
            </div>
          )}
        </>
      )}


    </div>
  );
};

export default Courses;

