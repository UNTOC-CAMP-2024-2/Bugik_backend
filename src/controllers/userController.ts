import e, {Request,Response} from 'express';
import * as userModel from '../models/userModel';
import * as auth from '../utils/jwt';

export const createUser = async (req:Request,res:Response): Promise<any> => {
    try {
        const {user_id,belonging_uni,nickname} = req.body;
        let {phone_number,email} = req.body;
        console.log(user_id,belonging_uni,nickname,phone_number,email);
        // 학번 검사
        if(/^\d{9}$/.test(user_id) ==  false) {
          return res.status(400).json({
            error: 'student_id type error',
            message:'it should be numbers'
          });
        }
        //소속대학 검사
        const uni_list = ["인문대학","사회과학대학","자연과학대학","경제통상대학","공과대학","경영대학","약학대학","생활과학대학","사범대학","예술대학","첨단융합학부","나노과학대학","정보의생명대학"];
        if(uni_list.includes(belonging_uni) == false) {
          return res.status(400).json({
            error: 'belonging_uni error',
            message:`there is no uni called ${belonging_uni}`
          });
        }
        // 닉네임 검사
        if(await userModel.isNicknameTaken(nickname)) {
          return res.status(400).json({
            error: 'nickname existed error',
            message:`there is already nickname ${nickname}`
          });
        }
        //휴대폰 번호 검사
        if(phone_number != undefined || phone_number != null) {
          if(/^\d{3}\d{3,4}\d{4}$/.test(phone_number) == false) {
            return res.status(400).json({
              error: 'phone_number type error',
              message:`check your phone number again`
            });
          }
        } else {
          // null로 값 통일
          phone_number = null;
        }
        //이메일 검사사
        if(email != undefined || email != null) {
          if(/^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email) == false) {
              return res.status(400).json({
                error: 'email type error',
                message:`check your email again`
              });
          }
        } else {
          //null로 값 통일
          email = null;
        }
        console.log("유효성 검사 종료");
        await userModel.createUser(user_id,belonging_uni,nickname,phone_number,email);
        return res.status(201).json({message:'User created successfully'});
    } catch(error) {
        console.log(error);
        return res.status(500).json({
          error: 'Internal server error',
          message:'미안하다 나도 무슨 오류인지 모르겠다.'
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
      const { id,belonging_uni,nickname } = req.body;
  
     const user = await userModel.loginByUserId(Number(id),belonging_uni,nickname);
      if(!user) {
        res.status(404).json({
          error: 'No User',
          message: 'User not found'});
      }
      
      console.log(user[0]["user_id"],user[0]["belonging_uni"],user[0]["nickname"]);

      const token = auth.generateToken({user_id: user[0]["user_id"], belonging_uni: user[0]["belonging_uni"], nickname: user[0]["nickname"]});
      res.status(200).json(token);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  