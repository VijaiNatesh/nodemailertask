const express = require('express')
const userRoute = express.Router()
const User = require('../../model/User')
const authTokenGenerator = require('../../utlis/generateToken')
const sendEmail = require('../../utlis/sendEMail')
const crypto = require('crypto')



userRoute.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExist = await User.findOne({ email: email })
        if (userExist) {
            res.send('User Already Signed in')
        }
        const user = await User.create({ name, email, password })
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            token: authTokenGenerator(user._id),
        })
    }
    catch (error) {
        res.send(error)
    }

})

userRoute.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email })
    if (user.password === req.body.password) {
        res.json({
            _id: user._id,
            name: user.name,
            token: authTokenGenerator(user._id)
        })
    }
    else {
        res.send('Invalid login credentials');
    }
})

userRoute.post('/mailsend', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: req.body.email })
    if (authTokenGenerator(user._id)) {
        try {
            await sendEmail(req.body.to, req.body.subject, req.body.text);
            res.send("Email Sent")
        }
        catch (error) {
            console.log(error)
        }
    }
    else {
        res.send("Unauthorized")
    }
})

userRoute.post('/forgotpassword', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: req.body.email })

    if (user) {      
        user.password = crypto.randomBytes(32).toString("hex")
        await user.save();
        await sendEmail(req.body.email, "RANDOM PASSWORD", user.password);
        res.send("Random Password sent to your registered email")
    }
    else {
        res.send("User doesn't exists")
    }
})

userRoute.put('/changepassword/:id', async(req,res)=> {
    const user = await User.findById(req.params.id)
    if(user.password === req.body.token){
        await User.findByIdAndUpdate(req.params.id, req.body)
        res.send("password changed")
    }
    else{
        res.send("Token not matching")
    }
    
})

module.exports = userRoute;