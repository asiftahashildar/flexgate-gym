import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'danger';
  className?: string;
}

const colorClasses = {
  primary: 'border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10',
  accent: 'border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10',
  success: 'border-neon-green/20 bg-gradient-to-br from-green-500/5 to-green-600/10',
  warning: 'border-neon-orange/20 bg-gradient-to-br from-orange-500/5 to-orange-600/10',
  danger: 'border-neon-red/20 bg-gradient-to-br from-red-500/5 to-red-600/10',
};

const iconColorClasses = {
  primary: 'text-primary',
  accent: 'text-accent',
  success: 'text-neon-green',
  warning: 'text-neon-orange',
  danger: 'text-neon-red',
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'primary',
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -2,
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3)',
      }}
      className={cn(
        'fitness-card p-6 border-2',
        colorClasses[color],
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={cn('p-3 rounded-xl', iconColorClasses[color])}>
          <div className="w-6 h-6">
            {icon}
          </div>
        </div>
        
        {trend && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className={cn(
              'flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium',
              trend.isPositive
                ? 'bg-green-500/20 text-neon-green'
                : 'bg-red-500/20 text-neon-red'
            )}
          >
            <span>{trend.isPositive ? '↗' : '↘'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </h3>
        
        <motion.p
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-foreground"
        >
          {value}
        </motion.p>
        
        {subtitle && (
          <p className="text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
        
        {trend && (
          <p className="text-xs text-muted-foreground">
            {trend.label}
          </p>
        )}
      </div>
    </motion.div>
  );
};