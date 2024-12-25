import {Request,Response} from 'express';

export const createUser = async (req:Request,res:Response) => {
    try {
        const {student_id,belonging_uni,nickname} = req.body;

        res.status(201).json({message:'User created successfully'});
    } catch(error) {
        console.log(error);
        res.status(500).json({message:'Internal server error'});
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      // 사용자 조회 로직 (DB에서 조회)
      // const user = await db.query('SELECT * FROM users WHERE student_id = ?', [id]);
  
      res.status(200).json({ student_id: id, belonging_uni: '부산대학교', nickname: 'user1' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };