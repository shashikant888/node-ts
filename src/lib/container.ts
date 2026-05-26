type Constructor<T = any> = new (...args: any[]) => T;

class Container {
    private instances = new Map<Constructor, any>();
    private dependencies = new Map<Constructor, Constructor[]>();

    register<T>(Class: Constructor<T>, deps: Constructor[] = []) {
        this.dependencies.set(Class, deps);
    }


    get<T>(Class: Constructor<T>): T {
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

export const container = new Container();
