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

const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    addMember: (state, action: PayloadAction<Member>) => {
      state.members.push(action.payload);
    },
    updateMember: (state, action: PayloadAction<Member>) => {
      const index = state.members.findIndex(member => member.id === action.payload.id);
      if (index !== -1) {
        state.members[index] = action.payload;
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
      const today = new Date();
      const twoWeeksFromNow = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
      
      state.members.forEach(member => {
        const endDate = new Date(member.plan.endDate);
        if (endDate < today) {
          member.status = 'expired';
        } else if (endDate <= twoWeeksFromNow) {
          member.status = 'expiring-soon';
        } else {
          member.status = 'active';
        }
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