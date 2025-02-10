import mongoose from "mongoose";
import config from "./config";
import User from "./models/User";
import {randomUUID} from "node:crypto";

const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {

        await db.dropCollection("users");
    } catch (e) {
        console.error(e);
    }

    await User.create(
        {
            username: "Sanzhar",
            displayName: "Savammura",
            password: "123",
            token: randomUUID(),
            role: "moderator",
        },
        {
            username: "Miranda",
            displayName: "Phantom",
            password: "123",
            token: randomUUID(),
            role: "user",
        },
    );


    await db.close();
};

run().catch(console.error);


