// Middleware per trajtimin e erroreve
const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Logimi i errorit per zhvilluesit
    console.error('ERROR:', err);

    // Pergjigja per perdoruesit
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message || 'Ndodhi nje gabim i papritur',
        ...(process.env.NODE_ENV === 'development' && { error: err, stack: err.stack })
    });
};

export default errorMiddleware;