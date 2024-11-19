import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique:true },
    password: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
})

const UserModel = mongoose.model("User",userSchema)

export default UserModel