import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RegisterTempData {
  email: string;
  name: string;
  password: string;
  phoneNumber: string;
}

interface RegistrationState {
  tempData: RegisterTempData | null;
  currentStep: 'signup' | 'otp' | null;
}

const initialState: RegistrationState = {
  tempData: null,
  currentStep: null,
};

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    setTempRegistrationData: (state, action: PayloadAction<RegisterTempData>) => {
      state.tempData = action.payload;
      state.currentStep = 'otp';
    },
    clearTempRegistrationData: (state) => {
      state.tempData = null;
      state.currentStep = null;
    },
    setRegistrationStep: (state, action: PayloadAction<'signup' | 'otp' | null>) => {
      state.currentStep = action.payload;
    },
  },
});

export const { setTempRegistrationData, clearTempRegistrationData, setRegistrationStep } =
  registrationSlice.actions;
export default registrationSlice.reducer;
