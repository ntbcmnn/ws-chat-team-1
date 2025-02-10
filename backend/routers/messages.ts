import express from "express";
import auth, {RequestWithUser} from "../middleware/auth";
import permit from "../middleware/permit";
import {Message} from "../models/Message";

const messageRouter = express.Router();

messageRouter.delete("/:id", auth,
    permit("moderator"), async (req, res, next) => {
        const expressReq = req as RequestWithUser;

        const user = expressReq.user;

        const id = req.params.id;

        try {
            const currentMessage = await Message.findById(id);
            if (!currentMessage) {
                res.status(404).send({ error: "Message not found" });
                return;
            }

            if (user.role === "moderator") {
                await Message.findByIdAndDelete(id);
                res.send({ message: "Message deleted successfully." });
            } else {
                res.status(403).send({ error: "You cannot delete the message" });
            }
        } catch (error) {
            next(error);
        }
    });


export default messageRouter;
