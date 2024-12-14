import type { Express, Request, Response, NextFunction } from 'express';
import requireUser from '../utils/middleware/requireUser';
import { TaskSchema } from './types';
import prisma from '../database';

export default function (app: Express) {
  app.post(
    '/api/task/new',
    requireUser,
    async (req: Request, res: Response, next: NextFunction) => {
      const parsedResult = TaskSchema.safeParse(req.body);
      if (!parsedResult.success) {
        next(parsedResult.error);
        return;
      }
      const task = await prisma.task.create({
        data:{
            userId:res.locals.user.id,
            title:parsedResult.data.title,
            priority:parsedResult.data.priority,
            taskStatus:parsedResult.data.taskStatus,
            startTime:parsedResult.data.startTime,
            endTime:parsedResult.data.endTime
        }
      })
      console.log(task);
      return res.status(201).json({ success: true });
    },
  );
}
