import express from "express";
import path from "node:path"

import invoiceRouter from "./invoice.route.ts";

const app = express();
const dist = path.join(import.meta.dirname, "..", "web", "dist");

app.use(function (request, response, next) {
    console.log(request.method + " " + request.url);

    next();
});

app.get("/api/health", function (request, response) {
    response.status(200).json({
        status: "ok"
    });
});

app.use("/api/invoices", invoiceRouter);
app.use(express.static(dist));

app.use(function (request, response) {
    response.status(404).json({
        message: "Recurso não encontrado"
    });
});

app.listen(3001);
