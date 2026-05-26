"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_service_1 = require("./user.service");
const user_controller_1 = require("./user.controller");
const container_1 = require("../../lib/container");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const user_validator_1 = require("./user.validator");
const router = (0, express_1.Router)();
container_1.container.register(user_service_1.UserService);
container_1.container.register(user_controller_1.UserController, [user_service_1.UserService]);
const userController = container_1.container.get(user_controller_1.UserController);
// const userService = new UserService();
// const userController = new UserController(userService);
router.get('/', userController.getUsers);
router.post('/', (0, validate_middleware_1.validate)(user_validator_1.createUserSchema), userController.createUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map