"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
class Container {
    instances = new Map();
    dependencies = new Map();
    register(Class, deps = []) {
        this.dependencies.set(Class, deps);
    }
    get(Class) {
        if (this.instances.has(Class)) {
            return this.instances.get(Class);
        }
        const deps = this.dependencies.get(Class) || [];
        const injections = deps.map((dep) => this.get(dep));
        const instance = new Class(...injections);
        this.instances.set(Class, instance);
        return instance;
    }
}
exports.container = new Container();
//# sourceMappingURL=container.js.map