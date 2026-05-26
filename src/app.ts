import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import userRoutes from './modules/user/user.routes'
import errorMiddleware from './middlewares/error.middleware';
import { container } from './lib/container';
import { requestLogger } from './middlewares/logger.middleware';

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: '*'
}));
app.use(requestLogger)

app.get('/', (req, res) => {
  res.json({ message: 'API is working' });
});

app.use('/users', userRoutes);

app.use(errorMiddleware)

console.log({ container })

export default app;