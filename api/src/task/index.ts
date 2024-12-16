import type { Express, Request, Response, NextFunction } from 'express';
import requireUser from '../utils/middleware/requireUser';
import { TaskSchema, TaskWithIdSchema } from './types';
import prisma from '../database';
import { createError } from '../utils/middleware/errorHandling';
import dayjs from 'dayjs';
import type { Prisma } from '@prisma/client';

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
      await prisma.task.create({
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
    const { status } = req.query;

    const whereCondition: Prisma.TaskWhereInput = {
      userId: res.locals.user.id,
    };

    if (status && (status === 'Finished' || status === 'Pending')) {
      whereCondition.taskStatus = status;
    }

    const task = await prisma.task.findMany({
      where: whereCondition,
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

      await prisma.task.update({
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
      return res.status(201).json({ success: true });
    },
  );

  app.get(
    '/api/task/getRawData',
    requireUser,
    async (req: Request, res: Response) => {
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

      const calculateDuration = (startTime: string, endTime: string) => {
        const start = dayjs(startTime);
        const end = dayjs(endTime);
        const minutes = end.diff(start, 'minute');
        return minutes > 0 ? minutes : 0;
      };

      let calPendingTasks = 0;
      let calTotalTimeLapsed = 0;
      let calTotalTimeToFinish = 0;

      type TaskAnalytics = {
        priority: number;
        pendingTasks: number;
        taskTimeInMin: number;
        remainingTimeInMin: number;
      };

      const tableStats = task.reduce(
        (acc: Record<number, TaskAnalytics>, task) => {
          // from 1 to 5
          const taskPriority = task.priority;

          if (task.taskStatus === 'Pending') {
            if (!acc[taskPriority]) {
              acc[taskPriority] = {
                priority: taskPriority,
                pendingTasks: 0,
                remainingTimeInMin: 0,
                taskTimeInMin: 0,
              };
            }

            acc[taskPriority].pendingTasks++;
            calPendingTasks++;

            acc[taskPriority].taskTimeInMin += calculateDuration(
              task.startTime,
              task.endTime,
            );
            calTotalTimeLapsed += calculateDuration(
              task.startTime,
              task.endTime,
            );

            // here we calculating remaining time, so need to give current time in ISOstring
            acc[taskPriority].remainingTimeInMin += calculateDuration(
              dayjs().toISOString(),
              task.endTime,
            );
            calTotalTimeToFinish += calculateDuration(
              dayjs().toISOString(),
              task.endTime,
            );
          }

          return acc;
        },
        {} as Record<number, TaskAnalytics>, // initial value of acc
      );

      const calTasksPendingPer =
        Math.round((calPendingTasks * 100) / taskLen) || 0;

      const response = {
        totalTask: task.length,
        tasksCompleted: calTasksPendingPer === 0 ? 0 : 100 - calTasksPendingPer,
        tasksPending: calTasksPendingPer || 0,
        averageTimePerTask:
          Math.round(calTotalTimeLapsed / calPendingTasks) || 0,
        pendingTasks: calPendingTasks,
        totalTimeLapsed: calTotalTimeLapsed,
        totalTimeToFinish: calTotalTimeToFinish,
        tableData: tableStats,
      };

      return res.status(200).json(response);
    },
  );
}
