
import express, { NextFunction } from "express";
import { Request, Response } from 'express';
import prisma from "../db";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../utils";

interface CustomRequest extends Request{
    user?:any
}

const authMiddleware = async(req:CustomRequest,res:Response,next:NextFunction)=>{
    try {
        const token= req.headers.token as string;
        console.log("Token",token);
       
    if(!token){
        return res.json({message:"Please sign in !!"})
    }
    const userID = jwt.verify(token,JWT_SECRET_KEY);
    
    const user  = await prisma.user.findFirst({
        where:{
            id:userID as string
        }
    })
    req.user = user;
    console.log("User",user);
    console.log("Authmiddelware cookie",token);
    next();
    } catch (error) {
        console.log("in middlw",error)
    }
}
export {authMiddleware};