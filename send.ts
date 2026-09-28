import { ServerResponse } from "node:http";

export function send (
    response: ServerResponse,
    statusCode: number,
    body: unknown
): void {
    response.writeHead(
        statusCode,
        {"content-type": "application/json"}
    );
    response.end (JSON.stringify(body));
}