"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./modules/user/user.routes"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const container_1 = require("./lib/container");
const logger_middleware_1 = require("./middlewares/logger.middleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: '*'
}));
app.use(logger_middleware_1.requestLogger);
app.get('/', (req, res) => {
    res.json({ message: 'API is working' });
});
app.use('/users', user_routes_1.default);
app.use(error_middleware_1.default);
console.log({ container: container_1.container });
exports.default = app;
//# sourceMappingURL=app.js.map