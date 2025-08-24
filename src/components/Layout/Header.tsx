import React from 'react';
import { motion } from 'framer-motion';
import { 
  Menu,
  NotificationsOutlined,
  PersonOutlined,
  Settings
} from '@mui/icons-material';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMenuToggle: () => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, title }) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 bg-card border-b border-border px-6 flex items-center justify-between fitness-card"
    >
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="lg:hidden hover:bg-muted"
        >
          <Menu />
        </Button>
        
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back to your gym management dashboard
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <Button variant="ghost" size="icon" className="relative">
            <NotificationsOutlined />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center neon-glow"
            >
              3
            </Badge>
          </Button>
        </motion.div>

        {/* Settings */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button variant="ghost" size="icon">
            <Settings />
          </Button>
        </motion.div>

        {/* Profile */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center neon-glow">
            <PersonOutlined className="text-primary-foreground text-sm" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground">Admin</p>
            <p className="text-xs text-muted-foreground">Gym Owner</p>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};