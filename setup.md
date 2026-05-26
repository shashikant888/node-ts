````md
# 🚀 Node.js + TypeScript + Express (Production Setup Guide)

This guide walks through building a **production-ready backend** step-by-step,
understanding *why each piece exists* (like NestJS internals).

---

# 🧱 1. Project Setup

## Install dependencies

```bash
pnpm add express
pnpm add -D typescript ts-node-dev @types/node @types/express eslint prettier
````

---

# ⚙️ 2. TypeScript Config

```bash
npx tsc --init
```

## Key settings

* `"module": "NodeNext"` → ESM support
* `"rootDir": "src"` → source code
* `"outDir": "dist"` → compiled output
* `"strict": true` → strong typing

---

# 📦 3. Scripts

```json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

## Why

* `--respawn` → auto restart server
* `--transpile-only` → faster dev (skip type checking)

---

# 📁 4. Project Structure

```
src/
  app.ts
  server.ts
  modules/
    user/
      user.routes.ts
      user.controller.ts
      user.service.ts
```

---

# 🌐 5. Express Setup

## app.ts

```ts
import express from 'express';

const app = express();

app.use(express.json());

export default app;
```

## server.ts

```ts
import app from './app.js';

app.listen(3000, () => {
  console.log('Server running');
});
```

---

# 🧠 6. Layered Architecture

```
Route → Controller → Service
```

---

# 📄 Controller

Handles HTTP (req/res)

---

# 📄 Service

Handles business logic

---

# 🛠️ 7. Async Error Handling

## Problem

Repeated try/catch ❌

---

## Solution

### asyncHandler

```ts
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
```

---

# ❗ 8. Global Error Middleware

```ts
import { ZodError } from 'zod';

export default (err, req, res, next) => {
  if (err instanceof ZodError) {
    const message = err.issues.map(e => e.message).join(', ');
    return res.status(400).json({ success: false, message });
  }

  res.status(500).json({
    success: false,
    message: err.message || 'Internal error'
  });
};
```

## IMPORTANT

👉 Must be **last middleware**

---

# 🧪 9. Validation (Zod)

```bash
pnpm add zod
```

## Example

```ts
import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required')
});
```

---

## Middleware

```ts
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    next(err);
  }
};
```

---

# 🔁 10. Dependency Injection (Manual)

## Service

```ts
export class UserService {}
```

## Controller

```ts
export class UserController {
  constructor(private userService: UserService) {}
}
```

---

# 🧱 11. DI Container

```ts
class Container {
  private instances = new Map();
  private dependencies = new Map();

  register(Class, deps = []) {
    this.dependencies.set(Class, deps);
  }

  get(Class) {
    if (this.instances.has(Class)) {
      return this.instances.get(Class);
    }

    const deps = this.dependencies.get(Class) || [];
    const injections = deps.map(dep => this.get(dep));

    const instance = new Class(...injections);

    this.instances.set(Class, instance);
    return instance;
  }
}
```

---

# 📊 12. Response Standardization

```ts
export const successResponse = (data, message) => ({
  success: true,
  data,
  message: message || null
});
```

---

# 📦 13. Logging

```bash
pnpm add pino
pnpm add -D pino-pretty
```

## logger.ts

```ts
import pino from 'pino';

const isProd = process.env.NODE_ENV === 'production';

export const logger = pino(
  isProd
    ? {}
    : {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true }
        }
      }
);
```

---

# 🔐 14. Security

```bash
pnpm add helmet cors
pnpm add -D @types/cors
```

## app.ts

```ts
import helmet from 'helmet';
import cors from 'cors';

app.use(helmet());
app.use(cors());
```

---

# ⚙️ 15. Environment Config

```bash
pnpm add dotenv
```

## env.ts

```ts
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const schema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production']).default('development')
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error(parsed.error);
  process.exit(1);
}

export const ENV = parsed.data;
```

---

# 📡 16. Request Logging Middleware

```ts
export const requestLogger = (req, res, next) => {
  logger.info({ method: req.method, url: req.url }, 'Incoming request');
  next();
};
```

---

# 🧱 17. Final Architecture

```
Request
  ↓
Middleware (logging, validation)
  ↓
Controller
  ↓
Service
  ↓
Repository (optional)
  ↓
Database
```

---

# 🧠 Key Learnings

* Express is unopinionated
* You built:

  * DI system
  * Validation layer
  * Error handling
  * Logging system

👉 This is what frameworks like NestJS automate.

---

# 🚀 Next Steps

* Database (Prisma)
* Caching (Redis)
* Queues (BullMQ)
* Rate limiting
* Auth (JWT)

---

# 💡 Golden Rules

* Keep layers separated
* Never trust input (validate)
* Centralize errors
* Log everything important
* Use env configs
* Avoid tight coupling (use DI)

---

# 🎯 You now have

👉 A production-ready backend foundation
