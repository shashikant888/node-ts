import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { UserService } from './user.service';
import { successResponse } from '../../utils/response';
import { logger } from '../../utils/logger';

export class UserController {
  constructor(private userService: UserService) {}

  getUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await this.userService.getUsers();
    res.json(successResponse(users));
  });

  getUser = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const user = await this.userService.getUserById(id);
    res.json(successResponse(user));
  });

  createUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.userService.createUser(req.body);    
    res.json(successResponse(user, 'user created'));
  });
}
