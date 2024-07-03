import { Hono } from 'hono';
import authRoute from './routes/auth.route';
import blogsRoute from './routes/blogs.route';
import portfolioRoute from './routes/portfolio.route';
import tokenCheck from '../middleware/tokenCheck';
import projectRoute from './routes/project.route';
import dropboxRoute from './routes/dropbox.route';

import { cors } from 'hono/cors'

const app = new Hono();

app.use('*', cors())

// app.use('/blogs/*', tokenCheck)

app.get('/', async (ctx) => ctx.json({
	message: 'Unauthorized Access!!',
}, 401));


app.route('/auth', authRoute)
app.route('/blogs', blogsRoute)
app.route('/portfolio', portfolioRoute)
app.route('/projects', projectRoute)
app.route('/dropbox', dropboxRoute)

export default app