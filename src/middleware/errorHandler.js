import { isHttpError } from 'http-errors';
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  const isProd = process.env.NODE_ENV === 'production';
  if (isHttpError(err)) {
    return res.status(err.status).json({
      message: err.message || err.name
    });
  };
  res.status(500).json({
    message: isProd ? "Oops something wrong" : err.message


  });
};
