import { Router } from "itty-router";

const router = Router();

router
	.get("/api", () => new Response("Hello World", { status: 200 }))
	.get("*", () => new Response("Not found", { status: 404 }));

export const handleRequest = (request: any) => router.handle(request);
