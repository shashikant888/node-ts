"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (data, message) => {
    return {
        success: true,
        message: message || '',
        data
    };
};
exports.successResponse = successResponse;
const errorResponse = (message) => {
    return {
        success: false,
        message
    };
};
exports.errorResponse = errorResponse;
//# sourceMappingURL=response.js.map