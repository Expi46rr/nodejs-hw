import { HttpError } from 'http-errors';
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  const isProd = process.env.NODE_ENV === 'production';
   if (err instanceof HttpError) {
    return res.status(err.statusCode ?? err.status).json({
      message: err.message || err.name,
    });
  }
  res.status(500).json({
    message: isProd ? "Oops something wrong" : err.message


  });
};
