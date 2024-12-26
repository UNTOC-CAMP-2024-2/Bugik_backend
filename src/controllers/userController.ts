import {Request,Response} from 'express';
import * as userModel from '../models/userModel';

export const createUser = async (req:Request,res:Response) => {
    try {
        const {student_id,belonging_uni,nickname} = req.body;
        
        await userModel.createUser(student_id,belonging_uni,nickname);
        res.status(201).json({message:'User created successfully'});
    } catch(error) {
        console.log(error);
        res.status(500).json({message:'Internal server error'});
    }
};
/*
INSERT INTO users (user_id, belonging_uni, nickname)
VALUES (:user_id, :belonging_uni, :nickname);

input 
{
  "user_id": "학번",
  "belonging_uni": "정보의생명대학",
  "nickname": "홍길동"
}

output
{
  "message": "User created successfully",
  "token": "토큰큰"
}
{
  "error": "Nickname already exists"
}

*/

export const loginById = async (req: Request, res: Response) => {
    try {
      /*const { id } = req.params;
  
     const user = await userModel.getUserById(Number(id));
      if(!user) {
        res.status(404).json({message: 'User not found'});
      }
      res.status(200).json(user);*/
      /*
      const token = jwt.sign({ userId: user_id }, "SECRET_KEY", { expiresIn: "1h" });
      */
      res.status(200).json({message: 'User created successfully'});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  /*
  input 
  {
  "user_id": "user1234"
  }
  output
  {
  "message": "Login successful",
  "token": "<JWT or some token>"
  }
  {
  "error": "User not found"
  }

  SELECT user_id, belonging_uni, nickname
  FROM users
  WHERE user_id = :user_id;

  */