import multer from 'multer';
import path from 'path';
export const storage = multer.diskStorage({
  destination: function (req, file, cb) {  
    cb(null, path.join(__dirname, '../uploads/'));
  },

  filename: function (req: any, file: any, cb: any) {
    cb(null, file.originalname);
  },
});

export function fileFilter(req: any, file: any, cb: any) {
  if (file.mimetype === 'text/csv') {
    cb(null, true);
  } else {  
    cb(new Error('Document uploaded is not of type csv'), false);
  }
}  


