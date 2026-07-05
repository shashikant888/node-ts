import { Pool } from "pg"

export const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'shashi',
    database: 'node_ts_db'
})