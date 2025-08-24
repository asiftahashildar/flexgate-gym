import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GymSettings {
  gymName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  notifications: {
    emailReminders: boolean;
    smsReminders: boolean;
    membershipExpiry: boolean;
    paymentDue: boolean;
  };
}

interface SettingsState {
  settings: GymSettings;
}

const initialState: SettingsState = {
  settings: {
    gymName: 'FitGym Pro',
    address: '123 Fitness Street, Workout City',
    phone: '+1 (555) 123-4567',
    email: 'info@fitgympro.com',
    website: 'www.fitgympro.com',
    description: 'Premium fitness center dedicated to helping you achieve your health and wellness goals.',
    notifications: {
      emailReminders: true,
      smsReminders: false,
      membershipExpiry: true,
      paymentDue: true,
    },
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<GymSettings>) => {
      state.settings = action.payload;
    },
    updateNotificationSetting: (state, action: PayloadAction<{ key: keyof GymSettings['notifications']; value: boolean }>) => {
      state.settings.notifications[action.payload.key] = action.payload.value;
    },
  },
});

export const { updateSettings, updateNotificationSetting } = settingsSlice.actions;
export default settingsSlice.reducer;