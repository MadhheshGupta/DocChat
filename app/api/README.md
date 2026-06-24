# API Notes

This app does not include a backend API. Document parsing and model requests run directly in the browser.

OpenRouter uses `NEXT_PUBLIC_OPENROUTER_API_KEY`, which means the key is bundled for client-side use and is visible to anyone using the app. This is convenient for local demos, but it is not secure for production secrets.

For production, proxy OpenRouter requests through a Next.js API route. Keep the real API key in a server-only environment variable, validate requests on the server, and call OpenRouter from that route instead of from client components.
