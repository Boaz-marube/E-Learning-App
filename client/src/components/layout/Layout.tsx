import React, { useState, type ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ChevronRight } from 'lucide-react';
import Navbar from './navbar';
import Footer from './footer';
import DynamicSidebar from './DynamicSidebar';
import ErrorBoundary from '../ui/ErrorBoundary';
import SidebarFallback from './SidebarFallback';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      {/* Global Sidebar - Only for logged-in users */}
      {user && (
        <>
          {/* Mobile Toggle Button */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="fixed top-20 left-2 z-50 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <ChevronRight className={`w-5 h-5 text-gray-600 dark:text-gray-300 transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`} />
            </button>
          )}
          
          {/* Sidebar */}
          <div
            onMouseEnter={() => !isMobile && setSidebarOpen(true)}
            onMouseLeave={() => !isMobile && setSidebarOpen(false)}
            className="fixed top-16 left-0 z-40"
          >
            <ErrorBoundary fallback={<SidebarFallback />}>
              <DynamicSidebar 
                isCollapsed={!sidebarOpen}
                className="transition-all duration-300 ease-in-out"
                onNavigate={() => isMobile && setSidebarOpen(false)}
              />
            </ErrorBoundary>
          </div>
        </>
      )}
      
      <Navbar />
      <main className={`flex-1 ${user ? 'ml-16 lg:ml-16' : ''}`}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;