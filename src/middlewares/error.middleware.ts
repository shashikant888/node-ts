import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../utils/logger";

export default (err: unknown, req: Request, res: Response, next: NextFunction) => {
    logger.error(err)

    if (err instanceof ZodError) {
        const message = err.issues
            .map((e) => `'${e.path.join('.')}' > ${e.message}`)
            .join(', ');

        return res.status(400).json({
            success: false,
            message
        });
    }

    if (err instanceof Error) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }

    return res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
}
