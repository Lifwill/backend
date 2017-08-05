import { Router } from 'express';
import * as AuthController from '../controllers/AuthController';
const AuthRoute = new Router();
  // Get all Posts
AuthRoute.route('/').get(AuthController.loginRequired, AuthController.profile);

  // Get one post by cuid
AuthRoute.route('/login').post(AuthController.login);

// Add a new Post
AuthRoute.route('/signup').post(AuthController.signup);

AuthRoute.loadUser = AuthController.loadUser;

export default AuthRoute;
