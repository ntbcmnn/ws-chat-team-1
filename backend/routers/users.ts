import express from "express";
import { Error } from "mongoose";
import User from "../models/User";
import auth, { RequestWithUser } from "../middleware/auth";
import { OAuth2Client } from "google-auth-library";
import config from "../config";
import {imagesUpload} from '../multer';

const usersRouter = express.Router();
const client = new OAuth2Client(config.google.clientId);

usersRouter.post("/google", async (req, res, next) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: config.google.clientId,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            res.status(400).send({ error: "Google login error" });
            return;
        }

        const email = payload.email;
        const id = payload.sub;
        const displayName = payload.name;
        const avatar = payload.picture;

        if (!email) {
            res.status(400).send({ error: "Not enough user data to continue" });
            return;
        }

        let user = await User.findOne({ googleID: id });

        if (!user) {
            user = new User({
                username: email,
                password: crypto.randomUUID(),
                googleID: id,
                displayName,
                avatar,
            });
        }

        user.generateToken();
        await user.save();

        res.send({ message: "Login with Google went successfully", user });
        return;
    } catch (e) {
        next(e);
    }
});

usersRouter.post(
    "/register",
    imagesUpload.single("avatar"),
    async (req, res, next) => {
        try {
            const user = new User({
                username: req.body.username,
                password: req.body.password,
                displayName: req.body.displayName,
                avatar: req.file ? "images" + req.file.filename : null,
            });

            user.generateToken();

            await user.save();
            res.send({ user, message: "Successfully registered" });
        } catch (error) {
            if (error instanceof Error.ValidationError) {
                res.status(400).send(error);
                return;
            }
            next(error);
        }
    },
);

usersRouter.post("/sessions", async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            res.status(400).send({ error: "Username not found" });
            return;
        }

        const isMatch = await user.comparePassword(req.body.password);

        if (!isMatch) {
            res.status(400).send({ error: "Wrong password" });
            return;
        }

        user.generateToken();
        await user.save();

        res.send({ message: "Username and password are correct", user });
    } catch (error) {
        if (error instanceof Error.ValidationError) {
            res.status(400).send(error);
            return;
        }
        next(error);
    }
});

usersRouter.delete("/sessions", auth, async (req, res, next) => {
    let reqWithAuth = req as RequestWithUser;
    const userFromAuth = reqWithAuth.user;
    try {
        const user = await User.findOne({ _id: userFromAuth._id });

        if (user) {
            user.generateToken();
            await user.save();
            res.send({ message: "Successfully logged out" });
        }
    } catch (e) {
        next(e);
    }
});

export default usersRouter;
