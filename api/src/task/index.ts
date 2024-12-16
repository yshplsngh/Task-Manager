import type { Express, Request, Response, NextFunction } from 'express';
import requireUser from '../utils/middleware/requireUser';
import { TaskSchema, TaskWithIdSchema } from './types';
import prisma from '../database';
import { createError } from '../utils/middleware/errorHandling';
import dayjs from 'dayjs';

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

      const taskCompleted = task.reduce(
        (count, task) => (task.taskStatus === 'Finished' ? count + 1 : count),
        0,
      );
      const taskCompletedPer = ((taskCompleted * 100) / taskLen).toFixed(0);

      const tal = {
        1: { pendingTasks: 0, totalTimeInMin: 0, remainingTime: 0 },
        2: { pendingTasks: 0, totalTimeInMin: 0, remainingTime: 0 },
        3: { pendingTasks: 0, totalTimeInMin: 0, remainingTime: 0 },
        4: { pendingTasks: 0, totalTimeInMin: 0, remainingTime: 0 },
        5: { pendingTasks: 0, totalTimeInMin: 0, remainingTime: 0 },
      };

      const calculateDuration = (startTime: string, endTime: string) => {
        const start = dayjs(startTime);
        const end = dayjs(endTime);
        const minutes = end.diff(start, 'minute');
        return minutes > 0 ? minutes : 0;
      };

      task.forEach((task) => {
        if (task.taskStatus === 'Pending') {
          // we just want total time for pending task only
          tal[task.priority].pendingTasks++;

          tal[task.priority].totalTimeInMin += calculateDuration(
            task.startTime,
            task.endTime,
          );

          // here we calculating remaining time, so need to give current in ISOstring
          tal[task.priority].remainingTime += calculateDuration(
            dayjs().toISOString(),
            task.endTime,
          );
        }
      });
      
      console.log(tal);

      const response = {
        totalTask: task.length,
        tasksCompleted: Number(taskCompletedPer),
        tasksPending: 100 - Number(taskCompletedPer),
        pendingTasks: taskLen - taskCompleted,
      };

      return res.status(200).json(response);
    },
  );
}
