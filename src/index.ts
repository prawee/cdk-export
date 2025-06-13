import { serve } from '@hono/node-server'
import 'dotenv/config'
import app from './app'

serve({
    fetch: app.fetch,
    port: Number(process.env.PORT) || 3000
}, (info) => {
    console.log(`Server running on port ${info.port}`);
});