
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Member {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  email: string;
  phone: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  plan: {
    type: 'monthly' | 'quarterly' | 'yearly';
    startDate: string;
    endDate: string;
    price: number;
  };
  joiningDate: string;
  status: 'active' | 'expired' | 'expiring-soon';
  profileImage?: string;
  notes?: string;
}

interface MembersState {
  members: Member[];
  searchTerm: string;
  filterStatus: 'all' | 'active' | 'expired' | 'expiring-soon';
  sortBy: 'name' | 'joiningDate' | 'expiryDate';
  sortOrder: 'asc' | 'desc';
}

const initialState: MembersState = {
  members: [],
  searchTerm: '',
  filterStatus: 'all',
  sortBy: 'name',
  sortOrder: 'asc',
};

// Helper function to calculate member status
const calculateMemberStatus = (endDate: string): 'active' | 'expired' | 'expiring-soon' => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const memberEndDate = new Date(endDate);
  memberEndDate.setHours(0, 0, 0, 0);
  
  const timeDiff = memberEndDate.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  if (daysDiff < 0) {
    return 'expired';
  } else if (daysDiff <= 14) {
    return 'expiring-soon';
  } else {
    return 'active';
  }
};

const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    addMember: (state, action: PayloadAction<Member>) => {
      const memberWithStatus = {
        ...action.payload,
        status: calculateMemberStatus(action.payload.plan.endDate)
      };
      state.members.push(memberWithStatus);
    },
    updateMember: (state, action: PayloadAction<Member>) => {
      const index = state.members.findIndex(member => member.id === action.payload.id);
      if (index !== -1) {
        const memberWithStatus = {
          ...action.payload,
          status: calculateMemberStatus(action.payload.plan.endDate)
        };
        state.members[index] = memberWithStatus;
      }
    },
    deleteMember: (state, action: PayloadAction<string>) => {
      state.members = state.members.filter(member => member.id !== action.payload);
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<'all' | 'active' | 'expired' | 'expiring-soon'>) => {
      state.filterStatus = action.payload;
    },
    setSorting: (state, action: PayloadAction<{ sortBy: 'name' | 'joiningDate' | 'expiryDate'; sortOrder: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    updateMemberStatus: (state) => {
      state.members.forEach(member => {
        member.status = calculateMemberStatus(member.plan.endDate);
      });
    },
  },
});

export const {
  addMember,
  updateMember,
  deleteMember,
  setSearchTerm,
  setFilterStatus,
  setSorting,
  updateMemberStatus,
} = membersSlice.actions;

export default membersSlice.reducer;
