import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div>
      
      <section className="bg-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Learn</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Empowering minds through quality online education. Learn at your own pace, anytime, anywhere.
          </p>
        </div>
      </section>

      
      <section className="py-16 bg-sky-100">


      <section className="py-16 bg-sky-100">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 gap-12 place-items-center">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Our Story</h2>

        <p className="text-gray-700 text-lg sm:text-xl leading-8 mb-6">
          Learn was founded in 2020 with a simple mission: to make quality education accessible to everyone, everywhere.
          What started as a small set of programming tutorials has grown into a comprehensive platform covering multiple disciplines.
        </p>

        <p className="text-gray-700 text-lg sm:text-xl leading-8 mb-6">
          We believe that education is the most powerful tool for changing lives and creating opportunities.
          That’s why every course is built around real-world projects, mentor feedback, and clear learning paths that reduce guesswork.
          Our community forums and study groups foster peer support, while weekly live sessions help learners stay on track.
          We also provide scholarships, localized content, and career guidance so students from any background can succeed with confidence.
        </p>

        <p className="text-gray-700 text-lg sm:text-xl leading-8">
          Today, Learn serves thousands of students worldwide, helping them acquire practical skills, advance their careers, and pursue their passions.
          We’re proud of the impact so far—and we’re just getting started.
        </p>
      </div>
    </div>
  </div>
</section>




      </section>

     
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Our Mission & Values</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              We're guided by a clear mission and strong values that inform everything we do.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Accessibility</h3>
              <p className="text-gray-600 text-center">
                We believe education should be accessible to everyone. We strive to offer affordable courses and provide scholarships to students in need.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Quality</h3>
              <p className="text-gray-600 text-center">
                We are committed to excellence in education. Our courses are carefully designed and taught by experts to ensure the highest quality learning experience.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Community</h3>
              <p className="text-gray-600 text-center">
                We foster a supportive community where students and instructors can connect, collaborate, and learn from each other.
              </p>
            </div>
          </div>
        </div>
      </section>

     
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Meet Our Team</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our diverse team brings together expertise in education, technology, and business to create the best learning platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Founder & CEO',
                bio: 'Former university professor with 15+ years of experience in education technology.',
                image: 'https://randomuser.me/api/portraits/women/75.jpg'
              },
              {
                name: 'Michael Chen',
                role: 'Chief Technology Officer',
                bio: 'Software engineer with a passion for creating intuitive learning experiences.',
                image: 'https://randomuser.me/api/portraits/men/32.jpg'
              },
              {
                name: 'Aisha Patel',
                role: 'Head of Content',
                bio: 'Curriculum developer focused on creating engaging, accessible educational material.',
                image: 'https://randomuser.me/api/portraits/women/44.jpg'
              },
              {
                name: 'James Wilson',
                role: 'Chief Marketing Officer',
                bio: 'Digital marketing expert dedicated to connecting students with the right courses.',
                image: 'https://randomuser.me/api/portraits/men/67.jpg'
              }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                <img src={member.image} alt={member.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-indigo-600 mb-2">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>




    
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Learning Community</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Ready to start your learning journey? Browse our courses and join thousands of students who are transforming their lives through education.
          </p>
          <div className="space-x-4">
            <Link
              to="/courses"
              className="inline-block rounded-md bg-white px-6 py-3 text-lg font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50"
            >
              Browse Courses
            </Link>
            <Link
              to="/contact"
              className="inline-block rounded-md bg-transparent border-2 border-white px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>



    </div>
  );
};

export default About;