import mongoose from "mongoose";
import config from "./config";
import User from "./models/User";
import {randomUUID} from "node:crypto";

const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection('users')
    } catch (e) {
        console.error(e);
    }


    await User.create({
            username: "Sanzhar",
            displayName: "Sake",
            password: "123",
            token: randomUUID(),
            role: "user",
        },
        {
            username: "Kake",
            displayName: "Kamchy",
            password: "123",
            token: randomUUID(),
            role: "moderator",
        }
    )

    await db.close();
};

run().catch(console.error);