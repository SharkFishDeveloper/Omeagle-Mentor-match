import express from "express";
import prisma from "../db";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../utils";
import bcrypt from "bcrypt";
import { authMiddleware } from "../middleware/authMiddleware";
//! add zod for signup and login for both mentor and user

const mentorRouter = express.Router();

mentorRouter.post("/login",async(req,res)=>{
    try {
        const {password,email} = req.body;
        if(!email||!password){
            return res.status(400).json({message:"Invalid email or password"});
        }
    const user = await prisma.mentor.findFirst({
        where:{
            email
        }
    })
    if(!user){return res.json({message:"User does not exist"})}
        const comparePassword = await bcrypt.compare(password,user.password);
    if(!comparePassword){
        return res.json({message:"Invalid password"})
    }else{
        const token = await jwt.sign(user.id,JWT_SECRET_KEY);
        res.cookie('token',token,{httpOnly:true,secure:true,sameSite:true,maxAge:3600000})
        return res.json({message:"Logged in successfully !!"})

    }
    } catch (error) {
     console.log(error);   
    }
    finally{
        prisma.$disconnect();
    }
})

mentorRouter.post("/signup",async(req,res)=>{
    const {username,password,email} = req.body;
    try {
        const findUSer = await prisma.mentor.findMany({
            where:{
                email,
                username
            }
        })
        if(findUSer.length > 0){
            return res.status(400).json({message:"User already exists !!"})
        }
        const cryptedPassword =await bcrypt.hash(password,10);
        const user = await prisma.mentor.create({
            data:{username,password:cryptedPassword,email},
        })
        const token = await jwt.sign(user.id,JWT_SECRET_KEY);
        res.cookie('token',token,{httpOnly:true,secure:true,sameSite:true,maxAge:3600000})
        return res.json({message:"Success, signup",user:user})
    } catch (error) {
        console.log("error in db",error);
        return res.json({message:"Failed, signup"})
    }
    finally{
        prisma.$disconnect();
    }
})

mentorRouter.get(`/:id`,authMiddleware,async(req,res)=>{
    try {

        const mentorID = req.params.id ;
        const mentorPara = mentorID.split("=")[1];
        console.log("her",mentorID);
        const user = await prisma.mentor.findUnique({
        where:{
            id:mentorPara 
        }
        })
        if(!user){
        return res.status(400).json({message:"No mentor found"});
        }
        else{
        return res.json({message:user})
        }
    } 
    catch (error) {
     console.log(error);   
     res.status(403).json({message:"No mentor found",error:error})
    }
    finally{
        prisma.$disconnect();
    }
})

mentorRouter.get("/",authMiddleware,async(req,res)=>{
    try {
        const searchname = req.query["search"];
    if(searchname=== null){
        return res.status(400).json({message:"Add a name"});
    }
    const users = await prisma.user.findMany({
        where:{
            username:{
                contains:searchname as string
            }
        }
    })
    console.log("found users",users);
    
    return res.json({message:`success`,users:users})
    } catch (error) {
        console.log("errro in fiding user",error)
    }
})




export {mentorRouter};