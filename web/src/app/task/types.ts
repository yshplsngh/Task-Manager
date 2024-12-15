import { z } from 'zod';

export const TaskSchema = z.object({
  title: z.string().trim().min(1),
  priority: z.number().min(1).max(5),
  taskStatus: z
    .string()
    .refine((status) => status === 'Finished' || status === 'Pending', {
      message: "Status must be either 'finished' or 'pending'",
    }),
  startTime: z.string(),
  endTime: z.string(),
});

export type TaskSchemaType = z.infer<typeof TaskSchema>;

export interface BTaskSchemaType {
  title: string;
  priority: number;
  taskStatus: 'Pending' | 'Finished';
  startTime: string;
  endTime: string;
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}
