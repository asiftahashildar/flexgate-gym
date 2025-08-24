import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Plan {
  id: string;
  name: string;
  type: 'monthly' | 'quarterly' | 'yearly';
  duration: number; // in months
  price: number;
  features: string[];
  isActive: boolean;
  description?: string;
}

interface PlansState {
  plans: Plan[];
}

const initialState: PlansState = {
  plans: [
    {
      id: 'plan-1',
      name: 'Basic Monthly',
      type: 'monthly',
      duration: 1,
      price: 49.99,
      features: ['Gym Access', 'Locker Usage', 'Basic Equipment'],
      isActive: true,
      description: 'Perfect for beginners starting their fitness journey',
    },
    {
      id: 'plan-2',
      name: 'Premium Quarterly',
      type: 'quarterly',
      duration: 3,
      price: 129.99,
      features: ['Gym Access', 'Locker Usage', 'All Equipment', 'Group Classes', '1 Personal Training Session'],
      isActive: true,
      description: 'Great value for committed fitness enthusiasts',
    },
    {
      id: 'plan-3',
      name: 'Elite Yearly',
      type: 'yearly',
      duration: 12,
      price: 399.99,
      features: ['Gym Access', 'Locker Usage', 'All Equipment', 'Unlimited Group Classes', '4 Personal Training Sessions', 'Nutrition Consultation', 'Priority Booking'],
      isActive: true,
      description: 'Ultimate package for serious athletes',
    },
  ],
};

const plansSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    addPlan: (state, action: PayloadAction<Plan>) => {
      state.plans.push(action.payload);
    },
    updatePlan: (state, action: PayloadAction<Plan>) => {
      const index = state.plans.findIndex(plan => plan.id === action.payload.id);
      if (index !== -1) {
        state.plans[index] = action.payload;
      }
    },
    deletePlan: (state, action: PayloadAction<string>) => {
      state.plans = state.plans.filter(plan => plan.id !== action.payload);
    },
    togglePlanStatus: (state, action: PayloadAction<string>) => {
      const plan = state.plans.find(plan => plan.id === action.payload);
      if (plan) {
        plan.isActive = !plan.isActive;
      }
    },
  },
});

export const {
  addPlan,
  updatePlan,
  deletePlan,
  togglePlanStatus,
} = plansSlice.actions;

export default plansSlice.reducer;