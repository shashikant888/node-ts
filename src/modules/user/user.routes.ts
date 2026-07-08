import { Router } from 'express';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { container } from '../../lib/container';
import { validate } from '../../middlewares/validate.middleware';
import { createUserSchema } from './user.validator';
import { PrismaService } from '../../lib/prisma';
import { DatabaseService } from '../../config/db';

const router = Router();

container.register(DatabaseService);
container.register(PrismaService);
container.register(UserService, [PrismaService, DatabaseService]);
container.register(UserController, [UserService]);

const userController = container.get(UserController);

router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.post('/', validate(createUserSchema), userController.createUser);

export default router;