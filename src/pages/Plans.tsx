import React from 'react';
import { motion } from 'framer-motion';
import { FitnessCenter, Add, Edit, Delete, ToggleOn, ToggleOff } from '@mui/icons-material';
import { Button } from '@/components/ui/button';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { togglePlanStatus } from '@/store/slices/plansSlice';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export const Plans: React.FC = () => {
  const dispatch = useAppDispatch();
  const plans = useAppSelector((state) => state.plans.plans);

  const handleToggleStatus = (planId: string, currentStatus: boolean) => {
    dispatch(togglePlanStatus(planId));
    toast({
      title: 'Plan Updated',
      description: `Plan has been ${currentStatus ? 'deactivated' : 'activated'}.`,
    });
  };

  const getPlanTypeColor = (type: string) => {
    switch (type) {
      case 'monthly':
        return 'from-neon-green to-green-400';
      case 'quarterly':
        return 'from-neon-orange to-orange-400';
      case 'yearly':
        return 'from-neon-red to-red-400';
      default:
        return 'from-primary to-blue-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fitness-card p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center neon-glow">
              <FitnessCenter className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Membership Plans</h1>
              <p className="text-muted-foreground">
                Manage your gym membership plans and pricing
              </p>
            </div>
          </div>
          
          <Button className="btn-primary-glow">
            <Add className="w-4 h-4 mr-2" />
            Add Plan
          </Button>
        </div>
      </motion.div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              'fitness-card p-6 relative overflow-hidden',
              !plan.isActive && 'opacity-60'
            )}
          >
            {/* Plan Header */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>
                
                <button
                  onClick={() => handleToggleStatus(plan.id, plan.isActive)}
                  className={cn(
                    'p-1 rounded-full transition-colors',
                    plan.isActive 
                      ? 'text-neon-green hover:bg-green-500/20' 
                      : 'text-muted-foreground hover:bg-muted'
                  )}
                  title={plan.isActive ? 'Deactivate Plan' : 'Activate Plan'}
                >
                  {plan.isActive ? <ToggleOn /> : <ToggleOff />}
                </button>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold text-foreground">
                    ${plan.price}
                  </span>
                  <span className="text-muted-foreground">
                    / {plan.duration} month{plan.duration > 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  ${(plan.price / plan.duration).toFixed(2)} per month
                </p>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="font-semibold text-foreground mb-3">Features:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-neon-green rounded-full mr-3 flex-shrink-0"></span>
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Delete className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Background gradient */}
            <div className={cn(
              'absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20',
              `bg-gradient-to-br ${getPlanTypeColor(plan.type)}`
            )} />
          </motion.div>
        ))}
      </div>

      {/* Plan Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="fitness-card p-6"
      >
        <h3 className="text-xl font-semibold text-foreground mb-4">Plan Statistics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-neon-green mb-1">
              {plans.filter(p => p.isActive).length}
            </div>
            <div className="text-sm text-muted-foreground">Active Plans</div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-neon-orange mb-1">
              ${plans.reduce((sum, plan) => sum + (plan.isActive ? plan.price : 0), 0).toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Total Plan Value</div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-neon-red mb-1">
              ${(plans.reduce((sum, plan) => sum + (plan.isActive ? plan.price / plan.duration : 0), 0)).toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Avg Monthly Rate</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};