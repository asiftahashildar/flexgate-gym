import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Add, PersonAdd, FitnessCenter, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const actions = [
    {
      icon: PersonAdd,
      label: 'Add Member',
      action: () => navigate('/add-member'),
      color: 'bg-gradient-to-r from-neon-green to-green-400',
    },
    {
      icon: FitnessCenter,
      label: 'Add Plan',
      action: () => navigate('/plans'),
      color: 'bg-gradient-to-r from-neon-orange to-orange-400',
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: { delay: index * 0.1 }
                }}
                exit={{ 
                  opacity: 0, 
                  y: 20, 
                  scale: 0.8,
                  transition: { delay: (actions.length - index - 1) * 0.1 }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  action.action();
                  setIsOpen(false);
                }}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-full text-white font-medium shadow-lg',
                  'hover:shadow-xl transition-all duration-300',
                  action.color
                )}
              >
                <action.icon className="w-5 h-5" />
                <span className="whitespace-nowrap">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg',
          'transition-all duration-300 hover:shadow-xl',
          isOpen 
            ? 'bg-gradient-to-r from-red-500 to-red-600 rotate-45' 
            : 'bg-gradient-primary neon-glow'
        )}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <Close /> : <Add />}
        </motion.div>
      </motion.button>
    </div>
  );
};