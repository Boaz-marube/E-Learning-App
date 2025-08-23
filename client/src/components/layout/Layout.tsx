import React, { type ReactNode } from 'react';
import Navbar from './navbar';
import Footer from './footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>{children}</main>
      <Footer/>
    </div>
  );
};

export default Layout;