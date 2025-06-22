import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import usersRoutes from './routes/usersRoutes.js';
import questionsRoutes from './routes/questionsRoutes.js';

const PORT = process.env.PORT || 5501;

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  exposedHeaders: ['Authorization']
};

const app = express();

app.use(express.json());
app.use(cors(corsOptions));

app.use('/users', usersRoutes);
app.use('/questions', questionsRoutes);

app.use((req, res) => {
  res.status(404).send({ error: 'Your requested route does not exist.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});