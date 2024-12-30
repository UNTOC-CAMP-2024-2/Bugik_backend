import { Request, Response } from "express";
import {isNicknameTaken,isEmailTaken} from "../models/userModel";

export const checkUserName = async (req: Request, res:Response): Promise<any> => {
     try {
       const {nickname} = req.params;
       if(await isNicknameTaken(nickname) == true) {
          return res.status(409).json({
            error: "Nickname already existed",
            message: `There is already a User whose nickname is ${nickname}`,
          });
       }
       return res.status(200).json({ message: `There is no User whose nickname is ${nickname}` });
     } catch (error) {
       console.log(error);
       return res.status(500).json({
         error: "Internal server error",
         message: "maybe db error",
       });
     }
};

export const checkEmail= async (req: Request, res:Response): Promise<any> => {
  try {
    const {email} = req.params;
    if(await isEmailTaken(email) == true) {
       return res.status(409).json({
         error: "email already existed",
         message: `There is already a User whose email is ${email}`,
       });
    }
    return res.status(200).json({ message: `There is no User whose email is ${email}` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
      message: "maybe db error",
    });
  }
};