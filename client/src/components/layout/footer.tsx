import type React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer style={{ backgroundColor: "#00693F" }} className="text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:px-72">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* DirectEd Logo and Contact Info */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/DirectED.png" alt="DirectEd" className="h-8 w-8" />
              <span className="text-xl font-bold">DirectEd</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>directedbuh.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+91 9813 23 2309</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Somewhere in the World</span>
              </div>
            </div>
          </div>

          {/* QuickLinks */}
          <div>
            <h3 className="font-semibold mb-4">QuickLinks</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/courses" className="text-white">
                  Our Courses
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-white">
                  Our Testimonials
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="font-semibold mb-4">About Us</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/company" className="text-white">
                  Company
                </Link>
              </li>
              <li>
                <Link to="/achievements" className="text-white">
                  Achievements
                </Link>
              </li>
              <li>
                <Link to="/goals" className="text-white">
                  Our Goals
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-white">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-white">
                  Terms Of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-white">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help" className="text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="text-white">
                  Accessibility
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-white">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Profiles */}
          <div>
            <h3 className="font-semibold mb-4">Social Profiles</h3>
            <div className="flex space-x-3">
              <a href="#" className="text-white">
                {/* Twitter */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              {/* Add other social icons similarly with className="text-white" */}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-green-400 mt-8 pt-6 text-center text-sm">
          <p>© 2025 DirectEd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
