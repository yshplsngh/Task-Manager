import { z } from 'zod';

export const TaskSchema = z.object({
  title: z.string().trim().min(1),
  priority: z.number().min(1).max(5),
  taskStatus: z.string().refine((status)=> status==='Finished' || status==='Pending',{
    message: "Status must be either 'finished' or 'pending'"
  }),
  startTime: z.string(),
  endTime: z.string()
});

export const TaskWithIdSchema = TaskSchema.extend({
  id: z.number().int().positive()
})