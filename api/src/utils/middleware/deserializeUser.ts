import { NextFunction, Request, Response } from 'express';
import { reIssueAccessToken, validateToken } from '../jwt';
import { ATCookieOptions } from '../../auth';

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;

  if (!accessToken) {
    return next();
  }

  const { decoded, expired } = await validateToken(accessToken);
  //if AT is not expired then set user detail from jwt in res
  if (!expired && decoded) {
    res.locals.user = decoded;
    return next();
  }

  // reissure AT if RT is present and and AT is expired
  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken(refreshToken);
    if (!newAccessToken) {
      return next();
    } else {
      res.cookie('accessToken', newAccessToken, ATCookieOptions);
      const { decoded } = await validateToken(newAccessToken);
      res.locals.user = decoded;
    }
  }
  return next();
};
