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

---

# 🔌 18. PostgreSQL + Prisma VM Setup (Production Ready)

Unlike serverless deployments (which open database connections on-demand and close them quickly), **VM (Virtual Machine) or VPS deployments** run a persistent Node.js server. 

To handle traffic robustly on a VM without exhausting database connections, we use a custom connection pool coupled with Prisma 7+.

## Why `@prisma/adapter-pg`?
In **Prisma 7 and later**, the client engine was decoupled from database drivers. For standard PostgreSQL VM connections, Prisma **mandates** a driver adapter. We use `@prisma/adapter-pg` paired with Node's standard `pg.Pool`.

### Step 1: Install Database Dependencies
```bash
pnpm add @prisma/client pg @prisma/adapter-pg
pnpm add -D prisma @types/pg
```

### Step 2: Set up Database Schema
Create `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

### Step 3: Production Connection Utility (`prisma.ts`)
Create a custom pool and client instance inside `src/lib/prisma.ts`. This controls pool limits (`max`) and connection timeouts to prevent overloading your PostgreSQL instance.

```typescript
import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import { logger } from "../utils/logger";

const connectionString = process.env.DATABASE_URL;

// Connection Pool config for VM
const pool = new Pool({
  connectionString,
  max: 10,                 // Maximum active connections in pool
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 2000, // Fail fast if connection takes > 2s
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
  log: [
    { emit: "event", level: "query" },
    { emit: "event", level: "info" },
    { emit: "event", level: "warn" },
    { emit: "event", level: "error" },
  ],
});

// Bind Prisma's event logs to Pino
prisma.$on("query" as any, (e: any) => {
  logger.debug({ query: e.query, params: e.params, duration: `${e.duration}ms` }, "Prisma Query");
});
prisma.$on("info" as any, (e: any) => logger.info(e.message));
prisma.$on("warn" as any, (e: any) => logger.warn(e.message));
prisma.$on("error" as any, (e: any) => logger.error(e.message));
```

### Step 4: Eager Startup Check & Graceful Shutdown (`server.ts`)
In production, your server should **fail-fast** if it cannot reach the database on boot, and **clean up connections** when it terminates.

```typescript
import app from './app';
import { ENV } from './config/env';
import { prisma, pool } from './lib/prisma';
import { logger } from './utils/logger';

async function startServer() {
  try {
    logger.info("Connecting to database...");
    
    // Test the database connection eagerly on boot
    await prisma.$connect();
    logger.info("Database connection established successfully.");

    const server = app.listen(ENV.PORT, () => {
      logger.info(`🚀 Server running on port ${ENV.PORT}`);
    });

    // Handle graceful shutdowns (kills active pools cleanly)
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);
      server.close(async () => {
        logger.info("HTTP server closed.");
        await prisma.$disconnect();
        await pool.end(); // Closes standard pg pool
        logger.info("Database connection closed cleanly.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

  } catch (error) {
    logger.error({ err: error }, "Failed to connect to the database on startup");
    process.exit(1);
  }
}

startServer();
```

---

# 🚀 19. Commands Reference

* **Validate Schema:** `pnpm prisma validate`
* **Generate Types:** `pnpm prisma generate`
* **Push Local Schema to DB:** `pnpm prisma db push`
* **Create Production Database Migration:** `pnpm prisma migrate dev --name <migration_name>`
