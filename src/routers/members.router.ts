import { Router as router } from 'express';
import { MembersController } from '../controllers/members.controller.js';
import { Interceptors } from '../interceptors/interceptors.js';
import { MemberMongoRepo } from '../repository/members.mongo.repo.js';

export const membersRouter = router();
const repo = MemberMongoRepo.getInstance();
const controller = new MembersController(repo);

membersRouter.get('/', controller.getAll.bind(controller));
membersRouter.post('/register', controller.register.bind(controller));
membersRouter.post('/login', controller.login.bind(controller));
membersRouter.patch(
  '/add_friend',
  Interceptors.logged,
  controller.addFriend.bind(controller)
);
membersRouter.patch(
  '/add_enemy',
  Interceptors.logged,
  controller.addEnemy.bind(controller)
);
membersRouter.patch(
  '/remove_friend',
  Interceptors.logged,
  controller.removeFriend.bind(controller)
);
membersRouter.patch(
  '/remove_enemy',
  Interceptors.logged,
  controller.removeEnemy.bind(controller)
);

membersRouter.patch(
  '/edit_profile',
  Interceptors.logged,
  Interceptors.authorized,
  controller.editProfile.bind(controller)
);

membersRouter.patch(
  '/delete_member',
  Interceptors.logged,
  Interceptors.authorized,
  controller.deleteMember.bind(controller)
);
