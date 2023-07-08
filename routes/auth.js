const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { registerValidation, loginValidation } = require("../validation");


router.post('/register', async (req, res) => {

    // lets validate the user
    let { error } = registerValidation(req.body);

    if(error){
        return res.status(400).json({message:error.details[0].message});
    }

    //Check user exists;
    const emailExists = await User.findOne({email:req.body.email});
    if(emailExists){
        return res.status(400).json({message: "Email already exists"});
    }

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const { name, email, password } = req.body;
    const user = new User({
        name, email, password:hashedPassword
    });

    try {
        const savedUser = await user.save();

        res.status(200).json({user:user._id});

    } catch (error) {
        res.status(400).json({ message: "Error while creating User." })
    }
})

router.post('/login', async(req, res)=>{
    let { error } = loginValidation(req.body);

    if(error){
        return res.status(400).json({message:error.details[0].message});
    }
    //Check email exists;
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return res.status(401).json({message: "Email or Password detals are wrong"});
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword){
        return res.status(401).json({message: "Email or Password detals are wrong"});
    }

    const token = jwt.sign({_id:user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token)
    return res.status(200).json({message:"User logged in", token});


})

module.exports = router;