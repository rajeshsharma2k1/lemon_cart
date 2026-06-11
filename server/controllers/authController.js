const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('JsonWebToken');
const sendEmail = require('../utils/sendEmail');


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d'});
};

// Registering a new User
const registerUser = async (req, res) => {
    const { name, email, password} = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({message: 'User already exists.'});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = await User.create({ name, email, password: hashedPassword });
        if(user) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            const message =
            `Welcome to LemonCart, ${name}! Thank you for restering with us.
            Your OTP for login in LemonCart is ${otp}`;

            await sendEmail(email, 'Welcome to LemonCart', message);

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User Login 
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid email or password'});
        }
     } catch (error) {
        res.status(500).json({ message: 'Server error' });
     }
};

// Get User

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUsers
};



//todo1: password hash before saving to database
//todo2: JWT token generation for authentication
//todo3: OTP sending and verification for email confirmation
//todo4: send welcome mail
