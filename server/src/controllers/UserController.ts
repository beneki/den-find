import { Request, Response } from 'express';
import { User } from '../entity/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../index'

export class UserController {
    static register = async (req: Request, res: Response) => {
        const { name, email, password } = req.body;
        if (!(name && email && password)) {
            return res.status(400).send("Name, email and password are required");
        }

        const userRepository = AppDataSource.getRepository(User);
        let user = await userRepository.findOne({ where: { email } });

        if (user) {
            return res.status(409).send("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = userRepository.create({ name, email, password: hashedPassword });
        await userRepository.save(user);

        const token = jwt.sign({ userId: user.id }, "your_jwt_secret", { expiresIn: "1h" });

        res.status(201).send({ user, token, msg: "User created" });
    };

    static login = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.status(400).send("Email and password are required");
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            return res.status(404).send("The user is not found, you need to sign up first.");
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).send("Invalid password");
        }

        const token = jwt.sign({ userId: user.id }, "your_jwt_secret", { expiresIn: "1h" });

        res.send({ user, token });
    };
}
