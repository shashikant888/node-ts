import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { UserService } from './user.service';
import { successResponse } from '../../utils/response';

export class UserController {
  constructor(private userService: UserService) {}

  getUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await this.userService.getUsers();
    res.json(successResponse(users));
  });

  createUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.userService.createUser(req.body);
    res.json(successResponse(user, 'user created'));
  });
}