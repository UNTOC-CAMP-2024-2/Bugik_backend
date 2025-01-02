import multer from 'multer';
import multerS3 from 'multer-s3';
import { Request } from 'express';
import s3 from '../data/s3'; // v3 S3Client from above

export interface MyRequest extends Request {
  body: {
    menu_date_id: string;
    email: string;
    comment?: string;
    data?: string;
    [key: string]: any;
  };
  file?: Express.Multer.File;
}

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME!,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req: MyRequest, file, cb) => {
      const menuDateId = req.body.menu_date_id;
      const email = req.body.email;
      const uniqueSuffix = `${menuDateId}-${email.replace('@', '-')}-${Date.now()}`;
      cb(null, uniqueSuffix);
    },
  }),
});

export default upload;