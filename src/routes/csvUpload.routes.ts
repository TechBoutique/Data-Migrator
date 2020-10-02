import { Router } from 'express';
import multer from 'multer';

import { storage, fileFilter} from '../libs/multer';
import { getUploadCsv, home } from '../controllers/csvUpload.controller';   

const router = Router();
const upload = multer({ storage: storage });  

router.route("/migrator").get(home);

router.route('/migrator/csv/upload').post(upload.single("data"), getUploadCsv);

export default router;
