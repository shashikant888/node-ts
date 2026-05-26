import { Router } from 'express';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { container } from '../../lib/container';
import { validate } from '../../middlewares/validate.middleware';
import { createUserSchema } from './user.validator';

const router = Router();

container.register(UserService);
container.register(UserController, [UserService])

const userController = container.get(UserController)

// const userService = new UserService();
// const userController = new UserController(userService);

router.get('/', userController.getUsers);
router.post('/', validate(createUserSchema), userController.createUser);

export default router;