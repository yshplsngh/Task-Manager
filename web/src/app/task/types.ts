import dayjs from 'dayjs';
import { z } from 'zod';

export const TaskSchema = z
  .object({
    title: z.string().trim().min(1).max(500),
    priority: z.number().min(1).max(5),
    taskStatus: z
      .string()
      .refine((status) => status === 'FINISHED' || status === 'PENDING', {
        message: "Status must be either 'finished' or 'pending'",
      }),
    startTime: z.string(),
    endTime: z.string(),
  })
  .refine(
    (data) => {
      return dayjs(data.endTime).isAfter(dayjs(data.startTime));
    },
    {
      message: 'End time must be after start time',
      path: ['endTime'],
    },
  );

export type TaskSchemaType = z.infer<typeof TaskSchema>;

export type BTaskSchemaType = {
  title: string;
  priority: number;
  taskStatus: 'PENDING' | 'FINISHED';
  startTime: string;
  endTime: string;
  id: number;
};

export type StatsType = {
  priority:number;
  pendingTasks: number;
  remainingTimeInMin: number;
  taskTimeInMin: number;
};

export type BRawDataType = {
  totalTask: number;
  tasksCompleted: number;
  tasksPending: number;
  averageTimePerTask: number;
  pendingTasks: number;
  totalTimeLapsed: number;
  totalTimeToFinish: number;
  tableData: Record<number, StatsType>;
};

export const STATUS_FILTERS = ['PENDING','FINISHED','ALL'] as const;
export type TaskStatus = typeof STATUS_FILTERS[number];

export const SORT_FILTERS = ['START TIME: ASC','START TIME: DESC','END TIME: ASC','END TIME: DESC'] as const;
export type SortMethod = typeof SORT_FILTERS[number];

export const PRIORITY_FILTERS = ['None','1','2','3','4','5'] as const;
export type TaskPriority = typeof PRIORITY_FILTERS[number]

export const TaskIdsSchema = z.object({
  ids: z.array(z.number()).min(1)
})

export type TaskIdsSchemaType = z.infer<typeof TaskIdsSchema>