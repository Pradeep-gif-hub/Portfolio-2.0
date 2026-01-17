import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'

// Load .env.local for server-side API handlers
dotenv.config({ path: '.env.local' });

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'vite-api-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          try {
            if (!req.url || !req.url.startsWith('/api/')) return next();

            // normalize and strip prefix
            const url = req.url.split('?')[0];
            const apiPath = url.replace(/^\/api\//, '');
            const parts = apiPath.split('/').filter(Boolean);

            // candidate files to try
            const candidates: string[] = [];
            const base = path.join(process.cwd(), 'api');

            // try direct ts file: api/<path>.ts
            candidates.push(path.join(base, ...parts) + '.ts');
            candidates.push(path.join(base, ...parts) + '.js');

            // try index.ts inside folder: api/<path>/index.ts
            candidates.push(path.join(base, ...parts, 'index.ts'));
            candidates.push(path.join(base, ...parts, 'index.js'));

            // fallback: api/<firstPart>.ts
            candidates.push(path.join(base, parts[0] + '.ts'));
            candidates.push(path.join(base, parts[0] + '.js'));

            let modulePath: string | null = null;
            for (const c of candidates) {
              if (fs.existsSync(c)) {
                modulePath = c;
                break;
              }
            }

            if (!modulePath) {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'API route not found', path: req.url }));
              return;
            }

            // load module via Vite SSR loader
            const mod = await server.ssrLoadModule(modulePath);
            const handler = mod && (mod.default || mod.handler);

            if (typeof handler !== 'function') {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'API handler not found or invalid', path: modulePath }));
              return;
            }

            // parse query params
            const qIndex = req.url.indexOf('?');
            (req as any).query = {};
            if (qIndex >= 0) {
              const qs = req.url.slice(qIndex + 1);
              const params = new URLSearchParams(qs);
              params.forEach((v, k) => { (req as any).query[k] = v; });
            }

            // collect body if needed
            const collectBody = () => new Promise<void>((resolve) => {
              const chunks: Buffer[] = [];
              req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
              req.on('end', () => {
                const raw = Buffer.concat(chunks).toString();
                try {
                  (req as any).body = raw ? JSON.parse(raw) : {};
                } catch (e) {
                  (req as any).body = raw;
                }
                resolve();
              });
              req.on('error', () => resolve());
            });

            if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
              await collectBody();
            }

            // minimal response helpers
            (res as any).status = (code: number) => { res.statusCode = code; return res; };
            (res as any).json = (obj: any) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)); };
            (res as any).send = (obj: any) => { if (typeof obj === 'object') { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)); } else { res.end(String(obj)); } };
            (res as any).setHeader = res.setHeader;

            // execute handler
            await handler(req, res);
          } catch (err: any) {
            console.error('[vite-api] handler error', err && err.stack ? err.stack : err);
            if (!res.headersSent) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err?.message || String(err) }));
            }
          }
        });
      }
    }
  ]
})
