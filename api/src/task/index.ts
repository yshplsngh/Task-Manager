import type { Express, Request, Response, NextFunction } from 'express';
import requireUser from '../utils/middleware/requireUser';
import { TaskSchema, TaskWithIdSchema } from './types';
import prisma from '../database';
import { createError } from '../utils/middleware/errorHandling';

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
        data: {
          userId: res.locals.user.id,
          title: parsedResult.data.title,
          priority: parsedResult.data.priority,
          taskStatus: parsedResult.data.taskStatus,
          startTime: parsedResult.data.startTime,
          endTime: parsedResult.data.endTime,
        },
      });
      console.log(task);
      return res.status(201).json({ success: true });
    },
  );

  app.get('/api/task/get', requireUser, async (req: Request, res: Response) => {
    const task = await prisma.task.findMany({
      where: {
        userId: res.locals.user.id,
      },
      select: {
        id: true,
        title: true,
        priority: true,
        taskStatus: true,
        startTime: true,
        endTime: true,
      },
    });
    return res.status(200).json(task);
  });

  app.get(
    '/api/task/getSingle/:taskId',
    requireUser,
    async (req: Request, res: Response, next: NextFunction) => {
      const taskId = req.params.taskId;
      if (!taskId) {
        return next(new createError('taskId is not defined in url', 406));
      }

      const task = await prisma.task.findUnique({
        where: {
          userId: res.locals.user.id,
          id: +taskId,
        },
        select: {
          id: true,
          title: true,
          priority: true,
          taskStatus: true,
          startTime: true,
          endTime: true,
        },
      });
      return res.status(200).json(task);
    },
  );

  app.post(
    '/api/task/edit',
    requireUser,
    async (req: Request, res: Response, next: NextFunction) => {
      const parsedResult = TaskWithIdSchema.safeParse(req.body);
      if (!parsedResult.success) {
        next(parsedResult.error);
        return;
      }

      const task = await prisma.task.update({
        where: {
          userId: res.locals.user.id,
          id: parsedResult.data.id,
        },
        data: {
          title: parsedResult.data.title,
          priority: parsedResult.data.priority,
          taskStatus: parsedResult.data.taskStatus,
          startTime: parsedResult.data.startTime,
          endTime: parsedResult.data.endTime,
        },
        select: {
          id: true,
          title: true,
          priority: true,
          taskStatus: true,
          startTime: true,
          endTime: true,
        },
      });
      return res.status(200).json(task);
    },
  );

  app.get(
    '/api/task/getRawData',
    requireUser,
    async (req: Request, res: Response, next: NextFunction) => {
      const task = await prisma.task.findMany({
        where: {
          userId: res.locals.user.id,
        },
        select: {
          id: true,
          priority: true,
          taskStatus: true,
          startTime: true,
          endTime: true,
        },
      });
      const taskLen = task.length;
      // handle it
      if (!taskLen) {
        return res.status(200).json();
      }
      
      const taskCompleted = task.reduce((count, task) => 
        task.taskStatus === 'Finished' ? count + 1 : count, 0);
      const taskCompletedPer = ((taskCompleted*100)/taskLen).toFixed(0)

      console.log(taskCompletedPer)
      
      const response = { totalTask: task.length };

      return res.status(200).json(response);
    },
  );
}
