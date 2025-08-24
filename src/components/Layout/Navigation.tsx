import React from 'react';
import { motion } from 'framer-motion';
import { 
  Dashboard,
  PersonAdd,
  People,
  FitnessCenter,
  Settings,
  Menu,
  Close
} from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavigationProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navigationItems = [
  { icon: Dashboard, label: 'Dashboard', path: '/' },
  { icon: PersonAdd, label: 'Add Member', path: '/add-member' },
  { icon: People, label: 'Members', path: '/members' },
  { icon: FitnessCenter, label: 'Plans', path: '/plans' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Navigation: React.FC<NavigationProps> = ({ isOpen, onToggle }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : '-100%',
          width: isOpen ? '280px' : '80px',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed left-0 top-0 h-full bg-card border-r border-border z-50',
          'lg:relative lg:translate-x-0',
          'fitness-card shadow-elevated'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <motion.div
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center neon-glow">
              <FitnessCenter className="text-primary-foreground" />
            </div>
            {isOpen && (
              <div>
                <h1 className="text-xl font-bold text-neon-green">FitGym Pro</h1>
                <p className="text-xs text-muted-foreground">Management System</p>
              </div>
            )}
          </motion.div>
          
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-muted transition-colors lg:hidden"
          >
            {isOpen ? <Close /> : <Menu />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item, index) => (
              <motion.li
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center space-x-4 p-3 rounded-lg transition-all duration-300',
                      'hover:bg-muted hover:shadow-md hover:translate-x-1',
                      isActive
                        ? 'bg-primary text-primary-foreground neon-glow'
                        : 'text-muted-foreground hover:text-foreground'
                    )
                  }
                >
                  <item.icon className="w-6 h-6 flex-shrink-0" />
                  <motion.span
                    animate={{ opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      'font-medium',
                      !isOpen && 'lg:hidden'
                    )}
                  >
                    {item.label}
                  </motion.span>
                </NavLink>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <motion.div
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="p-4 border-t border-border"
        >
          {isOpen && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                © 2024 FitGym Pro
              </p>
              <p className="text-xs text-neon-green font-medium">
                v1.0.0
              </p>
            </div>
          )}
        </motion.div>
      </motion.aside>
    </>
  );
};