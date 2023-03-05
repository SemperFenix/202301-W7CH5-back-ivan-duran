import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { Member } from '../entities/member.js';
import { HTTPError } from '../errors/http.error.js';
import { CustomRequest } from '../interceptors/interceptors.js';
import { Repo } from '../repository/repo.interface.js';
import { Auth, TokenPayload } from '../services/auth.js';
import fs from 'fs/promises';

const debug = createDebug('W7B:MembersController');

export class MembersController {
  // eslint-disable-next-line no-unused-vars
  constructor(public repo: Repo<Member>) {
    debug('Members controller instantiated...');
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const members = await this.repo.query();
      res.json({ results: members });
    } catch (error) {
      next(error);
    }
  }

  // Añadir búsqueda de un miembro por id
  // Añadir búsqueda con search
  // Añadir mostrar amigos y mostrar enemigos => Creo que esto es más del front, ya que los amigos ya están dentro de sus propiedades

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      debug('Registering...');

      if (!req.body.email || !req.body.password)
        throw new HTTPError(401, 'Unathorized', 'No email or pass provided');
      req.body.password = await Auth.hash(req.body.password);
      const newMember = await this.repo.create(req.body);
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
      if (!(await Auth.compareHash(password, member[0].password)))
        throw new HTTPError(401, 'Unauthorized', 'Password not match');
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
      debug('Adding friend...');
      if (!req.member?.id || !req.body.id)
        throw new HTTPError(404, 'User not found', 'User not found');

      // Traer el miembro logeado con su id
      const loggedMember = await this.repo.queryById(req.member?.id);
      // Traer al miembro a añadir con su id
      const memberToAdd = await this.repo.queryById(req.body.id);
      // Añadir a la propiedad friends de cada miembro al otro
      loggedMember.friends.push(memberToAdd);
      memberToAdd.friends.push(loggedMember);
      // Update del miembro loggeado y del miembro a añadir
      const memberUpdated = await this.repo.update(loggedMember);
      // Devolver el usuario loggeado actualizado
      await this.repo.update(memberToAdd);
      debug('Friendship upgraded! =D');
      fs.appendFile(
        './src/log/app_log.txt',
        `\n${loggedMember.name} ${loggedMember.lastName} and ${memberToAdd.name} ${memberToAdd.lastName} are now friends\n`
      );
      res.json({ results: [memberUpdated] });
    } catch (error) {
      next(error);
    }
  }

  async addEnemy(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      debug('Adding enemy...');

      if (!req.member?.id || !req.body.id)
        throw new HTTPError(404, 'User not found', 'User not found');

      const loggedMember = await this.repo.queryById(req.member?.id);
      const memberToAdd = await this.repo.queryById(req.body.id);
      loggedMember.enemies.push(memberToAdd);
      memberToAdd.enemies.push(loggedMember);
      const memberUpdated = await this.repo.update(loggedMember);
      this.repo.update(memberToAdd);
      debug('New enemy to face');
      fs.appendFile(
        './src/log/app_log.txt',
        `\n${loggedMember.name} ${loggedMember.lastName} and ${memberToAdd.name} ${memberToAdd.lastName} are now enemies\n`
      );
      res.json({ results: [memberUpdated] });
    } catch (error) {
      next(error);
    }
  }

  async removeFriend(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      debug('Removing friend...');

      if (!req.member?.id || !req.body.id)
        throw new HTTPError(404, 'User not found', 'User not found');

      const loggedMember = await this.repo.queryById(req.member?.id);
      const memberToRemove = await this.repo.queryById(req.body.id);
      loggedMember.friends = loggedMember.friends.filter(
        (item) => item.id !== memberToRemove.id
      );
      memberToRemove.friends = memberToRemove.friends.filter(
        (item) => item.id !== loggedMember.id
      );
      const memberUpdated = await this.repo.update(loggedMember);
      this.repo.update(memberToRemove);
      debug('Friend removed =(');
      fs.appendFile(
        './src/log/app_log.txt',
        `\n${loggedMember.name} ${loggedMember.lastName} and ${memberToRemove.name} ${memberToRemove.lastName} are no longer friends\n`
      );
      res.json({ results: [memberUpdated] });
    } catch (error) {
      next(error);
    }
  }

  async removeEnemy(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      debug('Removing enemy...');

      if (!req.member?.id || !req.body.id)
        throw new HTTPError(404, 'User not found', 'User not found');
      const loggedMemberId = req.member?.id;
      const memberToAddId = req.body.id;
      const loggedMember = await this.repo.queryById(loggedMemberId);
      const memberToRemove = await this.repo.queryById(memberToAddId);
      loggedMember.enemies = loggedMember.enemies.filter(
        (item) => item.id !== memberToRemove.id
      );
      memberToRemove.enemies = memberToRemove.enemies.filter(
        (item) => item.id !== loggedMember.id
      );
      const updatedMember = await this.repo.update(loggedMember);
      this.repo.update(memberToRemove);
      debug('One less enemy, good job!');
      fs.appendFile(
        './src/log/app_log.txt',
        `\n${loggedMember.name} ${loggedMember.lastName} and ${memberToRemove.name} ${memberToRemove.lastName} are no longer enemies\n`
      );
      res.json({ results: [updatedMember] });
    } catch (error) {
      next(error);
    }
  }

  async editProfile(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      debug('Updating profile...');
      if (!req.member?.id)
        throw new HTTPError(404, 'User not found', 'User not found');
      const member = await this.repo.queryById(req.member.id);
      req.body.id = member.id;
      const updatedMember = await this.repo.update(req.body);
      debug('Profile updated!');
      res.json({ results: [updatedMember] });
    } catch (error) {
      next(error);
    }
  }

  async deleteMember(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      debug('Deleting member...');
      if (!req.member?.id)
        throw new HTTPError(404, 'User not found', 'User not found');
      await this.repo.erase(req.member.id);
      debug("Member deleted ='(");
    } catch (error) {
      next(error);
    }
  }
}
