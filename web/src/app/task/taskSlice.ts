import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { api } from '../../utils/api';
import { RootState } from '../store';
import type { BTaskSchemaType, TaskSchemaType } from './types';

const taskAdapter = createEntityAdapter<BTaskSchemaType>();

const initialState = taskAdapter.getInitialState();

export const createNewTask = createAsyncThunk(
  '/api/task/new',
  async (data: TaskSchemaType) => {
    const url = '/api/task/new';
    return api.post<BTaskSchemaType>(url, data);
  },
);

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {},
});

export const { selectAll: selectAllTask } = taskAdapter.getSelectors(
  (state: RootState) => state.task,
);

export default taskSlice.reducer;
