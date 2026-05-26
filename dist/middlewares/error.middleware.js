"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const logger_1 = require("../utils/logger");
exports.default = (err, req, res, next) => {
    logger_1.logger.error(err);
    if (err instanceof zod_1.ZodError) {
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
};
//# sourceMappingURL=error.middleware.js.map