import express from "express";
import path from "node:path"
import pool from "./database.ts"

import invoiceRouter from "./invoice.route.ts";

const app = express();
const dist = path.join(import.meta.dirname, "..", "web", "dist");

app.use(function (request, response, next) {
    console.log(request.method + " " + request.url);

    next();
});

app.get("/api/health", async (request, response) {
  const connect = await pool.query("SELECT datname FROM pg_database WHERE oid =5;");
    
    response.status(200).json({
        status: "server ins running",
        database: connect.rows[0].datname
    });
});

app.use("/api/invoices", invoiceRouter);
app.use(express.static(dist));

app.use(function (request, response) {
    response.status(404).json({
        message: "Recurso não encontrado"
    });
});

app.listen(Number(process.env.PORT) || 3001);
