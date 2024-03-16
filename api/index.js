import express from 'express'
const app = express()
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
import User from './models/User.js'
import jwt from 'jsonwebtoken'
import cors from 'cors'


mongoose.connect(
	process.env.MONGO_URL,
)

const jwtSecret = process.env.JWT_SECRET

// $ Middleware to parse the request body
app.use(express.json())

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.get('/test', (req, res) => {
    res.json("test ok")
} )

app.post('/register', async (req, res) =>{
    const {username, password} = req.body;
    // $ create the user
    try{
        const createdUser = await User.create({username, password})
        // $ Generate the JWT token
        jwt.sign({userId: createdUser._id}, jwtSecret, {}, (err, token)=>{
            if(err) throw err
            // $ Send the token to the client
            res.cookie('token', token).status(201).json({
                _id: createdUser._id,
            })
        })
    }catch(err){
        if(err) throw err
    }
})

app.listen(4000);

