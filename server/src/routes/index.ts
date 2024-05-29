import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/protected', auth, (req, res) => {
    res.send("Protected route accessed!");
});

export default router;
