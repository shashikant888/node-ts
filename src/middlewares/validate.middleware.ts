import { NextFunction, Request, Response } from 'express';
import { ZodType } from 'zod';

export const validate = (schema: ZodType<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (err: any) {
            next(err)
        }
    }
}
