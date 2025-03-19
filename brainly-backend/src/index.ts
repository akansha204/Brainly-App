//import syntax is important as it helpd to implement the type safety.
import express from "express";
import { Request, Response } from 'express';
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import {z} from "zod";
const app = express();
// const app: express.Application = express();
import {UserModel,ContentModel} from './db';
app.use(express.json());
import { JWT_PASSWORD } from './config';
import { userMiddleware } from './middleware';
mongoose.connect('mongodb+srv://admin:webdev33@cluster0.zwuxp.mongodb.net/brainly')


app.post('/api/v1/signup', async (req: Request, res: Response): Promise<void> => {    
    const requiredBody = z.object({
        username: z.string().min(3).max(20), 
        password: z.string().min(8, { message: 'Must have at least 8 characters' }).max(20)
    });

    const body = requiredBody.safeParse(req.body);

    if (!body.success) {
        res.status(400).json({ error: body.error });
        return;
    }

    const { username, password } = body.data; 

    try {
        await UserModel.create({
            username,
            password,
        });
        res.status(201).json({ message: 'User created successfully' });
        return;
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
});

app.post('/api/v1/signin',async (req,res)=>{
    const {username,password} = req.body;
    const existingUser = await UserModel.findOne({
        username,
        password
    });
    if(existingUser){
        const token = jwt.sign({
            id:existingUser._id
        },JWT_PASSWORD)
        res.json({
            token
        })
    } else{
        res.status(401).json({
            message:"Invalid username or password"
        })
    }
    
    
})
app.post('/api/v1/content',userMiddleware,async (req,res)=>{
    const link = req.body.link;
    const type = req.body.type;
    await ContentModel.create({
        link,
        type,
        //@ts-ignore
        userId:req.userId,
        tags:[]
    })
    
})
app.get('/api/v1/get-content',userMiddleware,async (req,res)=>{
    //@ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        userId:userId
    }).populate('userId','username'); //populate is used to get the user details from the user collection.Acting like a foreign key 
    res.json({
        content
    })
    
})
app.delete('/api/v1/delete-content',userMiddleware, async (req,res)=>{
    const contentId = req.body.contentId;
    await ContentModel.deleteMany({
        contentId,
        //@ts-ignore
        userId:req.userId
    })
    res.json({
        message:"Content deleted successfully"
    })
    
})
app.post('/api/v1/brain/share',(req,res)=>{
    //share the content with the link.
})
app.get('/api/v1/brain/:shareLink',(req,res)=>{
    //Fetch another user's shared brain content and can access it via link
})


app.listen(3000);
