import type { Express, Response, Request } from 'express';
import bcrypt from 'bcrypt'

import { AuthSchema } from './types';
import prisma from '../database';

export default function authRoutes(app: Express): void {

  app.get('api/auth/login',async (req: Request, res: Response, next) => {
    const parsedResult = AuthSchema.safeParse(req.body);
    if (!parsedResult.success) {
      next(parsedResult.error);
      return;
    }
    const userExist = await prisma.user.findUnique({
      where:{
        email:parsedResult.data.email
      }
    })
    if(!userExist){
      const hashedPass = await bcrypt.hash(parsedResult.data.password,10);
      const user = await prisma.user.create({
        data:{
          email:parsedResult.data.email,
          password:hashedPass
        }
      })
    }

  })
}
