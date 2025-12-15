import express, { Express } from 'express';
import cors from 'cors';
import routes from './routes';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { errorHandler } from './middlewares/errorHandler';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Error handlers (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

