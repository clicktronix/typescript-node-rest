import { Router } from 'express';

import { userRoutes } from './UserRoutes';
import { authRoutes } from './AuthRoutes';

export const router = Router()
  .use('/', authRoutes)
  .use('/users', userRoutes);
