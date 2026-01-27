import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <h2 className="text-2xl font-bold mb-4">Learn</h2>
            <p className="text-gray-300">
              Empowering minds through quality online education. Learn at your own pace, anytime, anywhere.
            </p>
          </div>
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/courses" className="text-gray-300 hover:text-white">Courses</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
             
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/courses?category=programming" className="text-gray-300 hover:text-white">Programming</Link></li>
              <li><Link to="/courses?category=design" className="text-gray-300 hover:text-white">Design</Link></li>
              <li><Link to="/courses?category=business" className="text-gray-300 hover:text-white">Business</Link></li>
              <li><Link to="/courses?category=marketing" className="text-gray-300 hover:text-white">Marketing</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <address className="not-italic text-gray-300">
              <p>Email: info@learn.com</p>
              <p>Phone: +94 12345678</p>
              <p>Address: 123 Education St, Learning City, 12345</p>
            </address>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300">&copy; {new Date().getFullYear()} Learn. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <p className="text-gray-300">
              <Link to="/privacy" className="hover:text-white mr-4">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white">Terms of Service</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;