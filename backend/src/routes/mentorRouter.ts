import express from "express";
import prisma from "../db";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../utils";
import bcrypt from "bcrypt";
import { CustomRequest, authMentorMiddleware, authMiddleware, initialMentorRequest } from "../middleware/authMiddleware";
import { forEachChild } from "typescript";
//! add zod for signup and login for both mentor and user

interface UpdateMentor {
    username?:string,
    imageUrl?:string,
    university?:string,
    specializations?:string[],
    timeslots?:number[],
    price? :number
}


const mentorRouter = express.Router();

mentorRouter.get("/",initialMentorRequest);

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
        const {username:searchname,specializations,university}:{username:string|undefined,specializations:string[]|undefined,university:string|undefined}= req.body;
        console.log("search",searchname)
        // return res.json({searchname,specializations,university});
        if (!searchname && !specializations?.length && !university) {
            return res.status(303).json({ message: "No search criteria provided!" });
          }
        const users = await prisma.mentor.findMany({
        where:{
           username :searchname ?  {contains : searchname as string }:undefined,
           specializations :specializations? {hasEvery : specializations}:undefined,
           university :university ? { contains: university } : undefined
        }
    })
    //username:{contains:searchname as string}
    // console.log("found users",filter);
    
    return res.json({message:`success`,users:users})
    } catch (error) {
        console.log("errro in fiding user",error)
    }
})




mentorRouter.put("/update",authMentorMiddleware,async(req:CustomRequest,res)=>{

    try {
    const {price,username,imageUrl,university,specializations,timeslots}:UpdateMentor= req.body;
    
    const mentorDataToUpdate:UpdateMentor = {};
    if (username) mentorDataToUpdate.username = username;
    if (imageUrl) mentorDataToUpdate.imageUrl = imageUrl;
    if (university) mentorDataToUpdate.university = university;
    if (specializations) mentorDataToUpdate.specializations = specializations;
    if (specializations) mentorDataToUpdate.price = price;
    if(timeslots){
        // return res.json({message:"No time slots"});
        timeslots.sort((a, b) => a - b);
        for (let i = 0; i < timeslots.length; i++) {
            if(timeslots[i] - timeslots[i-1] <=1 ){
                return res.status(300).json({message:"Time slots are too close. Keep difference of atleast 2 !!"})
            }
        }
        mentorDataToUpdate.timeslots = timeslots;
    };
    
    const userId = req.user.id;
    const userUpdated = await prisma.mentor.update({
        where:{
            id:userId 
        },
        data:mentorDataToUpdate
    })
    console.log(userUpdated);
    return res.json({message:userUpdated})
    } catch (error) {
        console.log("Mentor update error",error)
        return res.status(405).json({message:"Mentor update failed !!"})
    }
})


export {mentorRouter};