import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import ThemeToggle from "../ui/ThemeToggle"
import SearchBar from "../ui/SearchBar"
import { Menu, X } from "lucide-react"

const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
    setIsMobileMenuOpen(false)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
    closeMobileMenu();
  }

  return (
    <header className="sticky top-0 z-50 shadow-sm" style={{ backgroundColor: "#00693F" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <img src="/DirectED.png" alt="DirectEd" className="h-8 w-8" />
            <span className="text-xl font-bold text-white">DirectEd</span>
          </Link>

          {/* Desktop Center Section - Navigation + Search */}
          <div className="hidden lg:flex items-center space-x-6 flex-1 justify-center max-w-2xl mx-8">
            <nav className="flex space-x-6">
              <Link to="/courses" className="text-white hover:text-green-200 transition-colors">
                Courses
              </Link>
              <Link to="/about" className="text-white hover:text-green-200 transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-white hover:text-green-200 transition-colors">
                Contact
              </Link>
            </nav>
            <SearchBar 
              className="w-64" 
              placeholder="Search courses..."
              onSearch={handleSearch}
            />
          </div>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center space-x-3">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-white hidden xl:block">Welcome, {user.name}</span>
                <Link
                  to="/dashboard"
                  className="bg-white px-4 py-2 rounded-md hover:bg-green-50 transition-colors font-medium"
                  style={{ color: "#00693F" }}
                >
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="text-white hover:text-green-200 transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-white hover:text-green-200 transition-colors font-medium">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-white px-4 py-2 rounded-md hover:bg-green-50 transition-colors font-medium"
                  style={{ color: "#00693F" }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Section */}
          <div className="lg:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2 rounded-md hover:bg-green-600 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-green-600">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Search Bar */}
              <div className="px-3 py-2">
                <SearchBar 
                  placeholder="Search courses..."
                  onSearch={handleSearch}
                />
              </div>
              
              {/* Navigation Links */}
              <Link
                to="/courses"
                onClick={closeMobileMenu}
                className="block px-3 py-2 text-white hover:bg-green-600 rounded-md transition-colors"
              >
                Courses
              </Link>
              <Link
                to="/about"
                onClick={closeMobileMenu}
                className="block px-3 py-2 text-white hover:bg-green-600 rounded-md transition-colors"
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={closeMobileMenu}
                className="block px-3 py-2 text-white hover:bg-green-600 rounded-md transition-colors"
              >
                Contact
              </Link>
              
              {/* Auth Section */}
              <div className="border-t border-green-600 pt-3 mt-3">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-white text-sm">
                      Welcome, {user.name}
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 bg-white text-green-700 rounded-md font-medium hover:bg-green-50 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-white hover:bg-green-600 rounded-md transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 text-white hover:bg-green-600 rounded-md transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={closeMobileMenu}
                      className="block px-3 py-2 bg-white text-green-700 rounded-md font-medium hover:bg-green-50 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
