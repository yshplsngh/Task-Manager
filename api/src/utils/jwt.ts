import jwt from 'jsonwebtoken';
import config from '../utils/config';
import prisma from '../database';

export const signJWT = (
  user: object,
  options?: jwt.SignOptions | undefined,
) => {
  console.log(user);
  const ans = jwt.sign(user, config.AT_SECRET, { ...(options && options) });
  return ans;
};

interface CustomJwtPayload extends jwt.JwtPayload {
  email: string;
}

export const validateToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, config.AT_SECRET) as CustomJwtPayload;
    const updatedInfo = await prisma.user.findUnique({
      where: {
        email: decoded.email,
      },
      select: {
        email: true,
      },
    });
    // user does not present in db
    if (!updatedInfo) {
      return {
        expired: false,
        decoded: null,
      };
    }
    return {
      expired: false,
      decoded: { ...decoded, email: updatedInfo.email },
    };
  } catch (error) {
    return {
      expired: true,
      decoded: null,
    };
  }
};

export const reIssueAccessToken = async (refreshToken: string) => {
  //check RT
  const { decoded, expired } = await validateToken(refreshToken);
  if (expired || decoded === null) {
    return false;
  }
  const userExist = await prisma.user.findUnique({
    where: {
      email: decoded.email,
    },
    select: {
      id:true,
      email: true,
    },
  });
  if (!userExist) {
    return false;
  }
  return signJWT({ ...userExist }, { expiresIn: config.ATTL });
};
