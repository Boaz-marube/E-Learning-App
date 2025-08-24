import type React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { Instagram, Youtube, Linkedin, Twitter } from "lucide-react";

const Footer: React.FC = () => {
  return (

    <footer style={{ backgroundColor: "#00693F" }} className="text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">

          {/* DirectEd Logo and Contact Info */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4 space-x-2">
              <img src="/DirectED.png" alt="DirectEd" className="w-8 h-8" />
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
            <h3 className="mb-4 font-semibold">QuickLinks</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/courses" className="hover:text-gray-300">
                  Our Courses
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="hover:text-gray-300">
                  Our Testimonials
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-gray-300">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gray-300">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="mb-4 font-semibold">About Us</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/company" className="hover:text-gray-300">
                  Company
                </Link>
              </li>
              <li>
                <Link to="/achievements" className="hover:text-gray-300">
                  Achievements
                </Link>
              </li>
              <li>
                <Link to="/goals" className="hover:text-gray-300">
                  Our Goals
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-gray-300">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-gray-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-gray-300">
                  Terms Of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-gray-300">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help" className="hover:text-gray-300">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="hover:text-gray-300">
                  Accessibility
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-gray-300">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Profiles */}
          <div className="flex space-x-4">
            <a
              href="https://www.instagram.com/directeddev/"
              target="_blank"
              className="p-3 transition-all duration-300 transform bg-gray-800 group hover:bg-pink-600 rounded-xl hover:scale-110"
            >
              <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white" />
            </a>
            <a
              href="https://www.youtube.com/@directedkenya"
              target="_blank"
              className="p-3 transition-all duration-300 transform bg-gray-800 group hover:bg-red-600 rounded-xl hover:scale-110"
            >
              <Youtube className="w-5 h-5 text-gray-400 group-hover:text-white" />
            </a>
            <a
              href="https://www.linkedin.com/company/directed-dev/"
              target="_blank"
              className="p-3 transition-all duration-300 transform bg-gray-800 group hover:bg-blue-700 rounded-xl hover:scale-110"
            >
              <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-white" />
            </a>
            <a
              href="https://x.com/DirectEdDev"
              target="_blank"
              className="p-3 transition-all duration-300 transform bg-gray-800 group hover:bg-blue-400 rounded-xl hover:scale-110"
            >
              <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 mt-8 text-sm text-center border-t border-green-400">
          <p>© 2025 DirectEd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
