"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
class UserService {
    async getUsers() {
        // throw new Error('test err!')
        return [{ id: 1, name: 'Shashi' }];
    }
    async createUser(data) {
        return { id: Date.now(), ...data };
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map