import type { Response, Request, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
  if (res.locals && res.locals.user && res.locals.user.email) {
    next();
  } else {
    return res
      .status(401)
      .json({ error: 'Unauthorized', message: 'Unauthorized' });
  }
};
