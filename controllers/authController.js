import userModel from '../models/usersModel.js';
import validator from '../middlewares/validator.js';
import beHash from '../utils/hash.js';
import jwt from 'jsonwebtoken';
const signup = async (req, res) => {
    try {
        const { error } = validator.validateSignupSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const { email, password } = req.body;
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const hashedPassword = await beHash.doHash(password);
        const newUser = new userModel({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const signin = async (req, res) => {
    // Signin logic will go here
    try {
        const { error } = validator.validateSigninSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        // Password verification logic will go here (e.g., using bcrypt.compare)
        const isPasswordValid = await beHash.verifyHash(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ 
            userId: user._id,
            email: user.email,
            password: user.password
        }, process.env.TOKEN_SECRET);
        res.cookie('Authorization', `Bearer ${token}`, { expires: new Date(Date.now() + 8 * 3600000), httpOnly: process.env.NODE_ENV === 'production', secure: process.env.NODE_ENV === 'production' });
        res.status(200).json({ message: 'Signin successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const signout = (req, res) => {
    res.clearCookie('Authorization');
    res.status(200).json({
        success: true,   
        message: 'Signout successful' 
    });
}

export default { signup, signin, signout };
