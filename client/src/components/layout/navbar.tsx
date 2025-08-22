"use client"

import type React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <header className="shadow-sm" style={{ backgroundColor: "#00693F" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/DirectED.png" alt="DirectEd" className="h-8 w-8" />
            <span className="text-xl font-bold text-white">DirectEd</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-white hover:text-green-200 transition-colors">
              Home
            </Link>
            <Link to="/courses" className="text-white hover:text-green-200 transition-colors">
              Courses
            </Link>
            <Link to="/why-directed" className="text-white hover:text-green-200 transition-colors">
              Why DirectEd?
            </Link>
            <Link to="/testimonials" className="text-white hover:text-green-200 transition-colors">
              Testimonials
            </Link>
            <Link to="/contact" className="text-white hover:text-green-200 transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-white">Welcome, {user.name}</span>
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
        </div>
      </div>
    </header>
  )
}

export default Navbar;
