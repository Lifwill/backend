import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';
const router = new Router();
  // Get all Posts
router.route('/').get(AuthController.isAuthenticated);

  // Get one post by cuid
router.route('/login').post(AuthController.login);

// Add a new Post
router.route('/signup').post(AuthController.signup);


export default router;
