import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: [true, 'Email is required'], 
        unique: [true, 'Email must be unique'],
        trim: true ,
        lowercase: true,
        minLength: [5, 'Email must be at least 5 characters long'],

    },
    password: { 
        type: String, 
        required: [true, 'Password is required'],
        select: false,
        minLength: [8, 'Password must be at least 8 characters long'] ,
        trim: true
    },
    verivied: {
        type: Boolean,
        default: false,
        select: false
    },
    verificationCode: {
        type: String,
        select: false
    },
    forgotPasswordCode: {
        type: String,
        select: false
    },
    forgotPasswordCodeValidation: {
        type: Date,
        select: false
    }
}, { 
    timestamps: true 
});

const User = mongoose.model('User', userSchema);

export default User;