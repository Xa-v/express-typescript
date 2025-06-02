export default errorHandler;


function errorHandler(err: any, req: any, res: any, next: any) {
    switch(true) {
        case typeof err === 'string':
            const is404 = err.toLowerCase().endsWith('not found');
            const statusCode = is404 ? 404 : 400;
            return res.status(statusCode).json({message: err});
        default:
            return res.status(500).json({message: err.message});
    }
}

