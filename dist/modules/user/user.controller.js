"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const response_1 = require("../../utils/response");
class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    getUsers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const users = await this.userService.getUsers();
        res.json((0, response_1.successResponse)(users));
    });
    createUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const user = await this.userService.createUser(req.body);
        res.json((0, response_1.successResponse)(user, 'user created'));
    });
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map