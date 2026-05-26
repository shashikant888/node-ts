import dotenv from 'dotenv';
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default('3000'),
    NODE_ENV: z.enum(['development', 'production']).default('development'),
})

const parsed = envSchema.safeParse(process.env);

if(!parsed.success){
    console.error('Invalid enviroment variables: ', parsed.error.format());
    process.exit(1);
}

export const ENV = parsed.data;
