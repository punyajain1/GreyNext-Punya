import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8080;

// Middleware
// Request logger (added by intern for debug visibility)
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' })); // Allow large payloads for base64 images

// Routes
import extractAnswersRouter from './routes/extract-answers';
import extractQuestionsRouter from './routes/extract-questions';
import generateRubricsRouter from './routes/generate-rubrics';
import gradeRouter from './routes/grade';
import reconcileRouter from './routes/reconcile';

app.use('/api/extract-answers', extractAnswersRouter);
app.use('/api/extract-questions', extractQuestionsRouter);
app.use('/api/generate-rubrics', generateRubricsRouter);
app.use('/api/grade', gradeRouter);
app.use('/api/reconcile', reconcileRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    version: process.env.npm_package_version || '1.0.0',
    env: process.env.NODE_ENV || 'development',
  });
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
