import dayjs from 'dayjs';
import { z } from 'zod';

export const TaskSchema = z
  .object({
    title: z.string().trim().min(1).max(500),
    priority: z.number().min(1).max(5),
    taskStatus: z
      .string()
      .refine((status) => status === 'Finished' || status === 'Pending', {
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
  taskStatus: 'Pending' | 'Finished';
  startTime: string;
  endTime: string;
  id: number;
};

type TaskAnalytics = {
  pendingTasks: number;
  taskTimeInMin: number;
  remainingTimeInMin: number;
};

export type BRawDataType = {
  totalTask: number;
  tasksCompleted: number;
  tasksPending: number;
  averageTimePerTask: number;
  pendingTasks: number;
  totalTimeLapsed: number;
  totalTimeToFinish: number;
  tableData: Record<number, TaskAnalytics>;
};
