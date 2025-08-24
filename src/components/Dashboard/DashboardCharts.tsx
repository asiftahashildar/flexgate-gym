import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppSelector } from '@/hooks/redux';

const planDistributionData = [
  { name: 'Monthly', value: 45, color: '#00ff88' },
  { name: 'Quarterly', value: 30, color: '#ff6b35' },
  { name: 'Yearly', value: 25, color: '#ff073a' },
];

const membershipGrowthData = [
  { month: 'Jan', members: 45 },
  { month: 'Feb', members: 52 },
  { month: 'Mar', members: 61 },
  { month: 'Apr', members: 68 },
  { month: 'May', members: 75 },
  { month: 'Jun', members: 83 },
];

export const DashboardCharts: React.FC = () => {
  const members = useAppSelector((state) => state.members.members);

  // Calculate real plan distribution
  const realPlanDistribution = React.useMemo(() => {
    const distribution = members.reduce((acc, member) => {
      const planType = member.plan.type;
      acc[planType] = (acc[planType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'Monthly', value: distribution.monthly || 0, color: '#00ff88' },
      { name: 'Quarterly', value: distribution.quarterly || 0, color: '#ff6b35' },
      { name: 'Yearly', value: distribution.yearly || 0, color: '#ff073a' },
    ];
  }, [members]);

  const dataToUse = members.length > 0 ? realPlanDistribution : planDistributionData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Plan Distribution */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fitness-card p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Plan Distribution
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataToUse}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {dataToUse.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-4 mt-4">
          {dataToUse.map((item) => (
            <div key={item.name} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-muted-foreground">
                {item.name}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Membership Growth */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fitness-card p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Membership Growth
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={membershipGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))',
                }}
              />
              <Bar 
                dataKey="members" 
                fill="#00ff88"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};