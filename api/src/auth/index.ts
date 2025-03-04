import type {
  Express,
  Response,
  Request,
  CookieOptions,
  NextFunction,
} from 'express';
import bcrypt from 'bcrypt';

import { AuthSchema } from './types';
import prisma from '../database';
import { signJWT } from '../utils/jwt';
import { createError } from '../utils/middleware/errorHandling';
import config from '../utils/config';

export const ATCookieOptions: CookieOptions = {
  maxAge: 604800000,
  httpOnly: true,
  sameSite: config.NODE_ENV === 'development' ? 'lax' : 'none',
  secure: config.NODE_ENV === 'development' ? false : true,
};

export default function authRoutes(app: Express): void {
  app.post(
    '/api/auth/login',
    async (req: Request, res: Response, next: NextFunction) => {
      const parsedResult = AuthSchema.safeParse(req.body);
      if (!parsedResult.success) {
        next(parsedResult.error);
        return;
      }
      let userExist = await prisma.user.findUnique({
        where: {
          email: parsedResult.data.email,
        },
      });

      if (!userExist) {
        const hashedPass = await bcrypt.hash(parsedResult.data.password, 10);
        userExist = await prisma.user.create({
          data: {
            email: parsedResult.data.email,
            password: hashedPass,
          },
        });
      }else{
        const matchPass = await bcrypt.compare(parsedResult.data.password, userExist.password)
        if(!matchPass){
          return next(new createError('Invalid password', 401))
        }
      }

      const {password,createdAt,updatedAt, ...user} = userExist;

      if (!user) {
        return next(new createError('failed to create user', 422));
      }
      const accessToken = signJWT(
        { ...user },
        { expiresIn: config.ATTL },
      );
      const refreshToken = signJWT(
        { ...user },
        { expiresIn: config.RTTL },
      );

      const RTCookieOptions: CookieOptions = {
        ...ATCookieOptions,
        maxAge: 3.154e10, // 1 year
      };

      res.cookie('accessToken', accessToken, ATCookieOptions);
      res.cookie('refreshToken', refreshToken, RTCookieOptions);

      return res.status(201).json({ success: true });
    },
  );
}
