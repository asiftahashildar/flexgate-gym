import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Header } from './Header';
import { FloatingActionButton } from '@/components/FloatingActionButton';

interface MainLayoutProps {
  children: React.ReactNode;
}

const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case '/':
      return 'Dashboard';
    case '/add-member':
      return 'Add Member';
    case '/members':
      return 'Members';
    case '/plans':
      return 'Plans';
    case '/settings':
      return 'Settings';
    default:
      return 'FitGym Pro';
  }
};

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Navigation isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header onMenuToggle={toggleSidebar} title={pageTitle} />
          
          {/* Page Content */}
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
      
      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
};