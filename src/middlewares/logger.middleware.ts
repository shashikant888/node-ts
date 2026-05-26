import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    logger.info({
        method: req.method,
        url: req.url,
        parmas: req.params,
        body: req.body,
    }, 'Incoming request');
    
    next();
}
