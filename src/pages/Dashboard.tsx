import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  People,
  TrendingUp,
  CalendarToday,
  AttachMoney,
  FitnessCenter,
  Warning
} from '@mui/icons-material';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { DashboardCharts } from '@/components/Dashboard/DashboardCharts';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { updateMemberStatus } from '@/store/slices/membersSlice';

export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const members = useAppSelector((state) => state.members.members);
  const plans = useAppSelector((state) => state.plans.plans);

  useEffect(() => {
    // Update member statuses when component mounts
    dispatch(updateMemberStatus());
  }, [dispatch]);

  // Calculate stats
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'active').length;
  const expiringMembers = members.filter(m => m.status === 'expiring-soon').length;
  const expiredMembers = members.filter(m => m.status === 'expired').length;
  
  const monthlyRevenue = members
    .filter(m => m.status === 'active')
    .reduce((sum, member) => {
      const monthlyRate = member.plan.type === 'monthly' ? member.plan.price :
                         member.plan.type === 'quarterly' ? member.plan.price / 3 :
                         member.plan.price / 12;
      return sum + monthlyRate;
    }, 0);

  const activePlans = plans.filter(p => p.isActive).length;

  const stats = [
    {
      title: 'Total Members',
      value: totalMembers,
      subtitle: `${activeMembers} active members`,
      icon: <People />,
      color: 'primary' as const,
      trend: {
        value: 12,
        label: 'vs last month',
        isPositive: true,
      },
    },
    {
      title: 'Monthly Revenue',
      value: `$${monthlyRevenue.toFixed(2)}`,
      subtitle: 'Estimated monthly income',
      icon: <AttachMoney />,
      color: 'success' as const,
      trend: {
        value: 8,
        label: 'vs last month',
        isPositive: true,
      },
    },
    {
      title: 'Active Plans',
      value: activePlans,
      subtitle: `${plans.length} total plans`,
      icon: <FitnessCenter />,
      color: 'accent' as const,
    },
    {
      title: 'Expiring Soon',
      value: expiringMembers,
      subtitle: 'Members expiring in 2 weeks',
      icon: <Warning />,
      color: 'warning' as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fitness-card p-8 text-center"
      >
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-foreground mb-4"
        >
          Welcome to <span className="text-neon-green">FitGym Pro</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Your comprehensive gym management solution. Track members, manage plans, 
          and grow your fitness business with style.
        </motion.p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <DashboardCharts />
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="fitness-card p-6"
      >
        <h3 className="text-xl font-semibold text-foreground mb-6">
          Recent Activity
        </h3>
        
        <div className="space-y-4">
          {members.slice(0, 5).map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{member.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Joined {new Date(member.joiningDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {member.plan.type.charAt(0).toUpperCase() + member.plan.type.slice(1)} Plan
                </p>
                <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  member.status === 'active' ? 'bg-green-500/20 text-neon-green' :
                  member.status === 'expiring-soon' ? 'bg-orange-500/20 text-neon-orange' :
                  'bg-red-500/20 text-neon-red'
                }`}>
                  {member.status.replace('-', ' ')}
                </div>
              </div>
            </motion.div>
          ))}
          
          {members.length === 0 && (
            <div className="text-center py-12">
              <People className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-medium text-foreground mb-2">
                No members yet
              </h4>
              <p className="text-muted-foreground">
                Start by adding your first gym member!
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};