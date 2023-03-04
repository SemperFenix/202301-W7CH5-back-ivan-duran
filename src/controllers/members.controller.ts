import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { Member } from '../entities/member';
import { HTTPError } from '../errors/http.error';
import { CustomRequest } from '../interceptors/interceptors';
import { Repo } from '../repository/repo.interface';
import { Auth, TokenPayload } from '../services/auth';

const debug = createDebug('W7B:MembersController');

export class MembersController {
  // eslint-disable-next-line no-unused-vars
  constructor(public repo: Repo<Member>) {
    debug('Members controller instantiated...');
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      debug('Registering...');

      if (!req.body.email || !req.body.password)
        throw new HTTPError(401, 'Unathorized', 'No email or pass provided');
      req.body.password = await Auth.hash(req.body.password);
      const newMember = this.repo.create(req.body);
      req.body.friends = [];
      req.body.enemies = [];
      res.status(201);
      res.json({ results: [newMember] });
    } catch (error) {
      debug('Register error =(');
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      debug('Logging in...');
      const { email, password } = req.body;
      if (!email || !password)
        throw new HTTPError(401, 'Unauthorized', 'Invalid email or password');
      const member = await this.repo.search([{ key: 'email', value: email }]);
      if (!member.length)
        throw new HTTPError(401, 'Unauthorized', 'Invalid email or password');
      const tokenPayload: TokenPayload = {
        id: member[0].id,
        email: member[0].email,
        role: 'user',
      };
      const token = Auth.createToken(tokenPayload);
      debug('Login successful! =D');
      res.json({ results: [{ token }] });
    } catch (error) {
      debug('Login error =(');
      next(error);
    }
  }

  async addFriend(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      // Coger la id del miembro loggeado
      if (!req.member?.id || !req.body.id)
        throw new HTTPError(404, 'User not found', 'User not found');
      const loggedUserId = req.member?.id;
      // Coger del body el id del miembro a añadir
      const userToAddId = req.body.id;
      // Traer el miembro logeado con su id
      const loggedUser = await this.repo.queryById(loggedUserId);
      // Traer al miembro a añadir con su id
      const userToAdd = await this.repo.queryById(userToAddId);
      // Añadir a la propiedad friends de cada miembro al otro
      loggedUser.friends = [...loggedUser.friends, userToAdd];
      userToAdd.friends = [...userToAdd.friends, loggedUser];
      // Update del miembro loggeado y del miembro a añadir
      const memberUpdated = await this.repo.update(loggedUser);
      this.repo.update(userToAdd);
      // Devolver el usuario loggeado actualizado
      res.json({ results: [memberUpdated] });
    } catch (error) {
      next(error);
    }
  }

  async addEnemy(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      // Coger la id del miembro loggeado
      if (!req.member?.id || !req.body.id)
        throw new HTTPError(404, 'User not found', 'User not found');
      const loggedUserId = req.member?.id;
      // Coger del body el id del miembro a añadir
      const userToAddId = req.body.id;
      // Traer el miembro logeado con su id
      const loggedUser = await this.repo.queryById(loggedUserId);
      // Traer al miembro a añadir con su id
      const userToAdd = await this.repo.queryById(userToAddId);
      // Añadir a la propiedad friends de cada miembro al otro
      loggedUser.enemies = [...loggedUser.enemies, userToAdd];
      userToAdd.enemies = [...userToAdd.enemies, loggedUser];
      // Update del miembro loggeado y del miembro a añadir
      const memberUpdated = await this.repo.update(loggedUser);
      this.repo.update(userToAdd);
      // Devolver el usuario loggeado actualizado
      res.json({ results: [memberUpdated] });
    } catch (error) {
      next(error);
    }
  }

  async removeFriend(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      // Coger la id del miembro loggeado
      if (!req.member?.id || !req.body.id)
        throw new HTTPError(404, 'User not found', 'User not found');
      const loggedUserId = req.member?.id;
      // Coger del body el id del miembro a añadir
      const userToAddId = req.body.id;
      // Traer el miembro logeado con su id
      const loggedUser = await this.repo.queryById(loggedUserId);
      // Traer al miembro a añadir con su id
      const userToRemove = await this.repo.queryById(userToAddId);
      // Añadir a la propiedad friends de cada miembro al otro
      loggedUser.friends = loggedUser.friends.filter(
        (item) => item.id !== userToRemove.id
      );
      userToRemove.friends = userToRemove.friends.filter(
        (item) => item.id !== loggedUser.id
      );
      // Update del miembro loggeado y del miembro a añadir
      const memberUpdated = await this.repo.update(loggedUser);
      this.repo.update(userToRemove);
      // Devolver el usuario loggeado actualizado
      res.json({ results: [memberUpdated] });
    } catch (error) {
      next(error);
    }
  }

  async removeEnemy(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      // Coger la id del miembro loggeado
      if (!req.member?.id || !req.body.id)
        throw new HTTPError(404, 'User not found', 'User not found');
      const loggedUserId = req.member?.id;
      // Coger del body el id del miembro a añadir
      const userToAddId = req.body.id;
      // Traer el miembro logeado con su id
      const loggedUser = await this.repo.queryById(loggedUserId);
      // Traer al miembro a añadir con su id
      const userToRemove = await this.repo.queryById(userToAddId);
      // Añadir a la propiedad friends de cada miembro al otro
      loggedUser.enemies = loggedUser.enemies.filter(
        (item) => item.id !== userToRemove.id
      );
      userToRemove.enemies = userToRemove.enemies.filter(
        (item) => item.id !== loggedUser.id
      );
      // Update del miembro loggeado y del miembro a añadir
      const memberUpdated = await this.repo.update(loggedUser);
      this.repo.update(userToRemove);
      // Devolver el usuario loggeado actualizado
      res.json({ results: [memberUpdated] });
    } catch (error) {
      next(error);
    }
  }
}
