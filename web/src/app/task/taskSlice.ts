import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { api, type ProcessedResponse } from '../../utils/api';
import { RootState } from '../store';
import type { BTaskSchemaType, TaskSchemaType } from './types';

const taskAdapter = createEntityAdapter<BTaskSchemaType>();

const initialState = taskAdapter.getInitialState();

export const createNewTask = createAsyncThunk(
  '/api/task/new',
  async (data: TaskSchemaType) => {
    const url = '/api/task/new';
    return api.post(url, data);
  },
);
export const updateTask = createAsyncThunk(
  '/api/task/edit',
  async (data: BTaskSchemaType) => {
    const url = '/api/task/edit';
    return api.post<BTaskSchemaType>(url, data);
  },
);
export const getTask = createAsyncThunk('/api/task/get', async () => {
  const url = '/api/task/get';
  return api.get<BTaskSchemaType[]>(url);
});
export const getSingleTask = createAsyncThunk(
  '/api/task/getSingle',
  async (taskId: string) => {
    const url = `/api/task/getSingle/${taskId}`;
    return api.get<BTaskSchemaType>(url);
  },
);

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        getTask.fulfilled,
        (
          state,
          action: PayloadAction<ProcessedResponse<BTaskSchemaType[]>>,
        ) => {
          taskAdapter.upsertMany(state, action.payload.json);
        },
      )
      .addCase(
        getSingleTask.fulfilled,
        (state, action: PayloadAction<ProcessedResponse<BTaskSchemaType>>) => {
          taskAdapter.upsertOne(state, action.payload.json);
        },
      )
      .addCase(
        updateTask.fulfilled,(state,action:PayloadAction<ProcessedResponse<BTaskSchemaType>>) => {
          taskAdapter.updateOne(state, {
            id: action.payload.json.id,
            changes: action.payload.json,
          });
        }
      )
  },
});

export const { selectAll: selectAllTask, selectById: selectTaskById,selectIds:selectTaskIds } =
  taskAdapter.getSelectors((state: RootState) => state.task);

export default taskSlice.reducer;
