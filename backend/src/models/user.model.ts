import mongoose, {type HydratedDocument} from "mongoose";

import bcrypt from "bcryptjs";


// Defining Interface for User
interface IUser  {
    name: string,
    email: string,
    password: string,
    refreshToken?: string,
    avatar?: {
        url?: string,
        public_id?: string,
    },
    isOnline: boolean,
    lastSeen?: Date

    comparePassword(clearTextPassword: string): Promise<boolean>
}

type UserDocument = HydratedDocument<IUser>


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required!"],
        minlength: [2, "Name must be at least 2 characters long!"],
        maxlength: [70, "Name must be less than 70 characters!"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        unique: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "please use a valid email address"],
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
        minlength: [6, "Password must be at least 6 characters long!"],
        select: false
    },
    refreshToken: {
        type: String,
        select: false
    },
    avatar: {
        url: { type: String },
        public_id: { type: String }
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    lastSeen: {
        type: Date,

    }

}, { timestamps: true })

// Password Hashing
userSchema.pre("save", async function (this: UserDocument) {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
})

// Method for comparing password
userSchema.methods.comparePassword = async function (
    this: UserDocument,
    clearTextPassword: string
): Promise<boolean> {
    return await bcrypt.compare(clearTextPassword, this.password)
}

// Typed Model
const User = mongoose.model<IUser> ("User", userSchema);


export default User;