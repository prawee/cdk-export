import { handle } from 'hono/aws-lambda'
import 'dotenv/config'
import app from './app'
export const handler = handle(app)