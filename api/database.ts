import { Pool } from "pg"

if (!process.env.DATABASE_URL) throw new Error(" A variavel DATABASE_URL não esta disponível");

const pool = new Pool({connectionString: process.env.DATABASE_URL });

export default pool;