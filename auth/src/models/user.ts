import mongoose from "mongoose";
import { Password } from "../utils/password";

interface UserAttributes {
	email: string;
	password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
	build(attributes: UserAttributes): any;
}

interface UserDoc extends mongoose.Document {
	email: string;
	password: string;
	// we can add any attributes that mongoose adds automatically
	// createdAt: Date;
	// modifiedAt: Date;
}

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
});

userSchema.pre("save", async function (done) {
	if (this.isModified("password")) {
		const hashed = await Password.toHash(this.get("password"));
		this.set("password", hashed);
	}
	done();
});

// add static function built in to the model to use for static creation of user
userSchema.statics.build = (attributes: UserAttributes) => {
	return new User(attributes);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

const myuser = User.build({ password: "grgerg", email: "gfdfds" });

export { User };
