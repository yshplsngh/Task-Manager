import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProcessedResponse, api } from '../../utils/api';
import { RootState } from '../store';
import { UserData, type AuthSchemaType } from './types';

interface authState {
  userData: UserData;
  statusLoading: boolean;
}

const initialState: authState = {
  userData: {
    id: null,
    email: null,
    iat: null,
    exp: null
  },
  statusLoading: false,
};

export const fetchUserInfo = createAsyncThunk('/api/user', async () => {
  const url = '/api/user';
  return await api.get<UserData>(url);
});
export const userLogin = createAsyncThunk('/api/auth/login', async (data:AuthSchemaType)=> {
  const url = '/api/auth/login'
  return await api.post(url,data);
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(
        fetchUserInfo.fulfilled,
        (state, action: PayloadAction<ProcessedResponse<UserData>>) => {
          state.statusLoading = false;
          // when id is not present, it means cookies are expired in response; we are getting an empty object.
          if (!action.payload.json.id) {
            state.userData = initialState.userData;
          } else {
            state.userData = action.payload.json;
          }
        },
      )
      .addCase(fetchUserInfo.rejected, (state) => {
        state.statusLoading = false;
      })
      .addCase(fetchUserInfo.pending, (state) => {
        state.statusLoading = true;
      })
  },
});

export const selectUser = (state: RootState) => state.auth.userData;
export const selectStatusLoading = (state: RootState) =>
  state.auth.statusLoading;

export default authSlice.reducer;
