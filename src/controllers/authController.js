import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import { createSession, setSessionCookies } from '../services/auth.js';
import { Session } from '../models/session.js';
import { sendEmail } from '../utils/sendMail.js';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  const createdUser = await User.findOne({ email: req.body.email });
  if (createdUser) {
    throw createHttpError(400, 'User with this email alredy created');
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = await User.create({
    email: req.body.email,
    password: hashedPassword,
  });
  const newSession = await createSession(user._id);
  setSessionCookies(res, newSession);

  res.status(201).json({ user });
};

export const loginUser = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password,
  );
  console.log(req.body.password, user.password);

  if (!isValidPassword) {
    throw createHttpError(401, 'Invalid credentials');
  }
  await Session.deleteOne({ userId: user._id });

  const newSession = await createSession(user._id);
  setSessionCookies(res, newSession);
  res.status(200).json({ user });
};

export const logoutUser = async (req, res) => {
  if (req.cookies.sessionId) {
    await Session.deleteOne({ _id: req.cookies.sessionId });
  }
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.status(204).send();
};

export const refreshUserSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;
  if (!sessionId || !refreshToken) {
    throw createHttpError(401, 'Missing tokens');
  }

  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) {
    throw createHttpError(401, 'Missing session');
  }

  const isRefreshTokenExpired = session.refreshTokenValidUntil < new Date();

  if (isRefreshTokenExpired) {
    await session.deleteOne();
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');
    throw createHttpError(401, 'Session expired');
  }

  await session.deleteOne();
  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);
  res.status(200).json({ massage: 'Refresh success' });
};

export const requestResetEmail = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(200).json({ message: 'Success' });
  }
  const token = jwt.sign(
    { email: req.body.email, sub: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '15m' },
  );

  const frontEnd = `my-app.com/reset-pwd?token=${token}`;
  try {
    await sendEmail({
      from: process.env.SMTP_FROM,
      to: req.body.email,
      subject: 'Reset your password',
      html: '<p>RESET PASSWORD EMAIL BODY</p>',
    });
  } catch {
    throw createHttpError(500, 'Something want wrong');
  }

  res.status(200).json({});
};
export const resetPassword = async (req, res) => {
  const { password, token } = req.body;
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw createHttpError(401, 'Invalid token');
  }

  const user = await User.findOne({ _id: payload.sub, email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User no found');
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  await User.updateOne({ _id: user._id }, { password: hashedPassword });

  await Session.deleteMany({ userId: user._id });
  res.status(200).json({
    message: 'Reset password!',
  });
};
