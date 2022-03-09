import Pool from "pg";

const pool = new Pool.Pool({
  user: "postgres",
  password: "24972497Vlad",
  host: "localhost",
  port: 5432,
  database: "nodets_postgres",
});

export default pool;
