import express from "express";
require("express-async-errors");
import { json } from "body-parser";
import mongoose from "mongoose";

import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/sign-in";
import { signOutRouter } from "./routes/sign-out";
import { signUpRouter } from "./routes/sign-up";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);
app.all("*", async (req, res) => {
	throw new NotFoundError();
});
app.use(errorHandler);

const start = async () => {
	try {
		await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
	} catch (error) {
		console.error(error);
	}

	console.log("Connected to mongodb");

	app.listen(3000, () => {
		console.log("Listening on port 3000!");
		console.log("Mock modification");
	});
};

start();
