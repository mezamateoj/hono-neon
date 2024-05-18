import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { products } from './db/schema';

export type Env = {
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>()
app.notFound((c) => {
  return c.text('Not Found', 404)
})

app.get('/', (c) => {
  return c.json({
    message: 'Hello from hono, try /products'
  })
})

app.get('/products', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);
  const result = await db.select().from(products);
  return c.json({ result });
})


app.onError((error, c) => {
  console.log(error)
  return c.json({ error }, 400)
})


export default app