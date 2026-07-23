import createHttpError from 'http-errors';
import { Session } from '../models/session';
import { User } from '../models/user.js';
export const authenticate = async (req, res, next) => {
  const { sessionId, accessToken } = req.cookies;
  if (!sessionId || !accessToken) {
    throw createHttpError(401, 'Missing tokens');
  }
  const session = await Session.findOne({
    _id: sessionId,
    accessToken,
  });
  if (!session) {
    throw createHttpError(401, 'Missing session');
  }
  const isAccessTokenExpired = session.accessTokenValidUntil < new Date();
  if (isAccessTokenExpired) {
    throw createHttpError(401, 'Token expired');
  }
  const user = await User.findOne({ _id: session.userId });
  if (!user) {
    throw createHttpError(401, 'User not found');
  }
  req.user = user;
  next();
};
